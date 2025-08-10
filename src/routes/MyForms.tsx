// src/routes/MyForms.tsx
import  { useState } from "react";
import { getAllForms, setSelectedForm, deleteForm } from "../utils/storage";
import { Box, List, ListItemButton, ListItemText, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MyForms() {
  const [forms, setForms] = useState(getAllForms());
  const nav = useNavigate();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      deleteForm(id);
      setForms(getAllForms()); // refresh list after deletion
    }
  };

  return (
    <Box>
      <List>
        {forms.map((f) => (
          <ListItemButton
            key={f.id}
            onClick={() => {
              setSelectedForm(f);
              nav("/preview");
            }}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemText
              primary={f.name}
              secondary={new Date(f.createdAt).toLocaleString()}
            />
            <IconButton
              edge="end"
              color="error"
              onClick={(e) => {
                e.stopPropagation(); // prevent preview navigation
                handleDelete(f.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
      {forms.length === 0 && <div>No saved forms yet</div>}
    </Box>
  );
}
