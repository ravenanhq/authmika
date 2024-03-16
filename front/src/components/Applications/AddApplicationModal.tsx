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
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface Errors {
  name?: string;
  application?: string;
  base_url?: string;
}

interface AddApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onAddApplication: (application: any) => void;
  uniqueValidation: string;
}

export default function AddApplicationModal({
  open,
  onClose,
  onAddApplication,
  uniqueValidation,
}: AddApplicationModalProps) {
  const [application, setApplication] = useState("");
  const [name, setName] = useState("");
  const [base_url, setBaseUrl] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setErrors({application: uniqueValidation});
  }, [uniqueValidation]);

  useEffect(() => {
    setErrors({});
  }, [open]);

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!application.trim()) {
      newErrors.application = "Application is required";
    }

    if (!base_url.trim()) {
      newErrors.base_url = "Base Url is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddApplication = () => {
    if (validateForm()) {
      const newApplication = {
        name: name,
        application: application,
        base_url: base_url,
      };
      onAddApplication(newApplication);
      if (!errors) {
        setName("");
        setApplication("");
        setBaseUrl("");
      }
    }
  };

  const handleClose = () => {
    setErrors({});
    setName("");
    setApplication("");
    setBaseUrl("");
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
      <DialogTitle sx={{ backgroundColor: "#265073", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Add New Application
        <IconButton onClick={handleClose} sx={{ backgroundColor: "#FF9843", color: "#fff", ":hover": {
      color: "#fff",
      backgroundColor: "#FE7A36",
    }, }}>
            <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider color="#265073"></Divider>
      <DialogContent>
        <TextField
          required
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          required
          label="Application"
          fullWidth
          margin="normal"
          value={application}
          onChange={(e) => setApplication(e.target.value)}
          error={!!errors.application}
          helperText={errors.application}
        />
        <TextField
          required
          label="Base Url"
          fullWidth
          margin="normal"
          value={base_url}
          onChange={(e) => setBaseUrl(e.target.value)}
          error={!!errors.base_url}
          helperText={errors.base_url}
        />
      </DialogContent>
      <Divider color="#265073" sx={{ marginBottom: "2%", marginTop: "2%" }}></Divider>
      <DialogActions style={{ margin: "0 16px 10px 0" }}>
        <PrimaryButton startIcon={<AddIcon />} onClick={handleAddApplication}>
          Add
        </PrimaryButton>
        <SecondaryButton startIcon={<CloseIcon />} onClick={handleClose}>
          Close
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}
