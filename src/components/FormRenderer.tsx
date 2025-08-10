import { useEffect } from "react";
import type { FieldSchema } from "../types";
import { evaluateDerivedField } from "../utils/derived";

interface FormRendererProps {
  fields: FieldSchema[];
  values: Record<string, any>;
  onChange: (id: string, value: any) => void;
  errors: Record<string, string | null>;
}

export default function FormRenderer({
  fields,
  values,
  onChange,
  errors
}: FormRendererProps) {
  useEffect(() => {
    // Auto-update derived fields whenever values change
    const updatedValues = { ...values };
    fields.forEach((field) => {
      if (field.derived) {
        updatedValues[field.id] = evaluateDerivedField(field, updatedValues);
      }
    });
    Object.entries(updatedValues).forEach(([id, val]) => {
      if (values[id] !== val) onChange(id, val);
    });
  }, [fields, values, onChange]);

  function renderField(field: FieldSchema) {
    const value = values[field.id] ?? "";

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) =>
              onChange(field.id, field.type === "number" ? +e.target.value : e.target.value)
            }
            disabled={!!field.derived}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={!!field.derived}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            disabled={!!field.derived}
          >
            <option value="">-- Select --</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <>
            {field.options?.map((opt) => {
              const checkedValues: string[] = value || [];
              return (
                <label key={opt.value} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={checkedValues.includes(opt.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...checkedValues, opt.value]
                        : checkedValues.filter((v) => v !== opt.value);
                      onChange(field.id, newValues);
                    }}
                    disabled={!!field.derived}
                  />
                  {opt.label}
                </label>
              );
            })}
          </>
        );

      case "radio":
        return (
          <>
            {field.options?.map((opt) => (
              <label key={opt.value} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(field.id, opt.value)}
                  disabled={!!field.derived}
                />
                {opt.label}
              </label>
            ))}
          </>
        );

      default:
        return <input value={value} onChange={(e) => onChange(field.id, e.target.value)} />;
    }
  }

  return (
    <form>
      {fields.map((field) => (
        <div key={field.id} style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            {field.label}
          </label>
          {renderField(field)}
          {errors[field.id] && (
            <div style={{ color: "red", marginTop: "0.25rem" }}>{errors[field.id]}</div>
          )}
        </div>
      ))}
    </form>
  );
}
