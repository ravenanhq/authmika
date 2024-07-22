"use client";
import Application from "@/app/applications/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserApi } from "@/services/api/UserApi";
import {
  Alert,
  AlertColor,
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  styled,
  useTheme,
  CardMedia,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import { Update, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import DeActivateModal from "@/components/User/DeActivateModal";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PropTypes from "prop-types";
import { RowData } from "@/components/User/UserList";
import { RolesApi } from "@/services/api/RolesApi";
import { SxProps, Theme } from "@mui/material";
import { GroupsApi } from "@/services/api/GroupsApi";
import ApplicationList from "@/components/Applications/ApplicationList";
import { ApplicationApi } from "@/services/api/ApplicationApi";
import ProfileUpload from "@/components/ProfileUpload/ProfileUpload";
import { config } from "../../../../config";
export interface GroupData {
  id: number;
  name: string;
  status: number;
  created_at: string | number | Date;
}
interface IUserView {
  id?: number;
  username?: string;
  email?: string;
  rowData: RowData | null;
  isAppList: string | boolean;
  userId: number | undefined;
  isAllApp: string | boolean;
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
export interface UserData {
  created_at: string | number | Date;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  groups?: GroupData;
  groupId: string;
  status: number;
  mobile: string;
  id: number;
  file: string;
  profile: string;
}
interface ICreatePasswordProps {
  password?: string | undefined;
  confirmPassword?: string | undefined;
  firstName?: string | undefined;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  id?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: SxProps<Theme>;
  dir?: string;
}

interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

interface Role {
  name: string;
  id: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
  group?: string;
}

const InitialRowData = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  role: "",
  profile: "",
  file: "",
  groups: {
    id: 0,
    name: "",
    status: 0,
    created_at: "",
  },
  groupId: "",
  created_at: "",
  status: 0,
};

const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
}));

const CustomTabs = styled(Tab)(({ theme }) => ({
  textTransform: "none",
}));

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, ...sx }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

function TabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserView: React.FC<{ params: IUserView }> = ({ params }) => {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [options, setOptions] = useState<ICreateListProps[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    ICreateListProps[]
  >([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [id, setId] = useState<number | undefined>(params.id);
  const theme = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [isVisible, setIsVisible] = useState<ICreatePasswordProps>({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [error, setError] = useState<{
    type: AlertColor;
    message: string;
  } | null>(null);
  const [deactivateModalOpen, setDeactivateModalOpen] =
    useState<boolean>(false);
  const [invalidEmail, setInvalidEmail] = useState("");
  const [alertShow, setAlertShow] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveAlert, setSaveAlert] = useState<AlertState | null>(null);
  const [saveModalAlert, setSaveModalAlert] = useState<AlertState | null>(null);
  const [openIcon, setOpenIcon] = React.useState(false);
  const handleOpenIcon = () => setOpenIcon(true);
  const [tabValue, setTabValue] = React.useState(0);
  const [tabsValue, setTabsValue] = React.useState(0);
  const [formErrors, setFormErrors] = useState<Errors>({});
  const [editedData, setEditedData] = useState<RowData>(InitialRowData);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const emailError = invalidEmail || !!formErrors.email;
  const helperText = [invalidEmail, formErrors.email].filter(Boolean).join(" ");
  const [userId, setUserId] = useState<number | undefined>();
  const [groupName, setGroupName] = useState("");
  const [image, setImage] = useState("");
  const [profile, setProfile] = useState("");
  // const [isGroupList, setIsGroupList] = useState(true);
  const GET_ALL = "all";
  // const GET_FILTER = "filter";

  useEffect(() => {
    if (openIcon) {
      setFormErrors({});
      setTabValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIcon]);

  useEffect(() => {
    if (userData) {
      setEditedData({
        ...userData,
        groups: userData.groups ?? {
          id: 0,
          name: "-",
          status: 0,
          created_at: "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

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
    getRoles();
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      getApplicationsByUserId(id);
    }
  }, [id]);

  useEffect(() => {
    if (id !== undefined) {
      getApplication(GET_ALL, userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setApplications(res);
      return res;
    } catch (error: any) {
      console.log(error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await RolesApi.getAllRoleApi();
      if (response) {
        const roleData = response;
        setRoles(roleData);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getGroups = async () => {
    try {
      const response = await GroupsApi.getAllGroupsApi();
      if (response) {
        const groupData = response;
        setGroups(groupData);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getApplication = async (get: string, userId: number | undefined) => {
    try {
      const res = await ApplicationApi.getApplications(get, userId);
      setOptions(res);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleCloseIcon = () => {
    setOpenIcon(false);
    setInvalidEmail("");
    setSaveModalAlert(null);
    setAlertShow("");
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

  const handleSubmitModal = async (
    selectedCheckboxes: ICreateListProps[],
    isModal: boolean
  ) => {
    const formDataArray = Array.isArray(selectedCheckboxes)
      ? selectedCheckboxes
      : [selectedCheckboxes];
    const applicationIds: string[] = formDataArray.map((formDataItem) => {
      return formDataItem.id.toString();
    });

    try {
      const res = await UserApi.userApplicationMapping(id!, applicationIds);
      if (res.statusCode === 200 && res.message) {
        if (isModal) {
          setSaveModalAlert({
            severity: "success",
            message: res.message,
          });
        } else {
          setSaveAlert({
            severity: "success",
            message: res.message,
          });
        }
      }
      await getApplicationsByUserId(id);
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
    setAlertShow("");
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: { id: string; name: string } | null,
    field: "role" | "group"
  ) => {
    if (field === "role") {
      setEditedData((prevData) => ({
        ...prevData,
        role: newValue ? newValue.name : "",
      }));
    } else if (field === "group" && newValue) {
      const groupId = parseInt(newValue.id);
      setGroupName(newValue.name);
      setEditedData((prevData) => ({
        ...prevData,
        groupId: newValue ? newValue.id : "",
      }));
    }
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

    setFormErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const editUser = async (id: any, updatedData: any) => {
    if (validateForm()) {
      try {
        const response = await UserApi.update(id, updatedData);

        setInvalidEmail("");
        if (response) {
          if (response && response.statusCode === 200) {
            setUserData(response.data);
            setAlertShow(response.message);
          }
        }
      } catch (error: any) {
        var response = error.response.data;
        if (response.statusCode == 422 && response.message.email) {
          setInvalidEmail(response.message.email);
        } else if (response.statusCode == 422) {
          setInvalidEmail(response.message);
        }
        console.log(error);
      }
    }
  };

  const handleEditSave = async (editedData: UserData) => {
    if ("id" in editedData) {
      const updatedData = { ...editedData };
      editedData.file = "";
      try {
        await editUser(updatedData.id, updatedData);
      } catch (error) {
        console.error("Error editing user:", error);
      }
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      editedData.file = base64String;
    };

    reader.readAsDataURL(file);
    editedData.profile = file.name;
    setProfile(file.name);
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
      <Grid item xs={12} md={6}>
        <Card
          component="fieldset"
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            border: "1px solid #ededed",
            borderRadius: "5px",
            margin: "auto",
            marginTop: "5%",
            width: "100%",
            boxSizing: "border-box",
            overflowX: "auto",
          }}
        >
          <legend style={{ paddingLeft: "0px" }}>
            User Details
            <IconButton
              aria-label="edit"
              onClick={handleOpenIcon}
              sx={{
                backgroundColor: "#1C658C",
                color: "#fff",
                ":hover": {
                  color: "#fff",
                  backgroundColor: "#1C658C",
                },
                marginLeft: "10px",
              }}
            >
              <EditNoteIcon
                sx={{
                  color: "white",
                  width: "0.75em",
                  height: "0.75em",
                }}
              />
            </IconButton>
            <Dialog open={openIcon} onClose={handleCloseIcon}>
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
                  onClick={handleCloseIcon}
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
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
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
                    {saveModalAlert && (
                      <Alert
                        severity={saveModalAlert.severity}
                        onClose={() => {
                          setSaveModalAlert(null);
                        }}
                      >
                        {saveModalAlert.message}
                      </Alert>
                    )}
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label="basic tabs example"
                    >
                      <CustomTab label="Primary Details" {...TabProps(0)} />
                      <CustomTab label="Assignment" {...TabProps(1)} />
                      {/* <CustomTab
                                    label="Assigned Groups"
                                    {...LabelProps(2)}
                                  /> */}
                    </Tabs>
                  </Box>
                  <CustomTabPanel
                    value={tabValue}
                    index={0}
                    sx={{ width: "100%", height: "450px" }}
                  >
                    <TextField
                      label="First name"
                      name="firstName"
                      value={editedData.firstName || ""}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          firstName: e.target.value,
                        })
                      }
                      required
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!formErrors.firstName}
                      helperText={formErrors.firstName}
                      sx={{ marginTop: 0, marginBottom: 1 }}
                    />

                    <TextField
                      label="Last name"
                      name="lastName"
                      required
                      value={editedData.lastName || ""}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          lastName: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!formErrors.lastName}
                      helperText={formErrors.lastName}
                      sx={{ marginBottom: 1 }}
                    />

                    <TextField
                      label="Email"
                      name="email"
                      required
                      value={editedData.email || ""}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          email: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!emailError}
                      helperText={helperText || null}
                      sx={{ marginBottom: 1 }}
                    />

                    <TextField
                      label="Mobile"
                      name="mobile"
                      required
                      value={editedData.mobile || ""}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          mobile: e.target.value,
                        })
                      }
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!formErrors.mobile}
                      helperText={formErrors.mobile}
                      sx={{ marginBottom: 1 }}
                    />
                    <Autocomplete
                      value={
                        roles.find((role) => role.name === editedData.role) ||
                        null
                      }
                      onChange={(event, newValue) =>
                        handleChange(event, newValue as Role | null, "role")
                      }
                      options={roles}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          error={!!formErrors.role}
                          size="small"
                          helperText={formErrors.role}
                          sx={{ marginTop: 2, marginBottom: 3 }}
                        />
                      )}
                    />
                    <Autocomplete
                      value={
                        groups.find(
                          (group) => group.id === editedData.groupId
                        ) || null
                      }
                      onChange={(event, newValue) =>
                        handleChange(event, newValue, "group")
                      }
                      options={groups}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Group"
                          error={!!formErrors.group}
                          size="small"
                          helperText={formErrors.group}
                          sx={{ marginBottom: 3.5 }}
                        />
                      )}
                    />

                    <ProfileUpload
                      onProfileUpload={handleFileUpload}
                      imageFile={editedData.profile || ""}
                    />

                    <Box display="flex" justifyContent="flex-end">
                      <PrimaryButton
                        startIcon={<SaveIcon />}
                        onClick={() => handleEditSave(editedData)}
                        sx={{ marginTop: "10px", marginBottom: "10px" }}
                      >
                        Update
                      </PrimaryButton>
                    </Box>
                  </CustomTabPanel>
                  <CustomTabPanel
                    value={tabValue}
                    index={1}
                    sx={{ width: "100%", height: "450px" }}
                  >
                    <Box>
                      <Card
                        sx={{
                          width: "100%",
                          height: "80%",
                          margin: "auto",
                          position: "sticky",
                          [theme.breakpoints.down("md")]: {
                            width: "100%",
                          },
                          "@media (width: 1366px) and (height: 1024px),(width: 1280px) and (height: 853px),(width: 1280px) and (height: 800px),(width: 1368px) and (height: 912px)":
                            {
                              height: "370px",
                              marginTop: "10px",
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
                                        xs: "200%",
                                        sm: "75%",
                                        md: "20%",
                                        lg: "390px",
                                      },
                                      "@media (width: 932px) and (height: 430px),(width: 915px) and (height: 412px),(width: 1024px) and (height: 768px),(width: 1180px) and (height: 820px),(width: 1024px) and (height: 600px),(width: 914px) and (height: 412px),(width: 912px) and (height:1368px),(width: 1024px) and (height: 1366px)":
                                        {
                                          width: "100%",
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
                                                  handleCheckboxChange(
                                                    option.id
                                                  )
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
                      <Box display="flex" justifyContent="flex-end">
                        <PrimaryButton
                          startIcon={<SaveIcon />}
                          type="submit"
                          onClick={() =>
                            handleSubmitModal(selectedCheckboxes, true)
                          }
                          sx={{ marginTop: 3 }}
                        >
                          Save
                        </PrimaryButton>
                      </Box>
                    </Box>
                  </CustomTabPanel>
                </Box>
              </DialogContent>
            </Dialog>
          </legend>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              border: "none",
              boxShadow: "none",
              paddingLeft: "60px",
              gap: "10px",
              "@media (max-width: 915px)": {
                flexDirection: "column",
                paddingLeft: "0",
                alignItems: "flex-start",
              },
              "@media (width:667px) and (height:375px),(width:568px) and (height:320px),(width:540px) and (height:720px),(width:720px) and (height:540px),(width:640px) and (height:360px)":
                {
                  paddingLeft: "70px",
                },
              "@media (width:740px) and (height:360px),(width:736px) and (height:414px),(width:731px) and (height:411px),(width:853px) and (height:1280px),(width:768px) and (height:1024px),(width:912px) and (height:1368px),(width:820px) and (height:1180px)":
                {
                  paddingLeft: "70px",
                },
              "@media (width:896px) and (height:414px),(width:812px) and (height:375px),(width:914px) and (height:412px),(width:882px) and (height:344px),(width:844px) and (height:390px),(width:932px) and (height:430px),(width:915px) and (height:412px)":
                {
                  paddingLeft: "70px",
                },
              "@media (width:932px) and (height:430px)": {
                paddingLeft: "50px",
              },
            }}
          >
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
          </Box>

          <Dialog open={openModal} onClose={handleCloseModal}>
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
                    errors.password ? errors.password.message?.toString() : null
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
          <Table stickyHeader style={{ maxWidth: "100%", height: "120%" }}>
            <TableBody sx={{ height: "100%" }}>
              <TableRow>
                <TableCell colSpan={2} sx={{ padding: 0, border: "none" }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      marginTop: 4,
                      paddingLeft: "60px",
                      paddingRight: "300px",
                      "@media (max-width: 915px)": {
                        flexDirection: "column",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        "& > .MuiGrid-item": {
                          marginBottom: "20px",
                        },
                      },
                      "@media (width:667px) and (height:375px),(width:540px) and (height:720px),(width:568px) and (height:320px),(width:640px) and (height:360px),(width:896px) and (height:414px),(width:720px) and (height:540px)":
                        {
                          paddingLeft: "70px",
                        },
                      "@media (width:740px) and (height:360px),(width:736px) and (height:414px),(width:731px) and (height:411px),(width:853px) and (height:1280px),(width:912px) and (height:1368px),(width:768px) and (height:1024px),(width:820px) and (height:1180px)":
                        {
                          paddingLeft: "70px",
                        },
                      "@media (width:896px) and (height:414px),(width:812px) and (height:375px),(width:914px) and (height:412px),(width:882px) and (height:344px),(width:915px) and (height:412px),(width:844px) and (height:390px),(width:932px) and (height:430px)":
                        {
                          paddingLeft: "70px",
                        },
                      "@media (width:932px) and (height:430px)": {
                        paddingLeft: "50px",
                        paddingRight: "30px",
                      },
                      "@media (min-width:1024px) and (max-width:1200px)": {
                        paddingLeft: "60px",
                        paddingRight: "50px",
                      },
                      "@media (min-width:768px) and (max-width:1024px)": {
                        paddingLeft: "60px",
                        paddingRight: "50px",
                      },
                    }}
                  >
                    <Grid item xs={12} sm={4} sx={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong style={{ marginRight: "20px" }}>
                          First name:
                        </strong>
                        <div style={{ marginLeft: "0px", marginTop: "2px" }}>
                          {userData.firstName}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong>Last name:</strong>
                        <div style={{ marginLeft: "23px" }}>
                          {userData.lastName}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong>Email:</strong>
                        <div
                          style={{ whiteSpace: "unset", marginLeft: "55px" }}
                        >
                          {userData.email}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong>Mobile:</strong>
                        <div
                          style={{
                            whiteSpace: "unset",
                            marginLeft: "8px",
                            paddingLeft: "40px",
                          }}
                        >
                          {userData.mobile}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong>Role:</strong>
                        <div style={{ marginLeft: "60px" }}>
                          {userData.role}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong>Group:</strong>
                        <div style={{ marginLeft: "47px" }}>
                          {groupName
                            ? groupName
                            : userData.groups
                            ? userData.groups.name
                            : "-"}
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        marginBottom: 0,
                        marginTop: { lg: 5, sm: 0 },
                        "@media (width:1024px) and (height:1366px),(width:1024px) and (height:768px),(width:1024px) and (height:600px),(width:1180px) and (height:820px),(width:932px) and (height:430px)":
                          {
                            marginTop: "auto",
                            marginBottom: "auto",
                          },
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong>Status:</strong>
                        <div style={{ marginLeft: "49px" }}>
                          {userStatus[userData.status]}
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      sx={{
                        "@media (width:1024px) and (height:1366px)": {
                          marginTop: "0px",
                          marginBottom: "auto",
                        },
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <strong>Avatar:</strong>
                        <div style={{ marginLeft: "47px" }}>
                          {userData.profile ? (
                            <CardMedia
                              component="img"
                              src={`${config.service}/assets/images/${userData.profile}`}
                              alt="profile"
                              height="100"
                              style={{ width: "80px" }}
                            />
                          ) : (
                            <CardMedia
                              component="img"
                              src={`${config.service}/assets/images/no_image.jpg`}
                              alt="profile"
                              height="100"
                              style={{ width: "80px" }}
                            />
                          )}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </Grid>
      <Card
        sx={{
          p: 2,
          margin: "auto",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "auto",
          marginLeft: "0px",
          marginTop: "20px",
        }}
      >
        <Tabs
          value={tabsValue}
          onChange={handleTabsChange}
          aria-label="basic tabs example"
          sx={{ marginLeft: 2 }}
        >
          <CustomTabs label="Applications" {...TabProps(0)} />
          {/* <Tab label="Groups" {...TabProps(3)} /> */}
        </Tabs>
        <CustomTabPanel
          value={tabsValue}
          index={0}
          sx={{ width: "100%", height: "100%" }}
        >
          <TableContainer>
            <ApplicationList
              title={false}
              userId={id}
              get={GET_ALL}
              isAdd={false}
            />
          </TableContainer>
        </CustomTabPanel>
        {/* <CustomTabPanel
          value={tabValue}
          index={1}
          sx={{ width: "100%", height: "100%" }}
        >
          <TableContainer>
            <GroupList
              title={false}
              get={GET_ALL}
              userId={id}
              isCreate={false}
            />
          </TableContainer>
        </CustomTabPanel> */}
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
    </Container>
  );
};

export default UserView;
