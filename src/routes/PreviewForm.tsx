// src/routes/PreviewForm.tsx
import  { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { getAllForms } from "../utils/storage";
import FormRenderer from "../components/FormRenderer";
import type { FormSchema } from "../types";

export default function PreviewForm() {
  const [forms, setForms] = useState<FormSchema[]>([]);
  const [values, setValues] = useState<Record<string, Record<string, any>>>({});
  const [errors, setErrors] = useState<
    Record<string, Record<string, string | null>>
  >({});

  // Load all forms once when component mounts
  useEffect(() => {
    const savedForms = getAllForms();
    setForms(savedForms);

    // Initialize values and errors for each form
    const initialValues: Record<string, Record<string, any>> = {};
    const initialErrors: Record<string, Record<string, string | null>> = {};
    savedForms.forEach((f) => {
      initialValues[f.id] = {};
      initialErrors[f.id] = {};
    });
    setValues(initialValues);
    setErrors(initialErrors);
  }, []);

  const handleChange = (formId: string, fieldId: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [fieldId]: value,
      },
    }));
  };

  const validateForm = (form: FormSchema) => {
    const e: Record<string, string | null> = {};
    const v = values[form.id] || {};

    // ✅ Check if all values are empty
    const allEmpty = form.fields.every((f) => {
      const val = v[f.id];
      return val === undefined || val === "" || val === null;
    });

    if (allEmpty) {
      alert(`Form "${form.name}" cannot be submitted empty`);
      return false;
    }

    // Field-level validation
    for (const f of form.fields) {
      const val = v[f.id];
      if (f.required && (val === undefined || val === "")) {
        e[f.id] = "This field is required";
      }
      if (f.validation?.email && val) {
        const re = /\S+@\S+\.\S+/;
        if (!re.test(val)) e[f.id] = "Invalid email address";
      }
      if (
        typeof f.validation?.minLength === "number" &&
        typeof val === "string" &&
        val.length < f.validation.minLength
      ) {
        e[f.id] = `Minimum length ${f.validation.minLength}`;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [form.id]: e,
    }));

    return Object.keys(e).length === 0;
  };

  if (!forms.length) {
    return <Typography>No forms found in localStorage</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      {forms.map((form) => (
        <Box
          key={form.id}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            p: 2,
            mb: 3,
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {form.name}
          </Typography>

          <FormRenderer
            fields={form.fields}
            values={values[form.id] || {}}
            onChange={(fieldId, val) => handleChange(form.id, fieldId, val)}
            errors={errors[form.id] || {}}
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => {
              if (validateForm(form)) {
                alert(`Form "${form.name}" submitted successfully!`);
              } else {
                alert("Please fix the validation errors.");
              }
            }}
          >
            Submit {form.name}
          </Button>
        </Box>
      ))}
    </Box>
  );
}
