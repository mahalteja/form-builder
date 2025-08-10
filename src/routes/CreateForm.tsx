import  { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import {
  addField,
  updateField,
  removeField,
  reorderField,
  reset,
} from "../store/formBuilderSlice";
import FieldList from "../components/FieldList";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { saveFormSchema, setSelectedForm } from "../utils/storage";
import type { FormSchema, FieldSchema } from "../types";
import { v4 as uuid } from "uuid";

export default function CreateForm() {
  const fields = useSelector((s: RootState) => s.builder.fields);
  const dispatch = useDispatch();
  const [saveOpen, setSaveOpen] = useState(false);
  const [formName, setFormName] = useState("");

  // Validation function for options
  const validateOptions = (field: FieldSchema): string | null => {
    if (["select", "checkbox", "radio"].includes(field.type)) {
      const optionsString = (field as any).optionsString?.trim();
      if (!optionsString) {
        return `Options are required for ${field.type} field "${field.label || "(no label)"}"`;
      }
      const optionPairs = optionsString.split(",").map((opt: string) => opt.trim());
      for (const pair of optionPairs) {
        if (!pair.includes(":")) {
          return `Option "${pair}" in field "${field.label || "(no label)"}" must be in label:value format`;
        }
        const [label, value] = pair.split(":").map((s: string) => s.trim());
        if (!label || !value) {
          return `Option "${pair}" in field "${field.label || "(no label)"}" must have both label and value`;
        }
      }
    }
    return null;
  };

  const handleSave = () => {
    for (const f of fields) {
      const error = validateOptions(f);
      if (error) {
        alert(error);
        return;
      }
    }

    const schema: FormSchema = {
      id: uuid(),
      name: formName || `Form ${new Date().toISOString()}`,
      createdAt: new Date().toISOString(),
      fields: fields.map((f) => {
        let fieldCopy = { ...f };
        if (["select", "checkbox", "radio"].includes(f.type)) {
          fieldCopy.options = (f as any).optionsString
            .split(",")
            .map((s: string) => {
              const [label, value] = s.split(":").map((t) => t.trim());
              return { label, value };
            });
        }
        delete (fieldCopy as any).optionsString;
        return fieldCopy;
      }),
    };
    saveFormSchema(schema);
    setSelectedForm(schema);
    dispatch(reset());
    setSaveOpen(false);
    setFormName("");
    alert("Form saved to localStorage");
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          select
          label="Add Field"
          value=""
          onChange={(e) => dispatch(addField({ type: e.target.value as any }))}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="textarea">Textarea</MenuItem>
          <MenuItem value="select">Select</MenuItem>
          <MenuItem value="radio">Radio</MenuItem>
          <MenuItem value="checkbox">Checkbox</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </TextField>

        <Button variant="contained" onClick={() => setSaveOpen(true)}>
          Save Form
        </Button>
        <Button variant="outlined" onClick={() => dispatch(reset())}>
          Clear
        </Button>
      </Box>

      <FieldList
        fields={fields}
        onUpdate={(id, patch) => dispatch(updateField({ id, patch }))}
        onRemove={(id) => dispatch(removeField(id))}
        onReorder={(from, to) => dispatch(reorderField({ from, to }))}
      />

      <Dialog open={saveOpen} onClose={() => setSaveOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
