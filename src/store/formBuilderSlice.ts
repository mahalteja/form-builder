// src/store/formBuilderSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FieldSchema } from "../types";

interface BuilderState {
  fields: FieldSchema[];
}

const initialState: BuilderState = {
  fields: [],
  
};

const slice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    addField(state, action: PayloadAction<{ type: FieldSchema["type"] }>) {
      const id = cryptoRandomId();
      state.fields.push({
        id,
        name: "Untitled",
        type: action.payload.type,
        label: "Untitled",
        required: false,
        defaultValue: null,
        options: [],
        validation: {},
        derived: null,
      });
    },
    updateField(state, action: PayloadAction<{ id: string; patch: Partial<FieldSchema> }>) {
      const f = state.fields.find((x) => x.id === action.payload.id);
      if (f) Object.assign(f, action.payload.patch);
    },
    removeField(state, action: PayloadAction<string>) {
      state.fields = state.fields.filter((x) => x.id !== action.payload);
    },
    reorderField(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (from < 0 || to < 0 || from >= state.fields.length || to >= state.fields.length) return;
      const [item] = state.fields.splice(from, 1);
      state.fields.splice(to, 0, item);
    },
    setFields(state, action: PayloadAction<FieldSchema[]>) {
      state.fields = action.payload;
    },
    reset(state) {
      state.fields = [];
    },
  },
});

function cryptoRandomId() {
  // simple UUID-like id
  return (crypto && (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2, 9));
}

export const { addField, updateField, removeField, reorderField, setFields, reset } = slice.actions;
export default slice.reducer;
