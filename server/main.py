from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from google import genai
from google.genai import types
import dotenv
import os
import shutil
import pandas as pd  # Import pandas for file conversion
import json

dotenv.load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, adjust as necessary
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

SYSTEM_INSTRUCTION="""This is the vendor info for some key vendors in our fashion business, 
give them scores, rank them and give reasoning. Just give the JSON object ranked on the final score and nothing else. It is critical that you Do not change the 
structure or keys of the json object as it is used for parsing.''
Use this ranking framework weightage:
    - Quality Score: 42%
    - On time delivery 25%
    - Magin Score: 16%
    - Fit Score: 10%
    - Compliance: 7%
For the ranking, table, you must provide a json object with the following fields: 
{
  "calculation_strategy": "the strategy used to calculate the score",
  "vendors": [
    {
      "Rank": 1,
      "Vendor Name": "Acme Supplies",
      "Main Product": "Office Supplies",
      "Compliance Score": 90,
      "Quality Score": 92,
      "Tech Score": 88,
      "OTIF %": 95,
      "Margin Score": 65,
      "Final Score": 92,
      "Strategy": "Cost Efficiency and Quality",
      "Reasoning": "Consistent performance across all metrics."
    },
    {
      "Rank": 2,
      "Vendor Name": "TechPro Solutions",
      "Main Product": "IT Services",
      "Compliance Score": 85,
      "Quality Score": 88,
      "Tech Score": 82,
      "OTIF %": 90,
      "Margin Score": 65,
      "Final Score": 88,
      "Strategy": "Quality and Delivery Time",
      "Reasoning": "Strong delivery performance with good quality."
    },
  ]
}

I repeat, it is critical that you Do not change the structure or keys of the json object as it is used for parsing.
"""
FORMAT_PROMPT="""Format the following JSON object into the given format. Just give the JSON object ranked on the final score and nothing else. It is critical that you Do not change the    
structure or keys of the json object as it is used for parsing.
{
  "calculation_strategy": "the strategy used to calculate the score",
  "vendors": [
    {
      "Rank": 1,
      "Vendor Name": "Acme Supplies",
      "Main Product": "Office Supplies",
      "Compliance Score": 90,
      "Quality Score": 92,
      "Tech Score": 88,
      "OTIF %": 95,
      "Margin Score": 65,
      "Final Score": 92,
      "Strategy": "Cost Efficiency and Quality",
      "Reasoning": "Consistent performance across all metrics."
      },
      {
      ...same format for all objects
      }
  ]
}
Just give the JSON object and nothing else.
"""
MOCK_RESPONSE="""
```json\n{"calculation_strategy": "Weighted average of key metrics, normalized and scaled to a 100-point scale.  Weights: Margin (10%), OTIF (25%), Tech Rating (15%), Quality Rating (25%), Compliance (25%).  Where data was missing, a conservative average was applied to avoid skewing results.", "vendors": [{"Rank": 1, "Vendor Name": "Teena Knit Garments", "Main Product": "Core T-Shirts , Athleisure", "Compliance Score": 100, "Quality Score": 100, "Tech Score": 100, "OTIF %": 94, "Margin Score": 51, "Final Score": 86, "Strategy": "Focus on maintaining high compliance, quality, and tech scores while improving margin.", "Reasoning": "Excellent scores in compliance, quality, and tech, but margin needs improvement. High style count indicates strong design capabilities."}, {"Rank": 2, "Vendor Name": "Kratika Fashion", "Main Product": "Tops, Dresses", "Compliance Score": 100, "Quality Score": 100, "Tech Score": 80, "OTIF %": 100, "Margin Score": 50, "Final Score": 86, "Strategy": "Maintain high scores in compliance, quality, and OTIF while improving tech and margin.", "Reasoning": "Very strong in compliance, quality, and OTIF, but tech and margin are areas for potential growth. High style count suggests good design variety."}, {"Rank": 3, "Vendor Name": "Alla Moda Knitwear Private Limited", "Main Product": "Fashion Knits tops and winterwear", "Compliance Score": 100, "Quality Score": 100, "Tech Score": 100, "OTIF %": 100, "Margin Score": 44, "Final Score": 84, "Strategy": "Maintain high scores in compliance, quality, tech, and OTIF while improving margin.", "Reasoning": "Excellent scores in compliance, quality, tech, and OTIF, but margin is an area for potential growth. Good style count indicates a solid product line."}, {"Rank": 4, "Vendor Name": "Ma\'am Arts", "Main Product": "Tops, Dresses", "Compliance Score": 100, "Quality Score": 100, "Tech Score": 100, "OTIF %": 100, "Margin Score": 49, "Final Score": 84, "Strategy": "Maintain high scores in compliance, quality, tech, and OTIF while improving margin.", "Reasoning": "Excellent scores in compliance, quality, tech, and OTIF, but margin is an area for potential growth. Good style count indicates a solid product line."}, {"Rank": 5, "Vendor Name": "Trucarekidz India Private Limited", "Main Product": "T- shirts", "Compliance Score": 80, "Quality Score": 80, "Tech Score": 100, "OTIF %": 100, "Margin Score": 45, "Final Score": 73, "Strategy": "Maintain high scores in tech and OTIF while improving compliance, quality, and margin.", "Reasoning": "Very strong in tech and OTIF, but compliance, quality, and margin are areas for potential growth. Good style count indicates a solid product line."}]}```
"""
TEMPERATURE = 0.1
MAX_TOKENS = 30000

@app.post("/upload_spreadsheet/")
async def upload_spreadsheet(files: list[UploadFile] = File(...), user_prompt: str = Form(...)):
    print("userp", user_prompt, os.environ.get("GEMINI_API_KEY"))
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    uploaded_files = []
    temp_folder = "./temp"
    if not os.path.exists(temp_folder):
        os.makedirs(temp_folder)
    print(os.listdir("./temp"))
    for file in files:
        # Save the uploaded file to a temporary location
        file_location = f"./temp/{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        # Convert Excel files to CSV if necessary
        if file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
            # Read the Excel file with all sheets
            xls = pd.ExcelFile(file_location)
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=sheet_name)
                # Save each sheet as a separate CSV
                csv_file_location = f"./temp/{file.filename}_{sheet_name}.csv"
                df.to_csv(csv_file_location, index=False)
                uploaded_files.append(client.files.upload(file=csv_file_location))
        else:
            uploaded_files.append(client.files.upload(file=file_location))

    model = "gemini-2.0-flash-lite"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_uri(
                    file_uri=uploaded_files[i].uri,
                    mime_type=uploaded_files[i].mime_type,
                ) for i in range(len(uploaded_files))
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text=user_prompt
                ),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(
                    text="Analyze the uploaded vendor spreadsheets and provide insights."
                ),
            ],
        ),
    ]

    # Ensure that the contents list is not empty before proceeding
    if not any(content.parts for content in contents):
        raise ValueError("The contents parameter cannot be empty. Please provide valid content.")
    generate_content_config = types.GenerateContentConfig(
        temperature=TEMPERATURE,
        top_p=0.95,
        top_k=40,
        max_output_tokens=MAX_TOKENS,
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(
                text=SYSTEM_INSTRUCTION
            ),
        ],
    )
    

    # Cleanup the ./temp folder
    temp_folder = "./temp"
    if os.path.exists(temp_folder):
        shutil.rmtree(temp_folder)
    os.makedirs(temp_folder)

    response_text = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if chunk.text:
            response_text += chunk.text
    response_string = response_text 
    # Find the JSON content within the triple backticks
    json_start = response_string.find('```json\n') + len('```json\n')
    json_end = response_string.rfind('```')
    
    if json_start > len('```json\n') - 1 and json_end > json_start:
        json_string = response_string[json_start:json_end].strip()
        
        # Parse the JSON string into a Python dictionary
        parsed_data = json.loads(json_string)
        print("parsed_data", parsed_data)
    formatted_response = client.models.generate_content(
        model="gemini-2.0-flash-lite", # Replace with the appropriate model ID
        contents=[
            types.Part.from_text(
                text=json.dumps(parsed_data)  # Convert parsed_data to JSON string
            )
        ],
        config=types.GenerateContentConfig(
            temperature=TEMPERATURE,
            top_p=0.95,
            top_k=40,
            max_output_tokens=MAX_TOKENS,
            response_mime_type="text/plain",
            system_instruction=[
                types.Part.from_text(
                    text=FORMAT_PROMPT
                ),
            ],
        ),
    )
    print("formatted_response", formatted_response)
    response_string = formatted_response.text
    # Find the JSON content within the triple backticks
    json_start = response_string.find('```json\n') + len('```json\n')
    json_end = response_string.rfind('```')
    
    if json_start > len('```json\n') - 1 and json_end > json_start:
        json_string = response_string[json_start:json_end].strip()
        
        # Parse the JSON string into a Python dictionary
        parsed_data = json.loads(json_string)
    # Collect the formatted response
    
    return {"response": parsed_data}

