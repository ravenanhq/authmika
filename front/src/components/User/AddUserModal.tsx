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
  Grid,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { RolesApi } from "@/services/api/RolesApi";
import { GroupsApi } from "@/services/api/GroupsApi";
import AvatarUpload from "../AvatarUpload/AvatarUpload";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
  group?: string;
  password?: string;
  [key: string]: string | undefined;
}

interface CustomField {
  id: string;
  label: string;
  value: string;
}

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (
    application: any,
    isView: boolean,
    applicationId: number | undefined,
    isGroup: boolean
  ) => void;
  isView: string | boolean;
  isListPage: boolean;
  applicationId: number | undefined;
  uniqueEmail: string;
  validatePassword: string;
  showRole: boolean;
  roleView: boolean;
  roleName: string | undefined;
  groupView: boolean;
  showGroup: boolean;
  groupName: string | undefined;
  groupId: number | undefined;
  isGroup: boolean;
  validateMobile: string;
  customFields?: CustomField[];
}

export default function AddUserModal({
  open,
  onClose,
  onAddUser,
  uniqueEmail,
  isView,
  applicationId,
  validatePassword,
  showRole,
  roleView,
  roleName,
  groupView,
  showGroup,
  groupId,
  isGroup,
  validateMobile,
  customFields = [],
}: AddUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState<{ label: string; name: string } | null>(
    null
  );
  const [roles, setRoles] = useState<{ name: string; label: string }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [group, setGroup] = useState<{ id: string; name: string } | null>(null);
  const [password, setPassword] = useState("");
  const isViewBool =
    typeof isView === "string" ? JSON.parse(isView.toLowerCase()) : isView;
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState("");
  const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: string }>({});
  const [customFieldsList, setCustomFieldsList] = useState<CustomField[]>(customFields);
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  // const [get, setGet] = useState("");
  // const [userId, setUserId] = useState<number | undefined>();
  // const GET_ALL = "all";

  useEffect(() => {
    getRoles();
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, email: uniqueEmail }));
  }, [uniqueEmail]);

  useEffect(() => {
    if (!open) {
      clearForm();
    }
  }, [open]);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, password: validatePassword }));
  }, [validatePassword]);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, mobile: validateMobile }));
  }, [validateMobile]);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setRole(null);
    setGroup(null);
    setPassword("");
    setCustomFieldValues({});
    setCustomFieldsList([]);
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

    if (showRole && !role && !roleView) {
      newErrors.role = "Role is required";
    }

    if (showGroup && !group && !groupView) {
      newErrors.group = "Group is required";
    }

    customFieldsList.forEach((field) => {
      if (!customFieldValues[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (validateForm()) {
      const newUser = {
        firstName,
        lastName,
        email,
        mobile,
        password,
        avatar,
        file,
        role: roleView ? roleName : role?.name,
        groupId: groupView ? groupId : group?.id,
        customFields: customFieldsList.map(field => ({
          field_name: field.label,
          field_value: customFieldValues[field.id],
        })),
      };
      onAddUser(newUser, isViewBool, applicationId, isGroup);
    }
  };

  const getRoles = async () => {
    try {
      const response = await RolesApi.getAllRoleApi();
      if (response) {
        setRoles(response);
      }
    } catch (error) {
      console.log(error);
    }
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

  const handleClose = () => {
    clearForm();
    onClose();
  };

  const handleGroupChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: { id: string; name: string } | null
  ) => {
    setGroup(newValue);
  };

  const handleRoleChange = (
    event: React.ChangeEvent<{}>,
    newValue: { label: string; name: string } | null
  ) => {
    setRole(newValue);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      setFile(base64String);
    };

    reader.readAsDataURL(file);
    setAvatar(file.name);
  };

  const handleCustomFieldChange = (id: string, value: string) => {
    setCustomFieldValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleAddCustomField = () => {
    setCustomFieldsList((prevFields) => [
      ...prevFields,
      { id: `custom-${prevFields.length + 1}`, label: "", value: "" },
    ]);
  };


  const handlePasswordVisibility = (field: number) => {
    switch (field) {
      case 1:
        setShowPassword((prevShowPassword) => !prevShowPassword);
        break;
      default:
        break;
    }
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
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName}
          size="small"
          sx={{ marginTop: 2 }}
        />
        <TextField
          label="Email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          size="small"
          sx={{ marginTop: 2 }}
        />
        <TextField
          label="Password"
          fullWidth
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handlePasswordVisibility(1)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginTop: 2 }}
        />
        <TextField
          label="Mobile"
          fullWidth
          required
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          error={!!errors.mobile}
          helperText={errors.mobile}
          size="small"
          sx={{ marginTop: 2 }}
        />
        {showRole && (
          <div>
            <Autocomplete
              value={role}
              onChange={handleRoleChange}
              options={roles}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role"
                  required
                  error={!!errors.role}
                  size="small"
                  helperText={errors.role}
                  sx={{ marginTop: 2 }}
                />
              )}
            />
          </div>
        )}
        {showGroup && (
          <div>
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
                  sx={{ marginTop: 2,marginBottom:2 }}
                />
              )}
            />
          </div>
        )}
                <AvatarUpload onAvatarUpload={handleFileUpload} imageFile={""}  />
                <Divider sx={{ marginY: 2 }} />
        <Button onClick={handleAddCustomField} color="primary" variant="outlined">
          Add Custom Field
        </Button>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {customFieldsList.map((field, index) => (
            <React.Fragment key={field.id}>
              <Grid item xs={6}>
                <TextField
                  label="Field Name"
                  fullWidth
                  value={field.label}
                  onChange={(e) =>
                    setCustomFieldsList((prevFields) =>
                      prevFields.map((f, i) =>
                        i === index ? { ...f, label: e.target.value } : f
                      )
                    )
                  }
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Field Value"
                  fullWidth
                  value={customFieldValues[field.id] || ""}
                  onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  size="small"
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
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
