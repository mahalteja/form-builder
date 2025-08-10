// src/utils/storage.ts
// src/utils/storage.ts
import type { FormSchema } from "../types";

const KEY = "form_builder_forms_v1";
const SELECTED = "form_builder_selected_v1";

export function getAllForms(): FormSchema[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FormSchema[];
  } catch (e) {
    console.error("parse forms error", e);
    return [];
  }
}

export function saveFormSchema(schema: FormSchema) {
  const all = getAllForms();
  all.push(schema);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getFormById(id: string): FormSchema | undefined {
  return getAllForms().find((f) => f.id === id);
}

export function setSelectedForm(schema: FormSchema) {
  localStorage.setItem(SELECTED, JSON.stringify(schema));
}

export function getSelectedForm(): FormSchema | null {
  const raw = localStorage.getItem(SELECTED);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FormSchema;
  } catch {
    return null;
  }
}


export function deleteForm(id: string) {
  const forms = getAllForms().filter((f) => f.id !== id);
  localStorage.setItem(KEY, JSON.stringify(forms)); // ✅ use KEY
}
