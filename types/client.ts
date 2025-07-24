export interface Client {
  id: string;
  name: string;
  type: "Individual" | "Company";
  email: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export type SortField =
  | "name"
  | "createdAt"
  | "updatedAt"
  | "id"
  | "email"
  | "type";

export interface SortCriteria {
  field: SortField;
  direction: "asc" | "desc";
}
