
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  onSearch: (query: string, type: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("name");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
    }
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("", searchType);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-2 w-full max-w-4xl health-card p-2"
    >
      <div className="flex-1 flex items-center relative">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients..."
          className="health-input pl-10 w-full h-12 text-lg"
          aria-label="Search patients"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-2"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        <Select
          value={searchType}
          onValueChange={setSearchType}
        >
          <SelectTrigger className="w-[180px] h-12">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Patient Name</SelectItem>
            <SelectItem value="aadhar">Aadhar Number</SelectItem>
            <SelectItem value="regNo">Registration No.</SelectItem>
            <SelectItem value="phone">Phone Number</SelectItem>
          </SelectContent>
        </Select>
        
        <Button type="submit" className="h-12 px-6">
          Search
        </Button>
      </div>
    </form>
  );
}
