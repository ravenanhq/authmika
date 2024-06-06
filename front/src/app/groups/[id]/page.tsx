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
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [appmessage, setAppMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const group = localStorage.getItem("group-data");
      if (group) {
        setGroupData(JSON.parse(group));
      }
    }
  }, []);

  useEffect(() => {
    getApplication();
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      getUsersByGroupId(id);
      getApplicationsByGroupId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      const res = await UserApi.getApplication();
      setOptions(res);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const res = await UserApi.getAllUsers();
      if (res) {
        setUserOptions(res);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleUserSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserSearchTerm(event.target.value);
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

  const submitApplication = async (selectedCheckboxes: ICreateListProps[]) => {
    await onSubmit(selectedCheckboxes);
    setOpen(false);
    setAppMessage({ text: "Application saved successfully!", type: "success" });
  };

  const handleSubmitUser = async (
    selectedUsersCheckboxes: ICreateUserProps[]
  ) => {
    await onSubmitUser(selectedUsersCheckboxes);
    setOpen(false);
    setMessage({ text: "User saved successfully!", type: "success" });
  };

  const onSubmit = async (formData: ICreateListProps | ICreateListProps[]) => {
    const formDataArray = Array.isArray(formData) ? formData : [formData];
    const applicationIds: string[] = formDataArray.map((formDataItem) => {
      const id =
        formDataItem.id !== undefined ? formDataItem.id.toString() : "";
      return id;
    });

    try {
      await UserApi.groupApplicationMapping(id!, applicationIds);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const onSubmitUser = async (
    formData: ICreateUserProps | ICreateUserProps[]
  ) => {
    const formDataArray = Array.isArray(formData) ? formData : [formData];
    const userIds: string[] = formDataArray.map((formDataItem) => {
      return formDataItem.id.toString();
    });

    try {
      await UserApi.userGroupMapping(id!, userIds);
      getUsersByGroupId(id);
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

  const handleUserCheckboxChange = (optionId: number) => {
    if (selectedUsersCheckboxes.some((checkbox) => checkbox.id === optionId)) {
      setSelectedUsersCheckboxes((prevSelected) =>
        prevSelected.filter((checkbox) => checkbox.id !== optionId)
      );
    } else {
      const selectedUserOption = userOptions.find((opt) => opt.id === optionId);
      if (selectedUserOption) {
        setSelectedUsersCheckboxes((prevSelected) => [
          ...prevSelected,
          {
            firstName: selectedUserOption.firstName,
            lastName: selectedUserOption.lastName,
            id: selectedUserOption.id,
          },
        ]);
      }
    }
  };

  const handleBackButtonClick = () => {
    localStorage.clear();
    window.location.href = "/groups";
  };

  const handleClose = () => {
    setMessage(null);
    setAppMessage(null);
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
                <strong>{groupData.name}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 0 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ marginBottom: 1, marginTop: 1, textAlign: "center" }}
            >
              Assigned Users
            </Typography>
            <Card
              sx={{
                width: "85%",
                height: "30%",
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
                "@media (min-width: 768px) and (max-width: 1024px)": {
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
              {message && (
                <Alert
                  severity={message.type}
                  action={
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="inherit"
                      onClick={handleClose}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    width: "90%",
                    margin: "0 auto",
                    paddingLeft: "1rem",
                  }}
                >
                  {message.text}
                </Alert>
              )}
              <Card
                sx={{
                  width: "60%",
                  height: "355px",
                  margin: "auto",
                  position: "sticky",
                  marginTop: "15px",
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
                                md: "50%",
                                lg: "340px",
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
                      <div style={{ textAlign: "center", marginTop: "5%" }}>
                        <CircularProgress />
                      </div>
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
                                    .toLowerCase()
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
                                  .toLowerCase()
                                  .includes(userSearchTerm.toLowerCase())
                              ).length === 0 && (
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
              <Card
                sx={{
                  width: "60%",
                  margin: "auto",
                  position: "sticky",
                  marginTop: "15px",
                  marginBottom: "20px",
                  border: "none",
                  boxShadow: "none",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                }}
              >
                <PrimaryButton
                  startIcon={<SaveIcon />}
                  type="submit"
                  onClick={() => handleSubmitUser(selectedUsersCheckboxes)}
                >
                  Save
                </PrimaryButton>
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
              sx={{ marginBottom: 1, marginTop: 1, textAlign: "center" }}
              position="sticky"
            >
              Assigned Applications
            </Typography>
            <Card
              sx={{
                width: "85%",
                height: "30%",
                margin: "auto",
                position: "sticky",
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
              }}
            >
              {appmessage && (
                <Alert
                  severity={appmessage.type}
                  action={
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="inherit"
                      onClick={handleClose}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    width: "90%",
                    margin: "0 auto",
                    paddingLeft: "1rem",
                  }}
                >
                  {appmessage.text}
                </Alert>
              )}
              <Card
                sx={{
                  width: "60%",
                  height: "355px",
                  margin: "auto",
                  position: "sticky",
                  marginTop: "15px",
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
                                md: "50%",
                                lg: "340px",
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
                      <div style={{ textAlign: "center", marginTop: "5%" }}>
                        <CircularProgress />
                      </div>
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
                  marginTop: "15px",
                  marginBottom: "20px",
                  border: "none",
                  boxShadow: "none",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                }}
              >
                <PrimaryButton
                  startIcon={<SaveIcon />}
                  type="submit"
                  onClick={() => submitApplication(selectedCheckboxes)}
                >
                  Save
                </PrimaryButton>
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
          >
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
