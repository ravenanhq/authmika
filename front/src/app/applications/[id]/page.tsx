"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
  styled,
  useTheme,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  ListItemIcon,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { ApplicationApi } from "@/services/api/ApplicationApi";
import EditApplicationModal from "@/components/Applications/EditApplicationModal";
import { config } from "../../../../config";
import ForwardIcon from '@mui/icons-material/Forward';

interface ApplicationData {
  created_at: string | number | Date;
  id: number;
  name: string;
  application: string;
  baseUrl: string;
  base_url: string;
  callBackUrl: string;
  call_back_url: string;
  file: string;
  logoPath: string;
  logo_path: string;
  formData: FormData;
  clientSecretId: string;
  clientSecretKey: string;
  client: string;
  deleting: boolean;
}

interface User {
  firstName: string;
  lastName: string;
  name: string;
  id: number;
}

interface Group {
  name: string;
  id: number;
}

const ApplicationView = () => {
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uniqueAlert, setUniqueAlert] = useState<string>("");
  const [alertShow, setAlertShow] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const theme = useTheme();

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setUniqueAlert("");
  };

  const handleEditSave = (editedData: ApplicationData) => {
    editedData["logo_path"] = editedData["logoPath"];
    editedData["base_url"] = editedData["baseUrl"];
    editedData["call_back_url"] = editedData["callBackUrl"];
    editApplication(editedData.id, editedData);
  };

  const editApplication = async (applicationId: any, updatedData: any) => {
    try {
      const response = await ApplicationApi.updateApplication(
        applicationId,
        updatedData
      );
      setUniqueAlert("");
      if (response) {
        if (response.statusCode === 409) {
          setUniqueAlert(response.setAlertShowmessage);
        } else if (response.statusCode === 200) {
          setApplicationData(response.data);
          handleEditModalClose();
        }
      }
    } catch (error: any) {
      console.error(error);
      const response = error.response.data;
      if (response.statusCode === 422 && response.message.application) {
        setUniqueAlert(response.message.application);
      }
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const getUsers = async (id: number) => {
    try {
      const res = await ApplicationApi.getUserId(id);
      if (res.users.length > 0) {
        setUsers(res.users);
      } else {
        setUsers([]);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const getGroups = async (id: number) => {
    try {
      const response = await ApplicationApi.getUserId(id);
      if (response.groups.length > 0) {
        setGroups(response.groups);
      } else {
        setGroups([]);
      }
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const application = localStorage.getItem("application-data");
        if (application) {
          try {
            const app = JSON.parse(application);
            setLoading(true);
            await getUsers(app.id);
            await getGroups(app.id);
            setApplicationData(app);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchData();
  }, []);

  const BackButton = styled(Button)(({ theme }) => ({
    textTransform: "none",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    backgroundColor: "#FF9843",
    color: "#fff",
    ":hover": {
      backgroundColor: "#FE7A36",
    },
    marginRight: "12px",
    textAlign: "end",
    float: "right",
  }));

  const handleBackButtonClick = () => {
    localStorage.clear();
    window.location.href = "/applications";
  };

  if (!applicationData) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 2 ,margin:"auto"}}>
      {uniqueAlert && (
        <Alert
          severity="success"
          onClose={() => {
            setUniqueAlert("");
          }}
        >
          {uniqueAlert}
        </Alert>
      )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "100%",
                  lg: "80%",
                  xl: "100%",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ marginBottom: 1, marginTop: 2 }}
                >
                  Application Details
                </Typography>
                <Divider
                  sx={{ marginBottom: 0, flexGrow: 1 }}
                  color="#265073"
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <EditApplicationModal
                    open={editModalOpen}
                    onClose={handleEditModalClose}
                    rowData={applicationData}
                    onEdit={handleEditSave}
                    uniqueValidation={uniqueAlert}
                  />
                  <IconButton aria-label="edit" onClick={handleEdit}>
                    <EditNoteIcon style={{ fontSize: "30px" }} />
                  </IconButton>
                </Box>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Name:</strong>
                      </TableCell>
                      <TableCell>{applicationData.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Image:</strong>
                      </TableCell>
                      <TableCell>
                        {applicationData.logoPath ? (
                          <CardMedia
                            component="img"
                            src={`${config.service}/assets/images/${applicationData.logoPath}`}
                            alt="logo"
                            height="100"
                            style={{ width: "80px" }}
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            src={`${config.service}/assets/images/no_image.jpg`}
                            alt="logo"
                            height="100"
                            style={{ width: "80px" }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Application:</strong>
                      </TableCell>
                      <TableCell>{applicationData.application}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Base URL:</strong>
                      </TableCell>
                      <TableCell>{applicationData.baseUrl}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Call Back URL:</strong>
                      </TableCell>
                      <TableCell>{applicationData.callBackUrl}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Client Secret ID:</strong>
                      </TableCell>
                      <TableCell
                        style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                      >
                        {applicationData.clientSecretId}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Client Secret Key:</strong>
                      </TableCell>
                      <TableCell
                        style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                      >
                        {applicationData.clientSecretKey}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: "290px" }}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ marginBottom: 1, marginTop: 2 }}
                >
                  Users
                </Typography>
                <Divider
                  sx={{ marginBottom: 1, flexGrow: 1 }}
                  color="#265073"
                />
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ flexGrow: 1 }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : users.length > 0 ? (
                  <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                    <List>
                      {users.map((user, index) => (
                        <ListItem
                          key={user.id}>
                                  <ListItemIcon>
                                  <ForwardIcon style={{ color: '#265073' }} />
                                  </ListItemIcon>
                               <ListItemText>
                          <Typography variant="body1">
                            {user.firstName} {user.lastName}
                          </Typography>
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    sx={{ flexGrow: 1, height: "100%" }}
                  >
                    No users found
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card sx={{ height: "290px", marginTop: 2 }}>
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ marginBottom: 1, marginTop: 2 }}
                >
                  Groups
                </Typography>
                <Divider
                  sx={{ marginBottom: 1, flexGrow: 1 }}
                  color="#265073"
                />
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ flexGrow: 1 }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : groups.length > 0 ? (
                  <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
                    <List>
                      {groups.map((group, index) => (
                        <ListItem
                          key={group.id}>
                            <ListItemIcon>
                            <ForwardIcon style={{ color: '#265073' }} />
                            </ListItemIcon>
                               <ListItemText>
                          <Typography variant="body1">{group.name}</Typography>
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    sx={{ flexGrow: 1, height: "100%" }}
                  >
                    No groups are found
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <BackButton
        variant="contained"
        onClick={handleBackButtonClick}
        startIcon={<ArrowBackIcon />}
      >
        Back
      </BackButton>
    </Container>
  );
};

export default ApplicationView;
