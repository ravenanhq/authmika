"use client";
import Application from "@/app/applications/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserApi } from "@/services/api/UserApi";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Container } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";

export interface RowData {
  name: string;
  id: number;
}

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
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: number;
  mobile: number;
  id: number | undefined;
}

interface ICreatePasswordProps {
  password?: string | undefined;
  confirmPassword?: string | undefined;
  showPassword: boolean;
  showConfirmPassword: boolean;
  id?: number;
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
  const [savepasswordAlert, setSavePasswordAlert] = useState("");
  const [resendlinkAlert, setResendLinkAlert] = useState("");
  const [confirmationApplicationId, setConfirmationApplicationId] =
    useState<number>();
  const [confirmationApplicationName, setConfirmationApplicationName] =
    useState("");

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
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleConfirmOpen = (applicationId: number, applicationName: any) => {
    setConfirmationOpen(true);
    setConfirmationApplicationId(applicationId);
    setConfirmationApplicationName(applicationName);
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
      await UserApi.userApplicationMapping(id!, applicationIds);
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
        setSelectedCheckboxes((prevSelected) => [
          ...prevSelected,
          {
            name: selectedOption.name,
            id: selectedOption.id,
          },
        ]);
      }
    }
  };

  const handleCancelClick = () => {
    setSelectedCheckboxes(existingCheckboxes);
    setOpen(false);
  };

  const handleConfirm = async (
    userId: number | undefined,
    applicationId: number
  ) => {
    try {
      await UserApi.deleteUserApplicationMapping(userId!, applicationId);
      getApplicationsByUserId(userId);
      setOpen(false);
      setConfirmationOpen(false);
    } catch (error) {
      console.error("Error deleting user application mapping:", error);
    }
  };

  const handleBackButtonClick = () => {
    localStorage.clear();
    window.location.href = "/users";
  };

  const resendLink = async () => {
    if (userData !== null) {
      const email = userData.email;
      const id = userData.id;
      const data = {
        email: email,
        id: id,
      };
      try {
        const res = await UserApi.sendResendLinkToUser(data);
        setResendLinkAlert("");
        setSavePasswordAlert("");
        setResendLinkAlert(res.message);
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
        setSavePasswordAlert("");
        handleCloseModal();
        setSavePasswordAlert(res.message);
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

  return (
    <Container maxWidth="xl">
      {savepasswordAlert && (
        <Alert
          sx={{
            width: "60%",
            margin: "0px",
            mt: "30px",
            [theme.breakpoints.down("md")]: {
              width: "100%",
            },
          }}
          severity="success"
          onClose={() => {
            setSavePasswordAlert("");
          }}
        >
          {savepasswordAlert}
        </Alert>
      )}
      {resendlinkAlert && (
        <Alert
          sx={{
            width: "60%",
            margin: "0px",
            mt: "30px",
            [theme.breakpoints.down("md")]: {
              width: "100%",
            },
          }}
          severity="success"
          onClose={() => {
            setResendLinkAlert("");
          }}
        >
          {resendlinkAlert}
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
                        {userData.status === 1 ? "Active" : "Pending"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, height: "88%", position: "sticky" }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginBottom: 1, marginTop: 2 }}
            >
              Assigned Applications
            </Typography>
            <Divider sx={{ marginBottom: 4, flexGrow: 2 }} color="#265073" />
            <Card
              sx={{
                width: "100%",
                height: "95%",
                margin: "auto",
                mt: "30px",
                position: "sticky",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              }}
            >
              <CardContent>
                <TableContainer
                  component={Paper}
                  sx={{ width: "100%", maxHeight: 300, overflow: "auto" }}
                >
                  <Table stickyHeader style={{ maxWidth: "100%" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                              <PrimaryButton
                                variant="contained"
                                onClick={handleOpen}
                                startIcon={<AddIcon />}
                                disabled={userData.status === 2}
                              >
                                Assign Applications
                              </PrimaryButton>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {applications.length > 0 && (
                                <Box
                                  display="flex"
                                  justifyContent="flex-end"
                                  width="100%"
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
                                  />
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredApplications.length < 1 && (
                        <TableRow>
                          <TableCell>
                            <Typography>No results found</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredApplications.map((application) => (
                        <TableRow
                          key={application.id}
                          style={{ display: "flex" }}
                        >
                          {/* <TableCell style={{ width: "6%" }}>
                    {application.logoPath !== undefined &&
                    application.logoPath !== "" &&
                    application.logoPath !== null ? (
                      <Image
                        src={"/assets/images/" + application.logoPath}
                        alt="logo"
                        width={60}
                        height={40}
                      />
                    ) : (
                      <Image
                        src="/assets/images/no_image.jpg"
                        alt="logo"
                        width={60}
                        height={40}
                      />
                    )}
                  </TableCell> */}
                          <TableCell style={{ width: "100%", height: "50%" }}>
                            <Box
                              sx={{
                                display: "flex",
                                padding: "10px",
                                position: "sticky",
                              }}
                            >
                              <Typography
                                style={{
                                  marginRight: "auto",
                                  display: "inline",
                                  textAlign: "left",
                                }}
                              >
                                {application.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell
                            style={{
                              width: "10%",
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <IconButton
                              onClick={() =>
                                handleConfirmOpen(
                                  application.id,
                                  application.name
                                )
                              }
                              sx={{
                                fontSize: "4px",
                                color: "#FF9843",
                                filled: "none",
                                padding: 0,
                                display: "inline",
                                width: "100",
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                            <Modal
                              open={confirmationOpen}
                              onClose={() => setConfirmationOpen(false)}
                            >
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  width: isMobile ? "80%" : "auto",
                                  bgcolor: "background.paper",
                                  boxShadow: 24,
                                  p: 4,
                                }}
                              >
                                <div>
                                  <h2>Confirmation</h2>
                                  <p>
                                    Are you sure you want to remove this
                                    application?
                                    <span style={{ color: "#191c1a" }}>
                                      {confirmationApplicationName}
                                    </span>
                                  </p>
                                  <SecondaryButton
                                    variant="contained"
                                    color="primary"
                                    style={{ margin: "15px 15px 0 0" }}
                                    startIcon={<CloseIcon />}
                                    onClick={() => setConfirmationOpen(false)}
                                  >
                                    Cancel
                                  </SecondaryButton>
                                  <PrimaryButton
                                    variant="contained"
                                    color="primary"
                                    style={{ margin: "15px 15px 0 0" }}
                                    startIcon={<CheckIcon />}
                                    onClick={() => {
                                      handleConfirm(
                                        id,
                                        confirmationApplicationId!
                                      );
                                    }}
                                  >
                                    Confirm
                                  </PrimaryButton>
                                </div>
                              </Box>
                            </Modal>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" sx={{ paddingBottom: 2 }}>
        <BackButton
          variant="contained"
          onClick={handleBackButtonClick}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </BackButton>

        {options && options.length > 0 && (
          <Modal
            open={open && options.length > 0}
            onClose={() => setOpen(false)}
            title="Application"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "400px",
                width: "90%",
                maxHeight: "95vh",
                overflowX: "hidden",
                bgcolor: "background.paper",
                boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
              }}
            >
              <DialogTitle
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  backgroundColor: "#265073",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "12px",
                }}
              >
                Assign Applications
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
              <Divider color="#265073" />
              {open && options.length > 0 && (
                <Box id="modal-description" sx={{ mt: 2 }}>
                  <Box style={{ width: "100%", boxSizing: "border-box" }}>
                    <Box
                      sx={{
                        mt: 2,
                        mx: 2,
                        overflowX: "hidden",
                        height: "200px",
                      }}
                    >
                      <FormGroup sx={{ marginLeft: 7 }}>
                        <Grid container spacing={1}>
                          {options.map((option) => (
                            <Grid item xs={6} key={option.id}>
                              <FormControlLabel
                                key={option.id}
                                control={
                                  <Checkbox
                                    key={option.id}
                                    checked={selectedCheckboxes.some(
                                      (checkbox) => checkbox.id === option.id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(option.id)
                                    }
                                    style={{ color: "#265073" }}
                                  />
                                }
                                label={
                                  <span
                                    style={{
                                      maxWidth: "150px",
                                      overflow: "hidden",
                                      display: "inline-block",
                                      whiteSpace: "unset",
                                      textOverflow: "ellipsis",
                                      wordBreak: "break-all",
                                    }}
                                  >
                                    {option.name}
                                  </span>
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </FormGroup>
                    </Box>
                  </Box>
                  <Box
                    style={{
                      position: "sticky",
                      bottom: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                      padding: "10px",
                    }}
                  >
                    <Divider color="#265073" />
                    <DialogActions style={{ margin: "0 16px 10px 0" }}>
                      <PrimaryButton
                        startIcon={<SaveIcon />}
                        type="submit"
                        onClick={() => handleSubmitModal(selectedCheckboxes)}
                      >
                        Save
                      </PrimaryButton>
                      <SecondaryButton
                        startIcon={<CloseIcon />}
                        type="submit"
                        onClick={() => {
                          handleCancelClick();
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </SecondaryButton>
                    </DialogActions>
                  </Box>
                </Box>
              )}
            </Box>
          </Modal>
        )}
      </Box>
    </Container>
  );
};

export default UserView;
