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
import { RowData } from "./UserList";
import { MenuItem } from "@mui/material";

interface Errors {
  userName?: string;
  displayName?: string;
  email?: string;
  mobile?: string;
  role?: string;
}

const InitialRowData = {
  id: 0,
  userName: "",
  user_name: "",
  display_name: "",
  displayName: "",
  email: "",
  mobile: "",
  role: "",
};

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  rowData: RowData | null;
  onEdit: (editedData: RowData) => void;
  uniqueValidation: string;
  uniqueEmail: string;
}

const Role: { value: string; label: string }[] = [
  {
    value: "ADMIN",
    label: "ADMIN",
  },
  {
    value: "CLIENT",
    label: "CLIENT",
  },
];

export default function EditUserModal({
  open,
  onClose,
  rowData,
  onEdit,
  uniqueValidation,
  uniqueEmail,
}: EditModalProps) {
  const [editedData, setEditedData] = useState<RowData>(InitialRowData);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
  }, [rowData]);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, email: uniqueEmail }));
  }, [uniqueEmail]);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, userName: uniqueValidation }));
  }, [uniqueValidation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!editedData.userName?.trim()) {
      newErrors.userName = "Username is required";
    }

    if (!editedData.displayName?.trim()) {
      newErrors.displayName = "Display Name is required";
    }

    if (!editedData.email?.trim()) {
      newErrors.email = "Email is required";
    }

    if (!editedData.mobile?.trim()) {
      newErrors.mobile = "Mobile is required";
    }

    if (!editedData.role?.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateUser = () => {
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
        Update User
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
          label="Username"
          name="userName"
          value={editedData.userName || ""}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          error={!!errors.userName}
          helperText={errors.userName && <span>{errors.userName}</span>}
        />

        <TextField
          label="Display Name"
          name="displayName"
          required
          value={editedData.displayName || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.displayName}
          helperText={errors.displayName ? errors.displayName : " "}
        />

        <TextField
          label="Email"
          name="email"
          required
          value={editedData.email || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email ? errors.email : " "}
          sx={{ marginLeft: "0 !important" }}
        />

        <TextField
          label="Mobile"
          name="mobile"
          required
          value={editedData.mobile || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.mobile}
          helperText={errors.mobile ? errors.mobile : " "}
        />

        <TextField
          label="Role"
          sx={{ marginTop: 1, marginBottom: 2 }}
          name="role"
          size="small"
          required
          fullWidth
          select
          value={editedData.role || ""}
          onChange={handleChange}
          error={!!errors.role}
          helperText={errors.role ? errors.role : " "}
        >
          {Role.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              style={{ paddingLeft: "16px" }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <Divider
        color="#265073"
        sx={{ marginBottom: "2%", marginTop: "2%" }}
      ></Divider>
      <DialogActions style={{ margin: "0 16px 10px 0" }}>
        <PrimaryButton startIcon={<SaveIcon />} onClick={handleUpdateUser}>
          Update
        </PrimaryButton>
        <SecondaryButton startIcon={<CloseIcon />} onClick={handleClose}>
          Close
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}
