import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  IconButton,
  Divider,
  DialogContent,
  DialogActions,
  styled,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { RowData } from "./RolesList";

interface Errors {
  name?: string;
}

const InitialRowData = {
  id: 0,
  name: "",
  created_at: "",
  deleting: false,
};

interface EditRolesModalProps {
  open: boolean;
  onClose: () => void;
  rowData: RowData | null;
  onEdit: (editedData: RowData) => void;
  uniqueValidation: string;
}

export default function EditRolesModal({
  open,
  onClose,
  rowData,
  onEdit,
  uniqueValidation,
}: EditRolesModalProps) {
  const [editedData, setEditedData] = useState<RowData>(InitialRowData);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
  }, [rowData]);

  useEffect(() => {
    setErrors({ name: uniqueValidation });
  }, [uniqueValidation]);

  useEffect(() => {
    setErrors({});
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const filteredInput = value
      .split("")
      .filter((char) => /^[a-zA-Z]$/.test(char))
      .map((char) => char.toUpperCase())
      .join("");

    setEditedData((prevData) => ({ ...prevData, [name]: filteredInput }));
  };

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!editedData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateRole = () => {
    if (validateForm()) {
      onEdit(editedData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
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
        Update Role
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
      <DialogContent sx={{ marginTop: 4 }}>
        <TextField
          label="Name"
          name="name"
          size="medium"
          required
          fullWidth
          value={editedData.name || ""}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name ? errors.name : " "}
        />
      </DialogContent>
      <Divider
        color="#265073"
        sx={{ marginBottom: "2%", marginTop: "0%" }}
      ></Divider>
      <DialogActions style={{ margin: "0 16px 10px 0" }}>
        <PrimaryButton startIcon={<SaveIcon />} onClick={handleUpdateRole}>
          Update
        </PrimaryButton>
        <SecondaryButton startIcon={<CloseIcon />} onClick={handleClose}>
          Close
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}
