import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { UserApi } from "@/services/api/UserApi";
import SaveIcon from "@mui/icons-material/Save";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface Errors {
  Email?: string;
  Mobile?: string;
  user_name?: string;
  display_name?: string;
  role?: string;
  newPassword?: string;
  confirmPassword?: string;
  currentPassword?: string;
}

interface RowData {
  id: number;
  email: string;
  mobile: string;
  user_name: string;
  display_name: string;
  role: string;
  password?: string;
}

const InitialRowData: RowData = {
  id: 0,
  email: "",
  mobile: "",
  user_name: "",
  display_name: "",
  role: "",
  password: "",
};

interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  ></Box>
);

const ProfilePage = () => {
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState<{
    id?: number;
    email: string;
    mobile: string;
    user_name: string;
    display_name: string;
    role: string;
    password: string;
  }>({
    email: "",
    mobile: "",
    user_name: "",
    display_name: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [editedData, setEditedData] = useState<RowData>(InitialRowData);
  const [rows, setRows] = useState<RowData[]>([]);
  const [alertShow, setAlertShow] = useState("");
  const [passwordAlert, setPasswordAlert] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [showPassword1, setShowPassword1] = useState<Boolean>(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [currentPasswordAlert, setCurrentPasswordAlert] =
    useState<AlertState | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const session: Session | null = await getSession();
        if (session) {
          const { email, mobile, id, role, password } = session.user;
          const user_name = session.user.userName;
          const display_name = session.user.displayName;
          setUserDetails({
            display_name,
            user_name,
            email,
            mobile,
            role,
            password,
          });
          setEditedData((prevEditedData) => ({
            ...prevEditedData,
            display_name,
            user_name,
            email,
            mobile,
            id,
            role,
            password,
          }));
          setUserId(id);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  const handlePasswordVisibility = (field: number) => {
    switch (field) {
      case 1:
        setShowPassword1((prevShowPassword) => !prevShowPassword);
        break;
      case 2:
        setShowPassword2((prevShowPassword) => !prevShowPassword);
        break;
      case 3:
        setShowPassword3((prevShowPassword) => !prevShowPassword);
        break;
      default:
        break;
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateProfile = () => {
    let newErrors: Errors = {};

    if (!editedData.user_name?.trim()) {
      newErrors.user_name = "Username is required";
    }
    if (!editedData.display_name?.trim()) {
      newErrors.display_name = "Display Name is required";
    }
    if (!editedData.email?.trim()) {
      newErrors.Email = "Email is required";
    } else if (!validateEmail(editedData.email)) {
      newErrors.Email = "Invalid email address";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const updateProfile = async (id: number, updatedData: RowData) => {
    if (validateProfile()) {
      try {
        const response = await UserApi.update(id, updatedData);
        if (response) {
          if (response.statusCode == 409) {
          } else if (response.statusCode == 200) {
            setRows(response.data);
            const updatedUserDetails = { ...userDetails, ...updatedData };
            setUserDetails(updatedUserDetails);
            setAlertShow(response.message);
          }
        }
      } catch (error: any) {
        var response = error.response.data;
        if (
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 422
        ) {
          console.error(error);
        }
      }
    }
  };

  const validate = () => {
    let newErrors: Errors = {};
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/]).{8,}$/;

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current Password is required";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "Password is required";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (newPassword !== confirmPassword.trim()) {
      newErrors.confirmPassword = "Passwords do not match";
      if (!areCharactersMatching(newPassword, confirmPassword)) {
        newErrors.confirmPassword =
          "Password should match with the confirm password";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const areCharactersMatching = (
    newPassword: string,
    confirmPassword: string
  ): boolean => {
    if (newPassword.length !== confirmPassword.length) {
      return false;
    }
    for (let i = 0; i < newPassword.length; i++) {
      if (newPassword[i] !== confirmPassword[i]) {
        return false;
      }
    }
    return true;
  };

  const updatePassword = async (
    id: any,
    currentPassword: string,
    newPassword: any
  ) => {
    if (validate()) {
      try {
        const updatedData = {
          ...editedData,
          id: id,
          password: newPassword,
          currentPassword: currentPassword,
        };
        const response = await UserApi.updatePassword(id, updatedData);
        setPasswordAlert("");
        setCurrentPasswordAlert(null);
        if (response) {
          if (response.statusCode === 409) {
          } else if (response.statusCode === 200) {
            setRows(response.data);
            const updatedUserDetails = { ...userDetails, ...updatedData };
            setUserDetails(updatedUserDetails);
            setPasswordAlert(response.message);
          } else if (response.statusCode === 422) {
            setCurrentPasswordAlert({
              severity: "error",
              message: response.message,
            });
          }
        }
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 422
        )
          console.error(error);
      }
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ marginBottom: 1, marginTop: 2 }}
      >
        Profile Information
      </Typography>
      <Divider sx={{ marginBottom: 1, flexGrow: 1 }} color="#265073" />
      {alertShow && (
        <Alert
          sx={{
            width: "60%",
            margin: "auto",
            mt: "30px",
            [theme.breakpoints.down("md")]: {
              width: "100%",
            },
          }}
          severity="success"
          onClose={() => {
            setAlertShow("");
          }}
        >
          {alertShow}
        </Alert>
      )}
      <Card
        sx={{
          width: "60%",
          margin: "auto",
          mt: "30px",
          [theme.breakpoints.down("md")]: {
            width: "100%",
          },
        }}
      >
        <CardContent>
          <form>
            <TextField
              label="Username"
              fullWidth
              name="user_name"
              margin="normal"
              required
              value={editedData.user_name}
              onChange={handleChange}
              error={!!errors.user_name}
              helperText={errors.user_name && <span>{errors.user_name}</span>}
              sx={{ marginTop: 1, marginBottom: 2 }}
            />

            <TextField
              label="Display Name"
              name="display_name"
              required
              value={editedData.display_name || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.display_name}
              helperText={errors.display_name ? errors.display_name : " "}
              sx={{ marginBottom: 0.5 }}
            />

            <TextField
              label="Email"
              name="email"
              required
              value={editedData.email || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.Email}
              helperText={errors.Email ? errors.Email : " "}
              sx={{ marginTop: 0.5 }}
            />

            <TextField
              label="Role"
              name="role"
              required
              fullWidth
              disabled
              value={editedData.role || ""}
              onChange={handleChange}
              error={!!errors.role}
              helperText={errors.role ? errors.role : " "}
              sx={{ marginBottom: 0.5 }}
            ></TextField>

            <Grid container justifyContent="flex-end">
              <PrimaryButton
                variant="contained"
                color="primary"
                sx={{ position: "sticky", top: "20px" }}
                startIcon={<SaveIcon />}
                onClick={() => {
                  if (userId !== undefined) {
                    const updatedData = { ...editedData, id: userId };
                    updateProfile(userId, updatedData);
                  } else {
                    console.error("User ID is undefined");
                  }
                }}
              >
                Save
              </PrimaryButton>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Typography
        variant="h5"
        component="h2"
        sx={{ marginBottom: 1, marginTop: 2 }}
      >
        Change Password
      </Typography>
      <Divider sx={{ marginBottom: 1, flexGrow: 1 }} color="#265073" />
      {passwordAlert && (
        <Alert
          sx={{
            width: "60%",
            margin: "auto",
            mt: "30px",
            [theme.breakpoints.down("md")]: {
              width: "100%",
            },
          }}
          severity="success"
          onClose={() => {
            setPasswordAlert("");
          }}
        >
          {passwordAlert}
        </Alert>
      )}
      {currentPasswordAlert && (
        <Alert
          sx={{
            width: "60%",
            margin: "auto",
            mt: "30px",
            [theme.breakpoints.down("md")]: {
              width: "100%",
            },
          }}
          severity={currentPasswordAlert.severity}
          onClose={() => {
            setCurrentPasswordAlert(null);
          }}
        >
          {currentPasswordAlert.message}
        </Alert>
      )}
      <Card
        sx={{
          width: "60%",
          margin: "auto",
          mt: "30px",
          [theme.breakpoints.down("md")]: {
            width: "100%",
          },
        }}
      >
        <CardContent>
          <form>
            <TextField
              label="Current Password"
              name="currentPassword"
              required
              fullWidth
              margin="normal"
              type={showPassword1 ? "text" : "password"}
              id="password"
              onChange={(e) => setCurrentPassword(e.target.value)}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handlePasswordVisibility(1)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword2 ? "text" : "password"}
              name="newPassword"
              required
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handlePasswordVisibility(2)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showPassword3 ? "text" : "password"}
              name="confirmPassword"
              fullWidth
              required
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handlePasswordVisibility(3)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword3 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Grid container justifyContent="flex-end">
              <PrimaryButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, position: "sticky", top: "20px" }}
                onClick={() =>
                  updatePassword(userId, currentPassword, newPassword)
                }
                startIcon={<SaveIcon />}
              >
                Save
              </PrimaryButton>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
