"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QueryInputProps {
  onSubmitQuery: (query: string) => void;
  isLoading: boolean;
}

export default function QueryInput({
  onSubmitQuery,
  isLoading,
}: QueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitQuery(query);
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    onSubmitQuery(exampleQuery);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter query (e.g., 'sort by score', 'top 3', 'category IT')"
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Query
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <p className="text-sm text-muted-foreground mr-2">Examples:</p>
        <button
          onClick={() => handleExampleClick("sort by quality")}
          className="text-sm text-primary hover:underline"
        >
          sort by quality
        </button>
        <button
          onClick={() => handleExampleClick("top 3")}
          className="text-sm text-primary hover:underline"
        >
          top 3
        </button>
        <button
          onClick={() => handleExampleClick("category IT")}
          className="text-sm text-primary hover:underline"
        >
          category IT
        </button>
      </div>
    </div>
  );
}
