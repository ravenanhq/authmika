import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Divider,
  styled,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

interface Errors {
  name?: string;
}

interface AddRolesModalProps {
  open: boolean;
  onClose: () => void;
  onAddRole: (name: any) => void;
  uniqueNameValidation: string;
}

export default function AddRolesModal({
  open,
  onClose,
  onAddRole,
  uniqueNameValidation,
}: AddRolesModalProps) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setErrors({ name: uniqueNameValidation });
  }, [uniqueNameValidation]);

  useEffect(() => {
    if (!open) {
      clearForm();
    }
  }, [open]);

  const clearForm = () => {
    setName("");
  };

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddRole = () => {
    if (validateForm()) {
      const newRole = {
        name: name,
      };
      onAddRole(newRole);
    }
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const filteredInput = input
      .split("")
      .filter((char) => /^[a-zA-Z]$/.test(char))
      .map((char) => char.toUpperCase())
      .join("");

    setName(filteredInput);
  };

  const PrimaryButton = styled(Button)(() => ({
    textTransform: "none",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: "#1C658C",
    color: "#fff",
    ":hover": {
      color: "#fff",
      backgroundColor: "#265073",
    },
  }));

  const SecondaryButton = styled(Button)(() => ({
    textTransform: "none",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: "#FF9843",
    color: "#fff",
    ":hover": {
      color: "#fff",
      backgroundColor: "#FE7A36",
    },
  }));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth={true}
      PaperProps={{
        style: {
          minHeight: "300px",
          maxHeight: "600px",
        },
      }}
    >
      {" "}
      <DialogTitle
        sx={{
          backgroundColor: "#265073",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add New Role
        <IconButton
          onClick={handleClose}
          sx={{
            backgroundColor: "#FF9843",
            color: "#fff",
            ":hover": {
              color: "#fff",
              backgroundColor: "#FE7A36",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider color="#265073"></Divider>
      <DialogContent sx={{ marginTop: 1.5 }}>
        <TextField
          required
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          size="medium"
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
      </DialogContent>
      <Divider
        color="#265073"
        sx={{ marginBottom: "2%", marginTop: "2%" }}
      ></Divider>
      <DialogActions style={{ margin: "0 16px 10px 0" }}>
        <PrimaryButton startIcon={<AddIcon />} onClick={handleAddRole}>
          Add
        </PrimaryButton>
        <SecondaryButton startIcon={<CloseIcon />} onClick={handleClose}>
          Close
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}
