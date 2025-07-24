"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortPanel } from "@/components/sort-panel";
import type { Client, SortCriteria } from "@/types/client";
import { FiSearch, FiBell, FiFilter, FiPlus } from "react-icons/fi";
import { HiArrowsUpDown } from "react-icons/hi2";

interface ClientTableProps {
  clients: Client[];
  activeTab: "all" | "individual" | "company";
  onTabChange: (tab: "all" | "individual" | "company") => void;
  sortCriteria: SortCriteria[];
  onSortCriteriaChange: (criteria: SortCriteria[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (filter: "all" | "active" | "inactive") => void;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ClientTable({
  clients,
  activeTab,
  onTabChange,
  sortCriteria,
  onSortCriteriaChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ClientTableProps) {
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedClients, setSelectedClients] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  const tabs = [
    { key: "all" as const, label: "All" },
    { key: "individual" as const, label: "Individual" },
    { key: "company" as const, label: "Company" },
  ];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients(new Set());
      setSelectAll(false);
    } else {
      const allClientIds = new Set(clients.map((client) => client.id));
      setSelectedClients(allClientIds);
      setSelectAll(true);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId);
    } else {
      newSelected.add(clientId);
    }
    setSelectedClients(newSelected);

    setSelectAll(newSelected.size === clients.length && clients.length > 0);
  };

  React.useEffect(() => {
    if (clients.length === 0) {
      setSelectAll(false);
    } else {
      setSelectAll(selectedClients.size === clients.length);
    }
  }, [clients.length, selectedClients.size]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearchInput(!showSearchInput)}
            >
              <FiSearch className="h-4 w-4" />
            </Button>
            {showSearchInput && (
              <div className="absolute top-10 right-0 z-20">
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowSortPanel(!showSortPanel)}
          >
            <HiArrowsUpDown className="h-4 w-4" />
            {sortCriteria.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                {sortCriteria.length}
              </Badge>
            )}
            {showSortPanel && (
              <div className="absolute top-8 left-0 z-10">
                <SortPanel
                  sortCriteria={sortCriteria}
                  onSortCriteriaChange={onSortCriteriaChange}
                  onClose={() => setShowSortPanel(false)}
                />
              </div>
            )}
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowStatusFilter(!showStatusFilter)}
            >
              <FiFilter className="h-4 w-4" />
            </Button>
            {showStatusFilter && (
              <div className="absolute top-10 right-0 z-20 bg-white border border-gray-200 rounded-md shadow-lg p-2 min-w-[120px]">
                <div className="space-y-1">
                  {["all", "active", "inactive"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onStatusFilterChange(
                          status as "all" | "active" | "inactive"
                        );
                        setShowStatusFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors capitalize ${
                        statusFilter === status
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button className="bg-black text-white hover:bg-gray-800">
            <FiPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {(searchQuery || statusFilter !== "all" || sortCriteria.length > 0) && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 capitalize">
              Status: {statusFilter}
              <button
                onClick={() => onStatusFilterChange("all")}
                className="ml-1 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          )}
          {sortCriteria.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {sortCriteria.length} sort{sortCriteria.length > 1 ? "s" : ""}{" "}
              applied
              <button
                onClick={() => onSortCriteriaChange([])}
                className="ml-1 hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {selectedClients.size > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3">
          <span className="text-sm text-blue-700">
            {selectedClients.size} client{selectedClients.size > 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedClients(new Set())}
            >
              Clear Selection
            </Button>
            <Button variant="outline" size="sm">
              Delete Selected
            </Button>
            <Button variant="outline" size="sm">
              Export Selected
            </Button>
          </div>
        </div>
      )}

      <div className="flex space-x-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  title="Select all clients"
                  ref={(input) => {
                    if (input) {
                      input.indeterminate =
                        selectedClients.size > 0 &&
                        selectedClients.size < clients.length;
                    }
                  }}
                />
              </TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Client Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Updated By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                className={selectedClients.has(client.id) ? "bg-blue-50" : ""}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded"
                    title="Select client"
                    checked={selectedClients.has(client.id)}
                    onChange={() => handleClientSelect(client.id)}
                  />
                </TableCell>
                <TableCell className="text-blue-600 font-medium">
                  {client.id}
                </TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.type}</TableCell>
                <TableCell className="text-gray-600">{client.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        client.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs capitalize ${
                        client.status === "active"
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {formatDate(client.createdAt)}
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {formatDateTime(client.updatedAt)}
                </TableCell>
                <TableCell className="text-gray-600">
                  {client.updatedBy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
