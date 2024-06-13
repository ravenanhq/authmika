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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  styled,
  useTheme,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { UserApi } from "@/services/api/UserApi";
import SaveIcon from "@mui/icons-material/Save";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import axios from "axios";
import { config } from "../../../config";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import DoneIcon from "@mui/icons-material/Done";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Errors {
  Email?: string;
  Mobile?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  newPassword?: string;
  confirmPassword?: string;
  currentPassword?: string;
  password?: string;
  uniqueEmail?: string;
  verifyCurrentPassword?: string;
}

interface Error {
  verifyCurrentPassword?: string;
}
interface RowData {
  id: number;
  email: string;
  mobile: string;
  firstName?: string;
  lastName?: string;
  role: string;
  password?: string;
}

const InitialRowData: RowData = {
  id: 0,
  email: "",
  mobile: "",
  firstName: "",
  lastName: "",
  role: "",
  password: "",
};

interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const ProfilePage = () => {
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState<{
    id?: number;
    email: string;
    mobile: string;
    firstName?: string;
    lastName?: string;
    role: string;
    password: string;
  }>({
    email: "",
    mobile: "",
    firstName: "",
    lastName: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<Errors>({});
  const [editedData, setEditedData] = useState<RowData>(InitialRowData);
  const [rows, setRows] = useState<RowData[]>([]);
  const [alertShow, setAlertShow] = useState("");
  const [passwordAlert, setPasswordAlert] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [verifyCurrentPassword, setVerifyCurrentPassword] = useState("");
  const [verifyPasswordAlert, setVerifyPasswordAlert] =
    useState<AlertState | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [showPassword1, setShowPassword1] = useState<Boolean>(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [currentPasswordAlert, setCurrentPasswordAlert] =
    useState<AlertState | null>(null);
  const [uniqueValidation, setUniqueValidation] = React.useState("");
  const [uniqueEmail, setUniqueEmail] = React.useState("");
  const [showPassword4, setShowPassword4] = useState(false);
  const [twofactorPasswordAlert, setTwoFactorPasswordAlert] =
    useState<AlertState | null>(null);
  const [enable, setEnable] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserDetails = async () => {
    try {
      const session: Session | null = await getSession();
      if (session) {
        const { email, mobile, id, role, password, is_two_factor_enabled } =
          session.user;
        const firstName = session.user.firstName;
        const lastName = session.user.lastName;
        setEnable(is_two_factor_enabled);
        setUserDetails({
          lastName,
          firstName,
          email,
          mobile,
          role,
          password,
        });
        setEditedData((prevEditedData) => ({
          ...prevEditedData,
          lastName,
          firstName,
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
      case 4:
        setShowPassword4((prevShowPassword) => !prevShowPassword);
        break;
      default:
        break;
    }
  };

  const handleOpenDialog = async () => {
    if (!enable) {
      setOpen(true);
    } else {
      setEnable(false);
      handleQRCodeVisibility();
    }
  };

  const handleQRCodeVisibility = async () => {
    // setShowQRCode(!showQRCode);
    try {
      const res = await axios.get(`${config.service}/users/qrcode/${userId}`, {
        params: {
          is_two_factor_enabled: !enable,
        },
      });
      if (enable) {
        // setIsMessageVisible(true);
      }
      if (res.data) {
        // setQRCodeDataUrl(res.data);
      } else {
        console.error("Response is empty");
      }
    } catch (error) {
    } finally {
    }
  };

  const handleClose = () => {
    setPassword("");
    setError({});
    setOpen(false);
    setEnable(false);
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

    if (!editedData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!editedData.lastName?.trim()) {
      newErrors.lastName = " Last name is required";
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
        setUniqueValidation("");
        setUniqueEmail("");
        if (response) {
          if (response.statusCode == 409) {
            setUniqueValidation(response.message);
          } else if (response.statusCode == 200) {
            setRows(response.data);
            const updatedUserDetails = { ...userDetails, ...updatedData };
            setUserDetails(updatedUserDetails);
            setAlertShow(response.message);
            setErrors({});
          }
        }
      } catch (error: any) {
        var response = error.response.data;
        if (
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 422
        ) {
          setUniqueEmail(response.message.email);
          setErrors({});
        }
        console.error(error);
      }
    }
  };

  const verifyPassword = async (id: any, verifyCurrentPassword: string) => {
    if (validatePassword()) {
      try {
        const updatedData = {
          ...editedData,
          id: id,
          currentPassword: verifyCurrentPassword,
        };
        const response = await UserApi.checkCurrentPassword(id, updatedData);
        setPasswordAlert("");
        if (response) {
          if (response.statusCode === 409) {
            setVerifyPasswordAlert({
              severity: "error",
              message: response.message,
            });
            return false;
          } else if (response.statusCode === 200) {
            setRows(response.data);
            const updatedUserDetails = { ...userDetails, ...updatedData };
            setUserDetails(updatedUserDetails);
            // setPasswordAlert(response.message);
            setEnable(true);
            setOpen(false);
            handleQRCodeVisibility();
          } else if (response.statusCode === 422) {
            setTwoFactorPasswordAlert({
              severity: "error",
              message: response.message,
            });
            return false;
          }
        }
        setVerifyCurrentPassword("");
        setTwoFactorPasswordAlert(null);
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 422
        )
          console.error(error);
        return false;
      }
    }
  };

  const validatePassword = () => {
    let newErrors: Error = {};
    if (!verifyCurrentPassword.trim()) {
      newErrors.verifyCurrentPassword = "Current Password is required";
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
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
        const session: Session | null = await getSession();
        if (session) {
          const { email, firstName, lastName, mobile, role } = session.user;
          const updatedData = {
            id: id,
            password: newPassword,
            currentPassword: currentPassword,
            email: email,
            firstName: firstName,
            lastName: lastName,
            mobile: mobile,
            role: role,
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
          setErrors({});
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 422
        )
          setErrors({});
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
    <div>
      <Box sx={{ p: 2, marginTop: "60px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            [theme.breakpoints.up("sm")]: {
              marginLeft: "auto",
              marginRight: "auto",
            },
          }}
        >
          <Accordion
            defaultExpanded
            sx={{
              width: "70%",
              [theme.breakpoints.down("md")]: {
                width: "80%",
              },
              [theme.breakpoints.down("sm")]: {
                width: "90%",
              },
              marginLeft: "auto !important",
              marginRight: "auto !important",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{}}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                Profile Information
              </Typography>
            </AccordionSummary>
            {alertShow && (
              <Alert
                sx={{
                  width: "95%",
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
            <AccordionDetails>
              <form>
                <TextField
                  label="First name"
                  fullWidth
                  name="firstName"
                  margin="normal"
                  required
                  value={editedData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={
                    errors.firstName
                      ? errors.firstName
                      : uniqueValidation
                      ? "User already exists"
                      : ""
                  }
                  sx={{
                    marginTop: 1,
                    "& .MuiFormHelperText-root": {
                      color:
                        errors.firstName || uniqueValidation
                          ? "#e33241"
                          : "inherit",
                    },
                  }}
                />

                <TextField
                  label="Last name"
                  name="lastName"
                  required
                  value={editedData.lastName || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.lastName}
                  helperText={errors.lastName ? errors.lastName : ""}
                  sx={{ marginBottom: 1 }}
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
                  helperText={
                    errors.Email
                      ? errors.Email
                      : uniqueEmail
                      ? "Invalid email address"
                      : ""
                  }
                  sx={{
                    marginBottom: 1,
                    "& .MuiFormHelperText-root": {
                      color:
                        errors.Email || uniqueEmail ? "#e33241" : "inherit",
                    },
                  }}
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
                  sx={{ marginBottom: 0.5, marginTop: 3 }}
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
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Accordion
            sx={{
              width: "70%",
              [theme.breakpoints.down("md")]: {
                width: "80%",
              },
              [theme.breakpoints.down("sm")]: {
                width: "90%",
              },
              marginLeft: "auto !important",
              marginRight: "auto !important",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography sx={{ fontWeight: "bold" }}>
                Change Password
              </Typography>
            </AccordionSummary>

            {passwordAlert && (
              <Alert
                sx={{
                  width: "95%",
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
            <AccordionDetails>
              <form>
                <TextField
                  label="Current Password"
                  name="currentPassword"
                  required
                  fullWidth
                  margin="normal"
                  value={currentPassword}
                  type={showPassword1 ? "text" : "password"}
                  id="password"
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setErrors({});
                  }}
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
                    onClick={() => {
                      updatePassword(userId, currentPassword, newPassword);
                    }}
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </PrimaryButton>
                </Grid>
              </form>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Accordion
            sx={{
              width: "70%",
              [theme.breakpoints.down("md")]: {
                width: "80%",
              },
              [theme.breakpoints.down("sm")]: {
                width: "90%",
              },
              marginLeft: "auto !important",
              marginRight: "auto !important",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography
                sx={{ fontWeight: "bold", overflowWrap: "break-word" }}
              >
                Two Factor Authentication (OPTIONAL)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6" component="h1" sx={{ marginBottom: 1 }}>
                You have not enabled two factor authentication.
              </Typography>
              <Typography
                variant="h6"
                component="h1"
                sx={{ marginBottom: 2, marginTop: 2, fontSize: "16px" }}
              >
                When two factor authentication is enabled, you will be prompted
                for a secure, random One-Time password(OTP) during
                authentication. This One-Time password(OTP) will be sent to you
                via email and will be required along with your password to
                access your account. Please note that this One-Time
                password(OTP) is unique to each login attempt and provides an
                additional layer of security to your account.
              </Typography>
              {/* {showQRCode && qrCodeDataUrl && (
            <div>
              <Image
                src={qrCodeDataUrl}
                alt="QR Code"
                width={300}
                height={300}
              />
            </div>
          )} */}
              <div>
                <PrimaryButton
                  onClick={handleOpenDialog}
                  startIcon={enable ? <CloseIcon /> : <DoneIcon />}
                >
                  {enable ? "Disable" : "Enable"}
                </PrimaryButton>
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
                    Confirm Password
                    <IconButton
                      onClick={() => {
                        handleClose();
                        setVerifyCurrentPassword("");
                        setVerifyPasswordAlert(null);
                      }}
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
                  <DialogContent>
                    <Typography
                      variant="h6"
                      component="h1"
                      sx={{ marginBottom: 1, marginTop: 2 }}
                    >
                      For your security, please confirm your password to
                      continue.
                    </Typography>
                    {verifyPasswordAlert && (
                      <Alert
                        sx={{
                          width: "100%",
                          margin: "auto",
                          mt: "30px",
                          [theme.breakpoints.down("md")]: {
                            width: "100%",
                          },
                        }}
                        severity={verifyPasswordAlert.severity}
                        onClose={() => {
                          setVerifyPasswordAlert(null);
                        }}
                      >
                        {verifyPasswordAlert.message}
                      </Alert>
                    )}

                    <TextField
                      label="Password"
                      name="verifyCurrentPassword"
                      fullWidth
                      required
                      margin="normal"
                      id="Password"
                      value={verifyCurrentPassword}
                      type={showPassword4 ? "text" : "password"}
                      onChange={(e) => {
                        setVerifyCurrentPassword(e.target.value);
                        setError({});
                      }}
                      error={!!error.verifyCurrentPassword}
                      helperText={error.verifyCurrentPassword}
                      sx={{ marginBottom: 3 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handlePasswordVisibility(4)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                            >
                              {showPassword4 ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <DialogActions style={{ margin: "0 16px 10px 0" }}>
                      <Stack spacing={2} direction="row" paddingLeft="400px">
                        <SecondaryButton
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2, position: "sticky", top: "20px" }}
                          startIcon={<CloseIcon />}
                          onClick={() => {
                            handleClose();
                            setVerifyCurrentPassword("");
                            setError({});
                            setVerifyPasswordAlert(null);
                          }}
                        >
                          Cancel
                        </SecondaryButton>
                        <PrimaryButton
                          variant="contained"
                          color="primary"
                          sx={{ position: "sticky", top: "20px" }}
                          startIcon={<CheckIcon />}
                          onClick={() => {
                            verifyPassword(userId, verifyCurrentPassword);
                            setVerifyCurrentPassword("");
                          }}
                        >
                          Confirm
                        </PrimaryButton>
                      </Stack>
                    </DialogActions>
                  </DialogContent>
                </Dialog>
              </div>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </div>
  );
};

export default ProfilePage;
