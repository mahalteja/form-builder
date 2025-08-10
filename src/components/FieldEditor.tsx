import React from "react";
import type { FieldSchema } from "../types";
import { Box, TextField, Switch, Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  field: FieldSchema;
  onChange: (patch: Partial<FieldSchema>) => void;
  onDelete: () => void;
}

export default function FieldEditor({ field, onChange, onDelete }: Props) {
  return (
    <Box sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1">{field.label || "Untitled"} — {field.type}</Typography>
        <IconButton size="small" onClick={onDelete}><DeleteIcon /></IconButton>
      </Box>

      <TextField
        label="Label"
        value={field.label}
        onChange={(e) => onChange({ label: e.target.value })}
        fullWidth
        sx={{ mt: 1 }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
        <Typography>Required</Typography>
        <Switch checked={!!field.required} onChange={(e) => onChange({ required: e.target.checked })} />
      </Box>

      <TextField
        label="Default Value"
        value={field.defaultValue ?? ""}
        onChange={(e) => onChange({ defaultValue: e.target.value })}
        fullWidth
        sx={{ mt: 1 }}
      />

      {/* Options editing for select/radio/checkbox */}
      {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2">Options (label:value, label2:value2)</Typography>
          <TextField
            placeholder="e.g., Apple:1, Orange:2"
            value={(field as any).optionsString ?? ""}
            onChange={(e) => {
              onChange({ optionsString: e.target.value });
            }}
            fullWidth
          />
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Derived field</Typography>
        <Button
          size="small"
          onClick={() =>
            onChange({
              derived: field.derived
                ? null
                : { isDerived: true, parents: [], expression: "return null;" },
            })
          }
        >
          Toggle Derived
        </Button>

        {field.derived && (
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Parents (comma separated field ids)"
              value={field.derived.parents.join(",")}
              onChange={(e) =>
                onChange({
                  derived: {
                    ...field.derived!,
                    parents: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  },
                })
              }
              fullWidth
              sx={{ mt: 1 }}
            />
            <TextField
              label="Expression (function body receiving `parents`)"
              value={field.derived.expression}
              onChange={(e) =>
                onChange({
                  derived: { ...field.derived!, expression: e.target.value },
                })
              }
              fullWidth
              multiline
              minRows={3}
              sx={{ mt: 1 }}
            />
            <Typography variant="caption">
              Example: <code>return Math.floor((Date.now() - new Date(parents.dob)) / (365.25*24*3600*1000));</code>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
