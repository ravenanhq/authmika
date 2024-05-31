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
import { RolesApi } from "@/services/api/RolesApi";

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
}

const InitialRowData = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  role: "",
  created_at: "",
  status: 0,
};

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  rowData: RowData | null;
  onEdit: (editedData: RowData) => void;
  uniqueEmail: string;
}

export default function EditUserModal({
  open,
  onClose,
  rowData,
  onEdit,
  uniqueEmail,
}: EditModalProps) {
  const [editedData, setEditedData] = useState<RowData>(InitialRowData);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const [roles, setRoles] = useState<{ name: string; label: string }[]>([]);

  useEffect(() => {
    getroles();
  }, []);

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
  }, [rowData]);

  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, email: uniqueEmail }));
    return () => {
      setErrors({});
    };
  }, [uniqueEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!editedData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!editedData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
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
    setErrors({});
    if (validateForm()) {
      onEdit(editedData);
      setErrors({});
    }
    setSuccessMessageOpen(true);
  };

  const getroles = async () => {
    try {
      const response = await RolesApi.updateRole();
      if (response) {
        const roleData = response;
        setRoles(roleData);
      }
    } catch (error: any) {
      console.log(error);
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
          label="First name"
          name="firstName"
          value={editedData.firstName || ""}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          size="small"
          error={!!errors.firstName}
          helperText={errors.firstName && <span>{errors.firstName}</span>}
          sx={{ marginBottom: 1.5 }}
        />

        <TextField
          label="Last name"
          name="lastName"
          required
          value={editedData.lastName || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          size="small"
          error={!!errors.lastName}
          helperText={errors.lastName ? errors.lastName : " "}
        />

        <TextField
          label="Email"
          name="email"
          required
          value={editedData.email || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          size="small"
          error={!!errors.email}
          helperText={errors.email ? errors.email : " "}
          sx={{ marginTop: 0 }}
        />

        <TextField
          label="Mobile"
          name="mobile"
          required
          value={editedData.mobile || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          size="small"
          error={!!errors.mobile}
          helperText={errors.mobile ? errors.mobile : " "}
          sx={{ marginTop: 0 }}
        />

        <TextField
          label="Role"
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
          {roles.map((option) => (
            <MenuItem
              key={option.name}
              value={option.name}
              style={{ paddingLeft: "16px" }}
            >
              {option.name}
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
