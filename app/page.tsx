"use client";

import { useState, useEffect } from "react";
import { ClientTable } from "@/components/client-table";
import type { Client, SortCriteria } from "@/types/client";

const mockClients: Client[] = [
  {
    id: "20",
    name: "John Doe",
    type: "Individual",
    email: "johndoe@email.com",
    status: "active",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-20T14:45:00"),
    updatedBy: "hello world",
  },
  {
    id: "21",
    name: "Test Test",
    type: "Individual",
    email: "test@test.com",
    status: "active",
    createdAt: new Date("2024-01-10T09:15:00"),
    updatedAt: new Date("2024-01-18T16:20:00"),
    updatedBy: "hello world",
  },
  {
    id: "22",
    name: "Alice Johnson",
    type: "Company",
    email: "alice@company.com",
    status: "inactive",
    createdAt: new Date("2024-01-05T08:00:00"),
    updatedAt: new Date("2024-01-25T11:30:00"),
    updatedBy: "admin user",
  },
  {
    id: "23",
    name: "Bob Smith",
    type: "Individual",
    email: "bob@email.com",
    status: "active",
    createdAt: new Date("2024-01-20T13:45:00"),
    updatedAt: new Date("2024-01-22T09:10:00"),
    updatedBy: "system",
  },
  {
    id: "24",
    name: "Corporate Inc",
    type: "Company",
    email: "contact@corporate.com",
    status: "active",
    createdAt: new Date("2024-01-12T11:20:00"),
    updatedAt: new Date("2024-01-24T15:55:00"),
    updatedBy: "manager",
  },
  {
    id: "25",
    name: "Sarah Wilson",
    type: "Individual",
    email: "sarah@email.com",
    status: "inactive",
    createdAt: new Date("2024-01-08T14:30:00"),
    updatedAt: new Date("2024-01-15T10:25:00"),
    updatedBy: "admin",
  },
  {
    id: "26",
    name: "Tech Solutions Ltd",
    type: "Company",
    email: "info@techsolutions.com",
    status: "active",
    createdAt: new Date("2024-01-25T16:00:00"),
    updatedAt: new Date("2024-01-26T12:40:00"),
    updatedBy: "system",
  },
  {
    id: "27",
    name: "Mike Brown",
    type: "Individual",
    email: "mike@email.com",
    status: "active",
    createdAt: new Date("2024-01-03T07:45:00"),
    updatedAt: new Date("2024-01-28T18:15:00"),
    updatedBy: "hello world",
  },
];

export default function ClientsPage() {
  const [clients] = useState<Client[]>(mockClients);
  const [activeTab, setActiveTab] = useState<"all" | "individual" | "company">(
    "all"
  );
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filteredClients = clients.filter((client) => {
    const tabMatch =
      activeTab === "all" || client.type.toLowerCase() === activeTab;

    const searchMatch =
      searchQuery === "" ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch =
      statusFilter === "all" || client.status === statusFilter;

    return tabMatch && searchMatch && statusMatch;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    for (const criteria of sortCriteria) {
      let comparison = 0;

      switch (criteria.field) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "createdAt":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "updatedAt":
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case "id":
          comparison = Number.parseInt(a.id) - Number.parseInt(b.id);
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }

      if (comparison !== 0) {
        return criteria.direction === "desc" ? -comparison : comparison;
      }
    }
    return 0;
  });

  useEffect(() => {
    const saved = localStorage.getItem("clientSortCriteria");
    if (saved) {
      setSortCriteria(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clientSortCriteria", JSON.stringify(sortCriteria));
  }, [sortCriteria]);

  return (
    <div className="container mx-auto p-6">
      <ClientTable
        clients={sortedClients}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sortCriteria={sortCriteria}
        onSortCriteriaChange={setSortCriteria}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  );
}
