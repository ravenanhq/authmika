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
  TableCell,
  Grid,
  Tabs,
  SxProps,
  Theme,
  Tab,
  TableContainer,
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

const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
}));

const LabelTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",
  paddingRight: "70px",
  paddingLeft: "70px",
  border: "none",
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
        if (application) {
          try {
            const app = JSON.parse(application);
            await getUsers(app.id);
            setApplicationData(app);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
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
    <Container maxWidth="xl">
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
          <Box
            component="fieldset"
            sx={{
              p: 2,
              border: "1px solid #ededed",
              borderRadius: "5px",
              margin: "5% 0px 3% 0px",
              overflowX: "auto",
              paddingRight: "90px",
              paddingLeft: "90px",
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
                <EditNoteIcon style={{ fontSize: "20px", color: "white" }} />
              </IconButton>
            </legend>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <strong>Name:</strong>
                  <Box sx={{ marginLeft: 11, marginBottom: 2 }}>
                    {applicationData.name}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <strong>Application:</strong>
                  <Box sx={{ marginLeft: 7, marginBottom: 2 }}>
                    {applicationData.application}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <strong>Base URL:</strong>
                  <Box sx={{ marginLeft: 7, marginBottom: 2 }}>
                    {applicationData.baseUrl}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <strong>Call Back URL:</strong>
                  <Box sx={{ marginLeft: 5, marginBottom: 2 }}>
                    {applicationData.callBackUrl}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <strong style={{ marginTop: 5 }}>Client Secret ID:</strong>
                  <Box
                    sx={{
                      marginLeft: 1,
                      whiteSpace: "unset",
                      wordBreak: "break-all",
                      marginBottom: 0,
                    }}
                  >
                    {applicationData.clientSecretId}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex">
                  <strong style={{ whiteSpace: "nowrap" }}>
                    Client Secret Key:
                  </strong>
                  <Box
                    sx={{
                      marginLeft: 1,
                      marginBottom: 2,
                      whiteSpace: "unset",
                      wordBreak: "break-all",
                    }}
                  >
                    {applicationData.clientSecretKey}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <strong>Image:</strong>
                  <Box sx={{ marginLeft: 10 }}>
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
          <Card sx={{ width: "100%" }}>
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
              sx={{ width: "100%", height: "500px" }}
            >
              <TableContainer>
                <UserList
                  title={false}
                  isListPage={false}
                  applicationId={id}
                  isView={false}
                  role={false}
                  status={false}
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
