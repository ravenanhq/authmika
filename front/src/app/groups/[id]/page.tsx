"use client";
import Application from "@/app/applications/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserApi } from "@/services/api/UserApi";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
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
import SearchIcon from "@mui/icons-material/Search";
import { Container } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { GroupsApi } from "@/services/api/GroupsApi";

export interface RowData {
  name: string;
  id: number;
}
interface GroupData {
  name: string;
}
interface IGroupView {
  id?: number;
  username?: string;
  email?: string;
}
interface ICreateListProps {
  name: string;
  id: number;
}
interface ICreateUserProps {
  firstName: string;
  lastName: string;
  id: number;
}
interface Application {
  logoPath: string;
  id: number;
  name: string;
}
interface User {
  id: number;
  firstName: string;
  lastName: string;
}
interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const GroupView = ({ params }: { params: IGroupView }) => {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [open, setOpen] = React.useState(false);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [options, setOptions] = useState<ICreateListProps[]>([]);
  const [userOptions, setUserOptions] = useState<ICreateUserProps[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    ICreateListProps[]
  >([]);
  const [selectedUsersCheckboxes, setSelectedUsersCheckboxes] = useState<
    ICreateUserProps[]
  >([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [userSearchTerm, setUserSearchTerm] = React.useState<string>("");
  const [id, setId] = useState<number | undefined>(params.id);
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [alertShow, setAlertShow] = useState<AlertState | null>(null);
  const [isSearchTermPresent, setIsSearchTermPresent] = useState(false);
  const [isUserSearchTermPresent, setIsUserSearchTermPresent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<GroupData | null>(null);
  const [name, setName] = useState<string>("");
  const [rows, setRows] = useState<RowData[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const group = localStorage.getItem("group-data");
      if (group) {
        setGroupData(JSON.parse(group));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const group = localStorage.getItem("group-data");
      if (group) {
        const parsedGroupData = JSON.parse(group);
        setGroupData(parsedGroupData);
        setData(parsedGroupData);
        const savedName = parsedGroupData.name || "";
        setName(savedName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUser();
    getApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      getUsersByGroupId(id);
      getApplicationsByGroupId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const filteredValue = inputValue
      .toUpperCase()
      .split("")
      .filter((char) => /^[A-Z ]$/.test(char))
      .join("");
    setName(filteredValue);
    const group = localStorage.getItem("group-data");
    if (group) {
      const parsedGroupData = JSON.parse(group);
      parsedGroupData.name = filteredValue;
      const data = JSON.stringify(parsedGroupData);
      localStorage.setItem("group-data", data);
    }
  };

  const getApplicationsByGroupId = async (id: number | undefined) => {
    try {
      if (id === undefined) {
        return;
      }
      const res = await UserApi.getApplicationsByGroupId(id);
      if (res.length === 0) {
        setApplications([]);
        setSelectedCheckboxes([]);
        return;
      }
      setSelectedCheckboxes(
        res.map((app: { id: number }) => ({
          id: app.id,
        }))
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const getUsersByGroupId = async (id: number | undefined) => {
    try {
      if (id === undefined) {
        return;
      }
      const res = await UserApi.getUsersById(id);
      if (res.length === 0) {
        setUsers([]);
        setSelectedUsersCheckboxes([]);
        return;
      }
      setSelectedUsersCheckboxes(
        res.map((usergroup: { userId: any; groupId: any }) => ({
          id: usergroup.userId,
          groupId: usergroup.groupId,
        }))
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const getApplication = async () => {
    try {
      let res = await UserApi.getApplication();
      setOptions(res);
      setLoading(false);
      setIsSearchTermPresent(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      let res = await UserApi.getAllUsers();
      if (res) {
        setUserOptions(res);
        setLoading(false);
        setIsUserSearchTermPresent(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (searchTerm.trim() !== "") {
      setIsSearchTermPresent(true);
    }
  };

  const handleUserSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserSearchTerm(event.target.value);
    if (userSearchTerm.trim() !== "") {
      setIsUserSearchTermPresent(true);
    }
  };

  const filteredApplications = applications
    ? applications.filter((application) => {
        if (application && application.name) {
          return application.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return false;
      })
    : [];

  const filteredGroups = users
    ? users.filter((user) => {
        if (user && user.firstName) {
          return user.firstName
            .toLowerCase()
            .includes(userSearchTerm.toLowerCase());
        }
        return false;
      })
    : [];

  const submitApplication = async (
    selectedCheckboxes: ICreateListProps[],
    selectedUsersCheckboxes: ICreateUserProps[]
  ) => {
    await onSubmit(selectedCheckboxes, selectedUsersCheckboxes);
    setOpen(false);
  };

  const onSubmit = async (
    formData: ICreateListProps | ICreateListProps[],
    formDataUser: ICreateUserProps | ICreateUserProps[]
  ) => {
    const formDataArray = Array.isArray(formData) ? formData : [formData];
    const applicationIds: string[] = formDataArray.map((formDataItem) => {
      return formDataItem.id.toString();
    });
    const formDataArrayUser = Array.isArray(formDataUser)
      ? formDataUser
      : [formDataUser];
    const userIds: string[] = formDataArrayUser.map((formDataItemUser) => {
      return formDataItemUser.id.toString();
    });

    try {
      const res = await UserApi.groupApplicationMapping(
        id!,
        userIds,
        applicationIds
      );
      if (res.statusCode === 200 && res.message) {
        setAlertShow({
          severity: "error",
          message: res.message,
        });
      } else if (res.statusCode === 201 && res.message) {
        setAlertShow({
          severity: "success",
          message: res.message,
        });
      }
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

  const handleUserCheckboxChange = (optionId: number) => {
    if (selectedUsersCheckboxes.some((checkbox) => checkbox.id === optionId)) {
      setSelectedUsersCheckboxes((prevSelected) =>
        prevSelected.filter((checkbox) => checkbox.id !== optionId)
      );
    } else {
      const selectedUserOption = userOptions.find((opt) => opt.id === optionId);
      if (selectedUserOption) {
        setSelectedUsersCheckboxes((prevSelected) => {
          const updatedSelection = [
            ...prevSelected,
            {
              firstName: selectedUserOption.firstName,
              lastName: selectedUserOption.lastName,
              id: selectedUserOption.id,
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
    window.location.href = "/groups";
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    if (data) {
      const updatedData: GroupData = { ...data, name };
      setData(updatedData);
      try {
        await editGroup(id, updatedData);
        localStorage.setItem("groupName", name);
      } catch (error) {
        console.error("Error updating group:", error);
      }
    }
  };

  const editGroup = async (id: any, updatedData: any) => {
    try {
      const response = await GroupsApi.updateGroupApi(id, updatedData);
      if (response && response.statusCode === 200) {
        setRows(response);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (data) {
      setName(data.name);
    }
  };

  if (!groupData) {
    return null;
  }

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

  return (
    <Container maxWidth="xl">
      <Box sx={{ marginTop: 0.5 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontSize: 30, border: "none" }}>
                {isEditing ? (
                  <TextField
                    value={name}
                    onChange={handleNameChange}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <strong>{name}</strong>
                )}
                <IconButton
                  onClick={isEditing ? handleSaveClick : handleEditClick}
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
                  {isEditing ? (
                    <SaveIcon
                      sx={{ color: "white", width: "0.75em", height: "0.75em" }}
                    />
                  ) : (
                    <EditNoteIcon
                      sx={{ color: "white", width: "0.75em", height: "0.75em" }}
                    />
                  )}
                </IconButton>

                {isEditing && (
                  <IconButton
                    onClick={handleCancelClick}
                    sx={{
                      backgroundColor: "#FF9843",
                      color: "#fff",
                      ":hover": {
                        color: "#fff",
                        backgroundColor: "#FE7A36",
                      },
                      marginLeft: "5px",
                    }}
                  >
                    <CloseIcon
                      sx={{ color: "white", width: "0.75em", height: "0.75em" }}
                    />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {alertShow && (
            <Alert
              severity={alertShow.severity}
              onClose={() => {
                setAlertShow(null);
              }}
              sx={{
                margin: "0 auto",
                width: {
                  xs: "90%",
                  sm: "70%",
                  md: "50%",
                  lg: "40%",
                  xl: "30%",
                },
              }}
            >
              {alertShow.message}
            </Alert>
          )}
          <Box sx={{ p: 0 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginBottom: 3, marginTop: 1, textAlign: "center" }}
            >
              Assigned Users
            </Typography>
            <Card
              sx={{
                width: "85%",
                height: "50%",
                margin: "auto",
                position: "sticky",
                [theme.breakpoints.down("md")]: {
                  width: "85%",
                  margin: "auto",
                },
                [theme.breakpoints.down("lg")]: {
                  width: "170%",
                  margin: "5rem",
                },
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                  margin: "auto",
                },
                "@media (min-width: 768px) and (max-width: 1024px),(width: 736px) and (height: 414px)":
                  {
                    width: "99%",
                    margin: "0rem",
                  },
                "@media (min-width: 912px) and (max-width: 1200px)": {
                  width: "170%",
                  margin: "5rem",
                },
                "@media (width: 653px) and (height: 280px),(width: 731px) and (height: 411px), (width: 640px) and (height: 360px), (width: 667px) and (height: 375px), (width: 720px) and (height: 540px), (width: 740px) and (height: 360px)":
                  {
                    width: "100%",
                    margin: "1rem auto",
                  },
              }}
            >
              <Card
                sx={{
                  width: "60%",
                  height: "365px",
                  margin: "auto",
                  position: "sticky",
                  marginTop: "35px",
                  marginBottom: "20px",
                  overflow: "hidden",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
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
                            placeholder="Search users"
                            variant="outlined"
                            value={userSearchTerm}
                            onChange={handleUserSearchChange}
                            size="small"
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "75%",
                                md: "70%",
                                lg: "270px",
                              },
                              "@media (min-width: 1366px) and (max-width: 1024px)":
                                {
                                  width: "40%",
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
                              {userOptions
                                .filter((option) =>
                                  option.firstName
                                    ?.toLowerCase()
                                    .includes(userSearchTerm.toLowerCase())
                                )
                                .map((option) => (
                                  <FormControlLabel
                                    key={option.id}
                                    control={
                                      <Checkbox
                                        checked={selectedUsersCheckboxes.some(
                                          (checkbox) =>
                                            checkbox.id === option.id
                                        )}
                                        onChange={() =>
                                          handleUserCheckboxChange(option.id)
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
                                        {option.firstName} {option.lastName}
                                      </span>
                                    }
                                  />
                                ))}
                              {userOptions.filter((option) =>
                                option.firstName
                                  ?.toLowerCase()
                                  .includes(userSearchTerm.toLowerCase())
                              ).length === 0 &&
                                isUserSearchTermPresent && (
                                  <Typography>No users available</Typography>
                                )}
                            </FormGroup>
                          </TableContainer>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Box
            sx={{
              p: 0,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginBottom: 3, marginTop: 1, textAlign: "center" }}
              position="sticky"
            >
              Assigned Applications
            </Typography>
            <Card
              sx={{
                width: "85%",
                height: "50%",
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
                  marginTop: "35px",
                  marginBottom: "20px",
                  overflow: "hidden",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
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
                                md: "70%",
                                lg: "270px",
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
                                    ?.toLowerCase()
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
                                  ?.toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              ).length === 0 &&
                                isSearchTermPresent && (
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
            </Card>
          </Box>
          <Box
            sx={{
              width: "85%",
              margin: "auto",
              position: "sticky",
              [theme.breakpoints.down("md")]: {
                width: "100%",
              },
            }}
            display="flex"
            justifyContent="flex-end"
            gap="15px"
          >
            <PrimaryButton
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={() =>
                submitApplication(selectedCheckboxes, selectedUsersCheckboxes)
              }
              sx={{ height: "50%", marginTop: "auto" }}
            >
              Save
            </PrimaryButton>
            <BackButton
              variant="contained"
              onClick={handleBackButtonClick}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </BackButton>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GroupView;
