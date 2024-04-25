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
import { MenuItem } from "@mui/material";

interface Errors {
  userName?: string;
  user_name?: string;
  display_name?: string;
  email?: string;
  mobile?: string;
  role?: string;
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (application: any) => void;
  // uniqueValidation: string;
  uniqueEmail: string;
}

export default function AddUserModal({
  open,
  onClose,
  onAddUser,
  // uniqueValidation,
  uniqueEmail,
}: AddUserModalProps) {
  const [user_name, setUserName] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, email: uniqueEmail }));
  }, [uniqueEmail]);

  // useEffect(() => {
  //   setErrors((prevErrors) => ({ ...prevErrors, userName: uniqueValidation }));
  // }, [uniqueValidation]);

  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!user_name.trim()) {
      newErrors.user_name = "Username is required";
    }

    if (!display_name.trim()) {
      newErrors.display_name = "Display Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile is required";
    }

    if (!role.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const Role = [
    {
      value: "ADMIN",
      label: "ADMIN",
    },
    {
      value: "CLIENT",
      label: "CLIENT",
    },
  ];

  const handleAddUser = () => {
    if (validateForm()) {
      const newUser = {
        user_name: user_name,
        display_name: display_name,
        email: email,
        mobile: mobile,
        role: role,
      };
      onAddUser(newUser);
      setErrors({});
    }
  };

  const handleClose = () => {
    setErrors({});
    setUserName("");
    setDisplayName("");
    setEmail("");
    setMobile("");
    setRole("");
    onClose();
    setErrors({});
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
          width: "100%",
        }}
      >
        Add New User
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
          fullWidth
          margin="normal"
          required
          value={user_name}
          onChange={(e) => setUserName(e.target.value)}
          error={!!errors.user_name}
          helperText={errors.user_name}
          size="small"
        />
        <TextField
          label="Display Name"
          fullWidth
          margin="normal"
          required
          value={display_name}
          onChange={(e) => setDisplayName(e.target.value)}
          error={!!errors.display_name}
          helperText={errors.display_name}
          size="small"
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email ? errors.email : " "}
          size="small"
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Mobile"
          fullWidth
          margin="normal"
          required
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          error={!!errors.mobile}
          helperText={errors.mobile}
          size="small"
          sx={{ marginTop: 0 }}
        />
        <TextField
          label="Role"
          size="small"
          required
          fullWidth
          value={role}
          select
          onChange={(e) => setRole(e.target.value)}
          error={!!errors.role}
          helperText={errors.role}
          sx={{ marginTop: 2 }}
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
        <PrimaryButton startIcon={<AddIcon />} onClick={handleAddUser}>
          Add
        </PrimaryButton>
        <SecondaryButton startIcon={<CloseIcon />} onClick={handleClose}>
          Close
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}
