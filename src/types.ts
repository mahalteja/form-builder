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
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: any;
   options?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    password?: boolean; // min 8 chars, must contain number
  };
  derived?: {
    expression: any;
    parents: string[]; // parent field IDs
    formula: string;   // e.g., "(2025 - Number(parentValues.dob.split('-')[0]))"
  };
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string; // ISO string
  fields: FieldSchema[];
}
