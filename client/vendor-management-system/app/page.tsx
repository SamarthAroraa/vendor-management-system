import VendorRankingDashboard from "@/components/vendor-ranking-dashboard"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-semibold mb-6">Vendor Ranking System</h1>
      <VendorRankingDashboard />
    </main>
  )
}


// {'ranking_table': {'calculation_strategy': 'The top 5 vendors are selected based on a combination of factors including Quantity Contribution, OTIF, Vendor Evaluation Score and Capacity Utilization.', 'fields': ['Rank', 'Sr. No.', 'Vendor Name', 'Main Product', 'AW24 Qty Contribution', 'AW24 OTIF', 'Vendor Evaluation Score', 'Capacity Utilisation last ssn', 'AW24 Retail Contribution', 'Reasoning'], 'vendors': [{'Rank': 1, 'Sr. No.': 18, 'Vendor Name': 'MAITREE APPARELS', 'Main Product': 'Core & Fashion Denim', 'AW24 Qty Contribution': 0.2889, 'AW24 OTIF': 0.9474, 'Vendor Evaluation Score': None, 'Capacity Utilisation last ssn': 13653.57142857143, 'AW24 Retail Contribution': 0.408, 'Reasoning': 'High qty contribution and good on-time delivery for denim products.'}, {'Rank': 2, 'Sr. No.': 19, 'Vendor Name': 'OM ENTERPRISES', 'Main Product': 'Casual Tops & Dress, Esseltial Tees & Bottom, Fashion Denim', 'AW24 Qty Contribution': 0.0945, 'AW24 OTIF': 0.8667, 'Vendor Evaluation Score': None, 'Capacity Utilisation last ssn': 8186.6, 'AW24 Retail Contribution': 0.1238, 'Reasoning': 'Good Retail contribution and good on-time delivery for denim products.'}, {'Rank': 3, 'Sr. No.': 20, 'Vendor Name': 'SHIVRAM IMPEX LLP', 'Main Product': 'Fashion Jeans', 'AW24 Qty Contribution': 0.0442, 'AW24 OTIF': 0.6842, 'Vendor Evaluation Score': None, 'Capacity Utilisation last ssn': 6058.25, 'AW24 Retail Contribution': 0.0695, 'Reasoning': 'Good retail contribution for denim products but less OTIF.'}, {'Rank': 4, 'Sr. No.': None, 'Vendor Name': 'Aaa Textile Pvt Ltd', 'Main Product': 'Garment Vendor', 'AW24 Qty Contribution': None, 'AW24 OTIF': None, 'Vendor Evaluation Score': 3.72, 'Capacity Utilisation last ssn': None, 'AW24 Retail Contribution': None, 'Reasoning': 'Good Vendor Evaluation Score.'}, {'Rank': 5, 'Sr. No.': None, 'Vendor Name': 'Aagam Apparels Pvt Ltd', 'Main Product': 'Garment Vendor', 'AW24 Qty Contribution': None, 'AW24 OTIF': None, 'Vendor Evaluation Score': 3.8, 'Capacity Utilisation last ssn': None, 'AW24 Retail Contribution': None, 'Reasoning': 'Good Vendor Evaluation Score.'}]}}
// INFO:     127.0.0.1:50540 - "POST /upload_spreadsheet/ HTTP/1.1" 200 OK

