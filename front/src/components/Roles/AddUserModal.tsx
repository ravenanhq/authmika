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
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { GroupsApi } from "@/services/api/GroupsApi";
interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  group?: string;
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (application: any) => void;
  uniqueEmail: string;
}

export default function AddUserModal({
  open,
  onClose,
  onAddUser,
  uniqueEmail,
}: AddUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [group, setGroup] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, email: uniqueEmail }));
  }, [uniqueEmail]);

  useEffect(() => {
    if (!open) {
      clearForm();
    }
  }, [open]);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setGroup(null);
    setErrors({});
  };

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile is required";
    }

    if (!group) {
      newErrors.group = "Group is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (validateForm()) {
      const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile: mobile,
        groupId: group?.id,
      };
      onAddUser(newUser);
    }
  };

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const getGroups = async () => {
    try {
      const response = await GroupsApi.getAllGroupsApi();
      if (response) {
        setGroups(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroupChange = (
    event: React.ChangeEvent<{}>,
    newValue: { id: string; name: string } | null
  ) => {
    setGroup(newValue);
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
          label="First name"
          fullWidth
          margin="normal"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName}
          size="small"
        />
        <TextField
          label="Last name"
          fullWidth
          margin="normal"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName}
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
        <Autocomplete
          value={group}
          onChange={handleGroupChange}
          options={groups}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Group"
              required
              error={!!errors.group}
              size="small"
              helperText={errors.group}
              sx={{ marginTop: 2 }}
            />
          )}
        />
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
