"use client";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  TextField,
  styled,
  SxProps,
  Theme,
  Tab,
} from "@mui/material";
import { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { RolesApi } from "@/services/api/RolesApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserList from "@/components/User/UserList";
import PropTypes from "prop-types";
import React from "react";

export interface RowData {
  name: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
  groupId: number;
  created_at: string | number | Date;
  createdAt: string | number | Date;
}

export interface RoleData {
  id(id: any, updatedData: RoleData): unknown;
  name: string;
}

interface IRoleView {
  id?: number;
  username?: string;
  email?: string;
}

interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const userStatus: { [key: number]: string } = {
  1: "Active",
  2: "Pending",
  3: "Inactive",
};

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

const RoleView = ({ params }: { params: IRoleView }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<RoleData | null>(null);

  const [name, setName] = useState<string>("");
  const [rows, setRows] = useState<RowData[]>([]);
  const [id, setId] = useState<number | undefined>(params.id);
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [alertShow, setAlertShow] = useState("");
  const [saveAlert, setSaveAlert] = useState<AlertState | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<AlertState | null>(null);
  const [updatedData, setUpdatedData] = useState(data);
  const [tabValue, setTabValue] = React.useState(0);
  const roleName = updatedData?.name || data?.name || name;
  const [is409Error, setIs409Error] = useState(false);

  useEffect(() => {
    if (is409Error) {
      if (typeof window !== "undefined") {
        const role = localStorage.getItem("role-data");
        if (role) {
          const parsedRoleData = JSON.parse(role);
          setRoleData(parsedRoleData);
          setData(parsedRoleData);
          const savedName = parsedRoleData.name || "";
          setName(savedName);
        }
      }
      const data = JSON.stringify(roleData);
      localStorage.setItem("role-data", data);
      setData(roleData);

      setIs409Error(false);
    }
  }, [is409Error, roleData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role-data");
      if (role) {
        const parsedRoleData = JSON.parse(role);
        setRoleData(parsedRoleData);
        setData(parsedRoleData);
        const savedName = parsedRoleData.name || "";
        setName(savedName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      fetchUsers(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async (id: number) => {
    setLoading(true);
    try {
      const response = await RolesApi.getUsers(id);
      if (response && response.data && response.data.users) {
        const sortedUsers = response.data.users.sort(
          (a: RowData, b: RowData) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        );

        setRows(sortedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    if (data) {
      const updatedData: RoleData = { ...data, name };
      setData(updatedData);
      setUpdatedData(updatedData);
      try {
        const res = await editRole(data.id, updatedData);
        if (res && res.statusCode === 200) {
          setName(name);
          localStorage.setItem("roleName", name);
        }
      } catch (error) {
        console.error("Error updating role:", error);
        setName(name);
      }
    }
  };

  const editRole = async (id: any, updatedData: any) => {
    try {
      const response = await RolesApi.updateRoleApi(id, updatedData);
      if (response && response.statusCode === 200) {
        const sortedUsers = response.data.users.sort((a: any, b: any) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setRows(sortedUsers);
        return response;
      }
    } catch (error: any) {
      var response = error.response.data;
      if (response.statusCode == 409) {
        setSaveAlert({
          severity: "error",
          message: response.message,
        });
        setIsEditing(true);
        setIs409Error(true);
      }

      throw error;
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (data) {
      setName(data.name);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const filteredValue = inputValue
      .toUpperCase()
      .split("")
      .filter((char) => /^[A-Z ]$/.test(char))
      .join("");
    setName(filteredValue);
    const role = localStorage.getItem("role-data");
    if (role) {
      const parsedRoleData = JSON.parse(role);
      parsedRoleData.name = filteredValue;
      const data = JSON.stringify(parsedRoleData);
      localStorage.setItem("role-data", data);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackButtonClick = () => {
    localStorage.clear();
    window.location.href = "/roles";
  };

  if (!roleData) {
    return null;
  }

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
      {loading && (
        <div style={{ textAlign: "center", marginTop: "5%" }}>
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <>
          <Box sx={{ p: 2, margin: "auto" }}>
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
            {deleteAlert && (
              <Alert
                severity={deleteAlert.severity}
                onClose={() => {
                  setDeleteAlert(null);
                }}
              >
                {deleteAlert.message}
              </Alert>
            )}
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
            <Snackbar autoHideDuration={12000} />
            <Box
              component="fieldset"
              sx={{
                border: "1px solid #ededed",
                borderRadius: "5px",
                margin: { xs: "10px 0", sm: "5% 0 3% 0" },
                overflowX: "auto",
                paddingRight: "90px",
                paddingLeft: "20px",
                width: "100%",
                minWidth: "0",
              }}
            >
              <legend> Role</legend>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{ fontSize: 30, border: "none", marginLeft: "30" }}
                    >
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
                      {!(
                        name == "ADMIN" ||
                        name == "MANAGER" ||
                        name == "STAFF"
                      ) && (
                        <IconButton
                          onClick={
                            isEditing ? handleSaveClick : handleEditClick
                          }
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
                              sx={{
                                color: "white",
                                width: "0.75em",
                                height: "0.75em",
                              }}
                            />
                          ) : (
                            <EditNoteIcon
                              sx={{
                                color: "white",
                                width: "0.75em",
                                height: "0.75em",
                              }}
                            />
                          )}
                        </IconButton>
                      )}

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
                            marginLeft: "10px",
                          }}
                        >
                          <CloseIcon
                            sx={{
                              color: "white",
                              width: "0.75em",
                              height: "0.75em",
                            }}
                          />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Card
              sx={{
                p: 2,
                margin: "auto",
                width: "100%",
                boxSizing: "border-box",
                overflowX: "auto",
                marginTop: "20px",
              }}
            >
              {" "}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="basic tabs example"
                sx={{ marginLeft: 2 }}
              >
                <Tab label="Users" {...TabProps(0)} />
              </Tabs>
              <CustomTabPanel
                value={tabValue}
                index={0}
                sx={{ width: "100%", height: "100%" }}
              >
                <TableContainer
                  sx={{
                    marginBottom: "11px ! important",
                    margin: "auto",
                    maxWidth: "98%",
                    "@media (width: 1024px) and (height: 1366px)": {
                      ".MuiDataGrid-virtualScroller": {
                        maxWidth: "98%",
                      },
                    },
                  }}
                >
                  {" "}
                  <UserList
                    roleId={id}
                    title={false}
                    id={id}
                    isView={true}
                    isListPage={false}
                    showRole={false}
                    roleView={true}
                    roleName={roleName}
                    applicationId={undefined}
                    groupId={undefined}
                    groupView={false}
                    showGroup={true}
                    groupName={undefined}
                    isGroup={false}
                  />
                </TableContainer>
              </CustomTabPanel>
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
        </>
      )}
    </Container>
  );
};

export default RoleView;
