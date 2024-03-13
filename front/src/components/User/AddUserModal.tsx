import React, { useState } from "react";
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
  user_name?: string;
  display_name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: string;
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (application: any) => void;
}

export default function AddUserModal({
  open,
  onClose,
  onAddUser,
}: AddUserModalProps) {
  const [user_name, setUserName] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Errors>({});

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

    if (!password.trim()) {
      newErrors.password = "Password is required";
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
        password: password,
        role: role,
      };
      onAddUser(newUser);
      setUserName("");
      setDisplayName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setRole("");
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          size="small"
        />
        <TextField
          label="Mobile"
          fullWidth
          margin="normal"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          error={!!errors.mobile}
          helperText={errors.mobile}
          size="small"
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          size="small"
          type="password"
        />

        <TextField
          label="Role"
          sx={{ marginTop: 1, marginBottom: 2 }}
          autoComplete="role"
          size="small"
          fullWidth
          select
          onChange={(e) => setRole(e.target.value)}
          error={!!errors.role}
          helperText={errors.role}
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
