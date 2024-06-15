"use client";
import Application from "@/app/applications/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserApi } from "@/services/api/UserApi";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Container } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import DeActivateModal from "@/components/User/DeActivateModal";
import EditUserModal from "@/components/User/EditUserModal";
import EditNoteIcon from "@mui/icons-material/EditNote";

interface IUserView {
  id?: number;
  username?: string;
  email?: string;
}
interface ICreateListProps {
  name: string;
  id: number;
}
interface Application {
  logoPath: string;
  id: number;
  name: string;
}
interface ExtractedDataItem {
  application: {
    id: any;
    name: string;
    baseUrl: string;
    logoPath: string;
  };
  name: string;
  baseUrl: string;
}
interface UserData {
  created_at: string | number | Date;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: number;
  mobile: string;
  id: number;
}
interface ICreatePasswordProps {
  password?: string | undefined;
  confirmPassword?: string | undefined;
  showPassword: boolean;
  showConfirmPassword: boolean;
  id?: number;
}
interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const UserView = ({ params }: { params: IUserView }) => {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = useState<ICreateListProps[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    ICreateListProps[]
  >([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [id, setId] = useState<number | undefined>(params.id);
  const theme = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [existingCheckboxes, setExistingCheckboxes] = useState<
    ICreateListProps[]
  >([]);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openModal, setOpenModal] = React.useState(false);
  const [isVisible, setIsVisible] = useState<ICreatePasswordProps>({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState<string>("");
  const [confirmationApplicationId, setConfirmationApplicationId] =
    useState<number>();
  const [confirmationApplicationName, setConfirmationApplicationName] =
    useState("");
  const [error, setError] = useState<{
    type: AlertColor;
    message: string;
  } | null>(null);
  const [deactivateModalOpen, setDeactivateModalOpen] =
    useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState("");
  const [alertShow, setAlertShow] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveAlert, setSaveAlert] = useState<AlertState | null>(null);

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setInvalidEmail("");
  };

  const editUser = async (id: any, updatedData: any) => {
    try {
      const response = await UserApi.update(id, updatedData);
      setInvalidEmail("");
      if (response) {
        if (response.statusCode == 409) {
          setInvalidEmail(response.message);
        } else if (response && response.statusCode === 200) {
          const updatedRows = response.data.map((row: any) => {
            if (row.id === id) {
              return { ...row, ...updatedData };
            }
            return row;
          });
          setUserData(updatedData);
          setAlertShow(response.message);
          handleEditModalClose();
        }
      }
    } catch (error: any) {
      var response = error.response.data;
      if (response.statusCode == 422 && response.message.email) {
        setInvalidEmail(response.message.email);
      }

      console.log(error);
    }
  };

  const handleEditSave = async (editedData: UserData) => {
    if ("id" in editedData) {
      const updatedData = { ...editedData };
      try {
        await editUser(updatedData.id, updatedData);
      } catch (error) {
        console.error("Error editing user:", error);
      }
    }
  };

  const handleEdit = () => {
    setInvalidEmail("");
    setEditModalOpen(true);
  };

  const setErrorMsg = (type: AlertColor, message: string) => {
    setError({ type, message });
  };

  const clearError = () => {
    setError(null);
  };

  const {
    register,
    watch,
    clearErrors,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ICreatePasswordProps>();

  useEffect(() => {
    getApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      getApplicationsByUserId(id);
    }
  }, [id]);

  useEffect(() => {
    if (applications.length > 0) {
      setSelectedCheckboxes(
        applications.map((app) => ({
          application: app,
          name: app.name,
          id: app.id,
          isChecked: true,
        }))
      );

      setExistingCheckboxes(
        applications.map((app) => ({
          application: app,
          name: app.name,
          id: app.id,
          isChecked: true,
        }))
      );
    }
  }, [applications]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user-data");
      if (user) {
        setUserData(JSON.parse(user));
      }
    }
  }, []);

  const handlePasswordChange = (e: string) => {
    setValue("password", e);
  };

  const handleConfirmPasswordChange = (e: string) => {
    setValue("confirmPassword", e);
  };

  const getApplicationsByUserId = async (id: number | undefined) => {
    try {
      if (id === undefined) {
        return;
      }
      const res = await UserApi.getApplicationsByUserId(id);
      if (res.length === 0) {
        setApplications([]);
        setSelectedCheckboxes([]);
        return;
      }
      const extractedData: ExtractedDataItem[] = res;
      const mappedData: Application[] = extractedData.map(
        (item: ExtractedDataItem) => ({
          id: item.application.id,
          name: item.application.name,
          baseUrl: item.application.baseUrl,
          logoPath: item.application.logoPath,
        })
      );
      setApplications(mappedData);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getApplication = async () => {
    try {
      const res = await UserApi.getApplication();
      setOptions(res);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredApplications = applications
    ? applications.filter((application) => {
        if (application.name) {
          return application.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return false;
      })
    : [];

  const handleSubmitModal = async (selectedCheckboxes: ICreateListProps[]) => {
    await onSubmitModal(selectedCheckboxes);
    setOpen(false);
  };

  const onSubmitModal = async (
    formData: ICreateListProps | ICreateListProps[]
  ) => {
    const formDataArray = Array.isArray(formData) ? formData : [formData];
    const applicationIds: string[] = formDataArray.map((formDataItem) => {
      return formDataItem.id.toString();
    });
    try {
      const res = await UserApi.userApplicationMapping(id!, applicationIds);
      if (res.statusCode === 200 && res.message) {
        setSaveAlert({
          severity: "success",
          message: res.message,
        });
      }
      getApplicationsByUserId(id);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleCheckboxChange = (optionId: number) => {
    if (selectedCheckboxes.some((checkbox) => checkbox.id === optionId)) {
      setSelectedCheckboxes((prevSelected) =>
        prevSelected.filter((checkbox) => checkbox.id !== optionId)
      );
    } else {
      const selectedOption = options.find((opt) => opt.id === optionId);
      if (selectedOption) {
        setSelectedCheckboxes((prevSelected) => {
          const updatedSelection = [
            ...prevSelected,
            {
              name: selectedOption.name,
              id: selectedOption.id,
            },
          ];

          const uniqueSelection = Array.from(
            new Map(
              updatedSelection.map((checkbox) => [checkbox.id, checkbox])
            ).values()
          );
          return uniqueSelection;
        });
      }
    }
  };

  const handleBackButtonClick = () => {
    localStorage.clear();
    window.location.href = "/users";
  };

  const resendLink = async () => {
    clearError();
    if (userData !== null) {
      const email = userData.email;
      const id = userData.id;
      const data = {
        email: email,
        id: id,
      };
      try {
        const res = await UserApi.sendResendLinkToUser(data);
        setErrorMsg("success", res.message);
        return res;
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    } else {
      console.error("Error: userData is null");
    }
  };

  const handlePasswordVisibility = (field: keyof ICreatePasswordProps) => {
    setIsVisible((prevIsVisible) => ({
      ...prevIsVisible,
      [field]: !prevIsVisible[field],
    }));
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setValue("password", "");
    setValue("confirmPassword", "");
    clearErrors("password");
    clearErrors("confirmPassword");
  };

  const onSubmit = async () => {
    clearError();
    const formData = watch();
    if (userData !== null) {
      const email = userData.email;
      const id = userData.id;
      const password = formData.password;
      const confirmPassword = formData.confirmPassword;
      const data = {
        email: email,
        id: id,
        password: password!,
        confirmPassword: confirmPassword!,
      };
      try {
        const res = await UserApi.savePassword(data);
        if (res.user) {
          userData.status = res.user.status;
        }
        setErrorMsg("success", res.message);
        handleCloseModal();
        return res;
      } catch (error) {
        console.error("Error submitting data:", error);
      }
      setPassword("");
      setConfirmPassword("");
    } else {
      console.error("Error: userData is null");
    }
  };

  const deactivateUser = async () => {
    clearError();
    if (userData && userData.id) {
      const response = await UserApi.updateStatus(userData.id);
      if (response.statusCode == 200) {
        setErrorMsg("success", "User deactivated");
        userData.status = 3;
      }
      setDeactivateModalOpen(false);
    }
  };

  const deactivateModalClose = () => {
    setDeactivateModalOpen(false);
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

  const BackButton = styled(Button)(({ theme }) => ({
    textTransform: "none",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    backgroundColor: "#FF9843",
    color: "#fff",
    ":hover": {
      backgroundColor: "#FE7A36",
    },
    marginTop: theme.spacing(3),
  }));

  if (!userData) {
    return null;
  }
  const userStatus: { [key: number]: string } = {
    1: "Active",
    2: "Pending",
    3: "Inactive",
  };

  return (
    <Container maxWidth="xl">
      {alertShow && (
        <Alert
          severity="success"
          onClose={() => {
            setAlertShow("");
          }}
        >
          {alertShow}
        </Alert>
      )}
      {error && (
        <Alert
          sx={{
            width: "100%",
            margin: "0px",
            mt: "30px",
          }}
          severity={error.type}
          onClose={clearError}
        >
          {error.message}
        </Alert>
      )}
           {saveAlert && (
        <Alert
          severity={saveAlert.severity}
          onClose={() => {
            setSaveAlert(null);
          }}
        >
          {saveAlert.message}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginBottom: 1, marginTop: 2 }}
            >
              User Details
            </Typography>
            <Divider sx={{ marginBottom: 1, flexGrow: 1 }} color="#265073" />
            <PrimaryButton
              variant="contained"
              color="primary"
              style={{ margin: "17px 15px 0 0" }}
              onClick={handleOpenModal}
              startIcon={<HowToRegIcon />}
              disabled={userData.status === 1}
            >
              Set Password & Activate
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              color="primary"
              style={{ margin: "15px 15px 0 0" }}
              onClick={() => resendLink()}
              startIcon={<LocalPostOfficeIcon />}
              disabled={userData.status === 1}
            >
              Resend Activation Email
            </PrimaryButton>
            <PrimaryButton
              variant="contained"
              color="primary"
              style={{ margin: "15px 15px 0 0" }}
              onClick={() => setDeactivateModalOpen(true)}
              startIcon={<PersonOffIcon />}
              disabled={userData.status === 3}
            >
              Deactivate User
            </PrimaryButton>
            <Dialog open={openModal} onClose={handleClose}>
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
                Create Password
                <IconButton
                  onClick={handleCloseModal}
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
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  <TextField
                    label="Password"
                    required
                    fullWidth
                    value={isVisible.password}
                    type={isVisible.showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required.",
                      pattern: {
                        value:
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/]).{8,}$/,
                        message:
                          "Must contain: 8 or more characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.",
                      },
                    })}
                    onChange={(e) => {
                      handlePasswordChange(e.target.value);
                    }}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handlePasswordVisibility("showPassword")
                            }
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {isVisible.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password
                        ? errors.password.message?.toString()
                        : null
                    }
                    size="small"
                  />
                  <TextField
                    label="Confirm Password"
                    required
                    fullWidth
                    {...register("confirmPassword", {
                      required: "Confirm password is required.",
                      validate: (val: string | undefined) => {
                        if (watch("password") != val) {
                          return "Confirm password does not match";
                        }
                      },
                    })}
                    value={isVisible.confirmPassword}
                    type={isVisible.showConfirmPassword ? "text" : "password"}
                    onChange={(e) => {
                      clearErrors("confirmPassword");
                      handleConfirmPasswordChange(e.target.value);
                    }}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handlePasswordVisibility("showConfirmPassword")
                            }
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {isVisible.showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(errors.confirmPassword)}
                    helperText={
                      errors.confirmPassword
                        ? errors.confirmPassword.message?.toString()
                        : null
                    }
                    size="small"
                  />
                </Box>
              </DialogContent>
              <Divider
                color="#265073"
                sx={{ marginBottom: "2%", marginTop: "2%" }}
              ></Divider>
              <DialogActions style={{ margin: "0 16px 10px 0" }}>
                <PrimaryButton
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </PrimaryButton>
              </DialogActions>
            </Dialog>
            <DeActivateModal
              open={deactivateModalOpen}
              onDeactivateConfirm={deactivateUser}
              onClose={deactivateModalClose}
            />
            <Card
              sx={{
                width: "100%",
                height: "120%",
                margin: "auto",
                mt: "30px",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              }}
            >
              <CardContent>
                <Table
                  stickyHeader
                  style={{ maxWidth: "100%", height: "120%" }}
                >
                  <TableBody sx={{ height: "100%" }}>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="right" sx={{ paddingTop: 0 }}>
                        <EditUserModal
                          open={editModalOpen}
                          onClose={handleEditModalClose}
                          rowData={userData}
                          onEdit={handleEditSave}
                          uniqueEmail={invalidEmail}
                        />
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEdit()}
                        >
                          <EditNoteIcon sx={{ color: "#1C658C" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>First name:</strong>
                      </TableCell>
                      <TableCell
                        style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                      >
                        {userData.firstName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Last name:</strong>
                      </TableCell>
                      <TableCell
                        style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                      >
                        {userData.lastName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Email:</strong>
                      </TableCell>
                      <TableCell
                        style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                      >
                        {userData.email}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Mobile:</strong>
                      </TableCell>
                      <TableCell
                        style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                      >
                        {userData.mobile}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Role:</strong>
                      </TableCell>
                      <TableCell
                        style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                      >
                        {userData.role}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Status:</strong>
                      </TableCell>
                      <TableCell
                        style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                      >
                        {userStatus[userData.status]}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginBottom: 1, marginTop: 2 }}
              position="sticky"
            >
              Assigned Applications
            </Typography>
            <Divider sx={{ marginBottom: 2, flexGrow: 2 }} color="#265073" />
            <Card
              sx={{
                width: "100%",
                height: "80%",
                margin: "auto",
                position: "sticky",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              }}
            >
              <Card
                sx={{
                  width: "60%",
                  height: "365px",
                  margin: "auto",
                  position: "sticky",
                  marginTop: "45px",
                  marginBottom: "20px",
                  overflow: "hidden",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                  "@media (width: 1366px) and (height: 1024px),(width: 1280px) and (height: 853px),(width: 1280px) and (height: 800px),(width: 1368px) and (height: 912px)":
                    {
                      height: "370px",
                      marginTop: "70px",
                      marginBottom: "40px",
                    },
                }}
              >
                <Table stickyHeader style={{ maxWidth: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Box
                          display="flex"
                          width="100%"
                          margin="auto"
                          marginLeft="0"
                          paddingTop="0px"
                          marginTop="0px"
                          position="sticky"
                          sx={{
                            [theme.breakpoints.down("md")]: {
                              width: "100%",
                            },
                          }}
                        >
                          <TextField
                            InputProps={{
                              startAdornment: (
                                <SearchIcon
                                  sx={{
                                    color: "grey",
                                  }}
                                />
                              ),
                            }}
                            placeholder="Search applications"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            size="small"
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "75%",
                                md: "50%",
                                lg: "390px",
                              },
                              height: "40px",
                              "& .MuiInputBase-root": {
                                height: "100%",
                                outline: "none",
                                textDecoration: "none",
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          style={{
                            textAlign: "center",
                            paddingTop: "5%",
                            border: "none",
                          }}
                        >
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && (
                      <TableRow sx={{ marginTop: "0px" }}>
                        <TableCell colSpan={2}>
                          <TableContainer
                            component={Paper}
                            sx={{
                              width: "100%",
                              height: "260px",
                              marginTop: "2px",
                              marginBottom: "0px",
                              overflowY: "auto",
                              border: "none",
                              boxShadow: "none",
                            }}
                          >
                            <FormGroup>
                              {options
                                .filter((option) =>
                                  option.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                )
                                .map((option) => (
                                  <FormControlLabel
                                    key={option.id}
                                    control={
                                      <Checkbox
                                        checked={selectedCheckboxes.some(
                                          (checkbox) =>
                                            checkbox.id === option.id
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(option.id)
                                        }
                                        style={{
                                          color: "#265073",
                                          marginBottom: "0px",
                                          marginTop: "0px",
                                        }}
                                      />
                                    }
                                    label={
                                      <span
                                        style={{
                                          maxWidth: "300px",
                                          overflow: "hidden",
                                          display: "inline-block",
                                          whiteSpace: "unset",
                                          textOverflow: "ellipsis",
                                          wordBreak: "break-all",
                                          marginTop: "0px",
                                          marginBottom: "0px",
                                          paddingTop: "3px",
                                          paddingBottom: "0px",
                                        }}
                                      >
                                        {option.name}
                                      </span>
                                    }
                                  />
                                ))}
                              {options.filter((option) =>
                                option.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              ).length === 0 && (
                                <Typography>
                                  No applications available
                                </Typography>
                              )}
                            </FormGroup>
                          </TableContainer>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
              <Card
                sx={{
                  width: "60%",
                  margin: "auto",
                  position: "sticky",
                  marginTop: "25px",
                  marginBottom: "22px",
                  border: "none",
                  boxShadow: "none",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                  [theme.breakpoints.down("lg")]: {
                    marginLeft: "15px",
                  },
                  "@media (width: 914px) and (height: 412px),(width: 912px) and (height: 1368px),(width: 915px) and (height: 412px),(width: 932px) and (height: 430px),(width: 1180px) and (height: 820px)":
                    {
                      marginLeft: "155px",
                    },
                  "@media (width: 1180px) and (height: 820px),(width: 1024px) and (height: 768px)":
                    {
                      marginLeft: "200px",
                    },
                  "@media (width: 1024px) and (height: 1366px),(width: 1024px) and (height: 600px),(width: 1024px) and (height: 768px)":
                    {
                      marginLeft: "180px",
                    },
                }}
              >
                <PrimaryButton
                  startIcon={<SaveIcon />}
                  type="submit"
                  onClick={() => handleSubmitModal(selectedCheckboxes)}
                >
                  Save
                </PrimaryButton>
              </Card>
            </Card>
            <Box display="flex" justifyContent="flex-end">
              <BackButton
                variant="contained"
                onClick={handleBackButtonClick}
                startIcon={<ArrowBackIcon />}
                sx={{ marginTop: 4 }}
              >
                Back
              </BackButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserView;
