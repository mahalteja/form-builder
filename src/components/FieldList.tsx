import type { FieldSchema } from "../types";
import FieldEditor from "./FieldEditor";
import { Box, Button } from "@mui/material";

interface Props {
  fields: FieldSchema[];
  onUpdate: (id: string, patch: Partial<FieldSchema>) => void;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

export default function FieldList({ fields, onUpdate, onRemove, onReorder }: Props) {
  return (
    <Box>
      {fields.map((f, idx) => (
        <div key={f.id}>
          <FieldEditor
            field={f}
            onChange={(patch) => onUpdate(f.id, patch)}
            onDelete={() => onRemove(f.id)}
          />
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button disabled={idx === 0} onClick={() => onReorder(idx, idx - 1)}>Move Up</Button>
            <Button disabled={idx === fields.length - 1} onClick={() => onReorder(idx, idx + 1)}>Move Down</Button>
          </Box>
        </div>
      ))}
    </Box>
  );
}
