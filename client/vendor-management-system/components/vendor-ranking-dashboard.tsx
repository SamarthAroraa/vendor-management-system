"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FileUploader from "@/components/file-uploader";
import VendorTable from "@/components/vendor-table";
import QueryInput from "@/components/query-input";
import ExplanationSection from "@/components/explanation-section";
import type { Vendor } from "@/types/vendor";

export default function VendorRankingDashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [isRanked, setIsRanked] = useState(false);
  const [explanation, setExplanation] = useState("");

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleRankVendors = async () => {
    setIsLoading(true);
    // Simulate ranking process
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("user_prompt", "Give me the overall top 5 vendors");

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
    try {
      const response = await fetch(
        `${apiBaseUrl}/upload_spreadsheet/`,
        requestOptions
      );
      console.log("response", response);
      const data = await response.json();
      console.log("data", data);
      const rankedVendors = data.response.vendors.map((vendor) => {
        const { ...otherFields } = vendor;
        return {
          ...otherFields, // Spread other fields dynamically
        };
      });

      setVendors(rankedVendors);
      setFilteredVendors(rankedVendors);
      setIsRanked(true);
      setIsLoading(false);
      setExplanation("Weighted average of Vendor Evaluation Score, FI RFT Score, AOQL Score, Testing Score, and Pre-Production Score. Weights: Vendor Evaluation (0.25), FI RFT Score (0.25), AOQL Score (0.10), Testing Score (0.20), Pre-Production Score (0.20");
    } catch (error) {
      console.error("Error ranking vendors:", error);
      setIsLoading(false);
    }
  };

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    // Simulate ranking process
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("user_prompt", query);

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload_spreadsheet/",
        requestOptions
      );
      console.log("response", response);
      const data = await response.json();
      console.log("data", data);
      const rankedVendors = data.response.vendors.map((vendor) => {
        const { ...otherFields } = vendor;
        return {
          ...otherFields, // Spread other fields dynamically
        };
      });

      setVendors(rankedVendors);
      setFilteredVendors(rankedVendors);
      setIsRanked(true);
      setIsLoading(false);
      setExplanation(data.response.calculation_strategy);
    } catch (error) {
      console.error("Error ranking vendors:", error);
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="upload">Upload & Rank</TabsTrigger>
        <TabsTrigger value="analysis" disabled={!isRanked}>
          Analysis
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <Card>
          <CardContent className="pt-6">
            <FileUploader onFilesUploaded={handleFileUpload} />
            <div className="mt-4 mb-2">
              <p className="text-sm text-muted-foreground">
                {files.length > 0
                  ? `${files.length} file(s) uploaded`
                  : "No files uploaded"}
              </p>
            </div>
            <button
              onClick={handleRankVendors}
              disabled={files.length === 0 || isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rank My Vendors
            </button>
          </CardContent>
        </Card>

        {isRanked && (
          <div className="mt-6">
            <VendorTable vendors={filteredVendors} />
            <ExplanationSection explanation={explanation} />
          </div>
        )}
      </TabsContent>

      <TabsContent value="analysis">
        <Card>
          <CardContent className="pt-6">
            <QueryInput onSubmitQuery={handleQuery} isLoading={isLoading} />
            <div className="mt-6">
              <VendorTable vendors={filteredVendors} />
              <ExplanationSection explanation={explanation} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
