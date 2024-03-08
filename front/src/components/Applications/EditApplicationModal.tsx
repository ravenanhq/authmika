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
import { RowData } from "./ApplicationList";

interface Errors {
  name?: string;
  application?: string;
  baseUrl?: string;
}

const InitialRowData = {
  id: 0,
  name: "",
  application: "",
  baseUrl: "",
  base_url: "",
};

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  rowData: RowData | null;
  onEdit: (editedData: RowData) => void;
}

export default function EditApplicationModal({
  open,
  onClose,
  rowData,
  onEdit,
}: EditModalProps) {
  const [editedData, setEditedData] = useState<RowData>(InitialRowData);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
  }, [rowData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!editedData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!editedData.application?.trim()) {
      newErrors.application = "Application is required";
    }

    if (!editedData.baseUrl?.trim()) {
      newErrors.baseUrl = "Base Url is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateApplication = () => {
    if (validateForm()) {
      onEdit(editedData);
    }
    setSuccessMessageOpen(true);
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          backgroundColor: "#265073",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Update Application
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
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={editedData.name || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Application"
          name="application"
          value={editedData.application || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.application}
          helperText={errors.application}
        />
        <TextField
          label="Base Url"
          name="baseUrl"
          value={editedData.baseUrl || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.baseUrl}
          helperText={errors.baseUrl}
        />
      </DialogContent>
      <Divider
        color="#265073"
        sx={{ marginBottom: "2%", marginTop: "2%" }}
      ></Divider>
      <DialogActions style={{ margin: "0 16px 10px 0" }}>
        <PrimaryButton
          startIcon={<SaveIcon />}
          onClick={handleUpdateApplication}
        >
          Update
        </PrimaryButton>
        <SecondaryButton startIcon={<CloseIcon />} onClick={handleClose}>
          Close
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}
