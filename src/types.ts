// src/types.ts
export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export type ValidationRule =
  | { type: "required" }
  | { type: "minLength"; value: number }
  | { type: "maxLength"; value: number }
  | { type: "email" }
  | { type: "passwordRule"; pattern?: string; message?: string };

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldSchema {
  id: string;
  name: string;
  label: string;
  type: "number" | "text" | "textarea" | "select" | "radio" | "checkbox" | "date" | "email";
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: string | number | string[] | null; // NEW
  derived?: {
    expression: any;
    parents: string[];
    formula: string;
  } | null;
  validation?: { // NEW
    email?: boolean;
    minLength?: number;
  };
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string; // ISO string
  fields: FieldSchema[];
}
