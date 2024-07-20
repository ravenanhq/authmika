"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  CardMedia,
  Button,
  Alert,
  styled,
  IconButton,
  Grid,
  Tabs,
  SxProps,
  Theme,
  Tab,
  TableContainer,
  CircularProgress,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { ApplicationApi } from "@/services/api/ApplicationApi";
import EditApplicationModal from "@/components/Applications/EditApplicationModal";
import { config } from "../../../../config";
import PropTypes from "prop-types";
import UserList from "@/components/User/UserList";

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
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  sx?: SxProps<Theme>;
  dir?: string;
}

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
      {value === index && <Box sx={{ p: 2, ...sx }}>{children}</Box>}
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

interface IApplicationView {
  id?: number;
}

const ApplicationView: React.FC<{ params: IApplicationView }> = ({}) => {
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uniqueAlert, setUniqueAlert] = useState<string>("");
  const [alertShow, setAlertShow] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [id, setId] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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
        if (response && response.statusCode === 200) {
          setApplicationData(response.data);
          setAlertShow(response.message);
          handleEditModalClose();
        } else if (response && response.statusCode === 409) {
          setAlertShow(response.message);
        }
      }
    } catch (error: any) {
      const response = error.response.data;
      if (response.statusCode === 422 && response.message.application) {
        setUniqueAlert(response.message.application);
      } else if (response.statusCode == 422) {
        setUniqueAlert(response.message);
      }
      console.log(error);
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const getUsers = async (id: number) => {
    try {
      const res = await ApplicationApi.getUserId(id);
      setId(id);
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
  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== "undefined") {
        const application = localStorage.getItem("application-data");
        setLoading(true);
        if (application) {
          try {
            const app = JSON.parse(application);
            await getUsers(app.id);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
    <Container component="div" maxWidth="xl">
      {loading && (
        <div style={{ textAlign: "center", marginTop: "5%" }}>
          <CircularProgress />
        </div>
      )}
      <Box sx={{ p: 2, margin: "auto", overflowX: "auto" }}>
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
        <Grid container>
          {!loading && (
            <>
              <Box
                component="fieldset"
                sx={{
                  p: 2,
                  border: "1px solid #ededed",
                  borderRadius: "5px",
                  margin: "5% 0px 3% 0px",
                  overflowX: "auto",
                  width: "100%",
                }}
              >
                <legend>
                  Application Details
                  <EditApplicationModal
                    open={editModalOpen}
                    onClose={handleEditModalClose}
                    rowData={applicationData}
                    onEdit={handleEditSave}
                    uniqueValidation={uniqueAlert}
                  />
                  <IconButton
                    aria-label="edit"
                    onClick={handleEdit}
                    sx={{
                      backgroundColor: "#1C658C",
                      color: "#fff",
                      marginLeft: "10px",
                    }}
                  >
                    <EditNoteIcon
                      style={{ fontSize: "20px", color: "white" }}
                    />
                  </IconButton>
                </legend>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    marginTop: 4,
                    paddingLeft: "80px",
                    paddingRight: "80px",
                    "@media(width: 1024px) and (height: 768px), (min-width: 430px) and (max-width: 932px)":
                      {
                        paddingLeft: "100px",
                        paddingRight: "100px",
                      },
                    "@media (width: 1180px) and (height: 820px),(width: 1024px) and (height: 1366px),(width: 1024px) and (height: 600px)":
                      {
                        paddingLeft: "120px",
                        paddingRight: "120px",
                      },
                    "@media(width: 915px) and (height: 412px),(width: 375px) and (height: 667px),(width: 375px) and (height: 812px),(width: 320px) and (height: 568px),(width: 360px) and (height: 640px)":
                      {
                        paddingLeft: "0px",
                        paddingRight: "10px",
                        width: "100%",
                      },
                    "@media(width: 1024px) and (height: 1366px),(width: 344px) and (height: 882px)":
                      {
                        width: "100%",
                      },
                    "@media(width: 344px) and (height: 882px)": {
                      width: "200%",
                    },
                    "@media(width: 414px) and (height: 896px)": {
                      paddingLeft: "20px",
                    },
                    "@media(width: 390px) and (height: 844px),(width: 414px) and (height: 736px),(width: 411px) and (height: 731px),(width: 412px) and (height: 914px),(width: 344px) and (height: 882px),(width: 360px) and (height: 740px),(width: 412px) and (height: 915px),(width: 375px) and (height: 667px),(width: 430px) and (height: 932px),(width: 414px) and (height: 896px)":
                      {
                        paddingLeft: "10px",
                      },
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "row", md: "row" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        Name:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "18px",
                          marginLeft: { xs: 10.5, md: 13 },
                        }}
                      >
                        {applicationData.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "row", md: "row" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        Application:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "18px", marginLeft: { xs: 4, md: 8 } }}
                      >
                        {applicationData.application}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "row", md: "row" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        Base URL:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "18px", marginLeft: { xs: 6, md: 8 } }}
                      >
                        {applicationData.baseUrl}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "row", md: "row" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        Call Back URL:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "18px", marginLeft: { xs: 1, md: 5 } }}
                      >
                        {applicationData.callBackUrl}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", md: "row" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "18px",
                          whiteSpace: "nowrap",
                          fontWeight: "bold",
                        }}
                      >
                        Client Secret ID:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "18px",
                          wordBreak: "break-all",
                          marginLeft: { md: 2 },
                        }}
                      >
                        {applicationData.clientSecretId}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", md: "row" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "18px",
                          whiteSpace: "nowrap",
                          fontWeight: "bold",
                        }}
                      >
                        Client Secret Key:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "18px",
                          wordBreak: "break-word",
                          marginLeft: { md: 2 },
                        }}
                      >
                        {applicationData.clientSecretKey}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "row", md: "row" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        Image:
                      </Typography>
                      <Box
                        sx={{
                          marginLeft: { xs: 10, md: 12 },
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
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
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Card
                sx={{
                  p: 2,
          margin: "auto",
          width: "100%",
          boxSizing: "border-box",
          overflowX: "auto",
          marginLeft: "0px",
          marginTop: "20px",
                  height: "100%",
                  "@media(width: 1024px) and (height: 1366px),@media(width: 1366px) and (height: 1024px)":
                    {
                      width: "200%",
                    },
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                  sx={{ marginLeft: 3 }}
                >
                  <Tab label="Users" {...TabProps(0)} />
                  {/* <Tab label="Groups" {...TabProps(1)} /> */}
                </Tabs>
                <CustomTabPanel
                  value={tabValue}
                  index={0}
                  sx={{ width: "100%", height: "100%" }}
                >
                  <TableContainer sx={{marginBottom:"12px",paddingLeft:"8px",maxWidth:"99.5%","@media (max-width: 1024px) and (max-height: 768px)": {
                ".MuiDataGrid-virtualScroller": {
      maxwidth:'100vw'          },
              },}}>  <UserList
                      title={false}
                      isListPage={false}
                      applicationId={id}
                      isView={false}
                      roleId={undefined}
                      id={undefined}
                      showRole={true}
                      roleView={false}
                      roleName={undefined}
                      groupId={undefined}
                      groupView={false}
                      showGroup={true}
                      groupName={undefined}
                      isGroup={false}
                    />
                  </TableContainer>
                </CustomTabPanel>
                {/* <CustomTabPanel
              value={tabValue}
              index={1}
              sx={{ width: "1450px", height: "700px" }}
            >
              <GroupList title={false} isListPage={false} applicationId={id} isView={false} />
            </CustomTabPanel> */}
              </Card>
            </>
          )}
        </Grid>
      </Box>
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

export default ApplicationView;
