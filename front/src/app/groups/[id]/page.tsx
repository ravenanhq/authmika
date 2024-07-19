"use client";
import Application from "@/app/applications/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  TextField,
  Theme,
  styled,
  Tab,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { GroupsApi } from "@/services/api/GroupsApi";
import PropTypes from "prop-types";
import UserList from "@/components/User/UserList";
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

const GroupView = ({ params }: { params: IGroupView }) => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [id, setId] = useState<number | undefined>(params.id);
  const [saveAlert, setSaveAlert] = useState<AlertState | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<GroupData | null>(null);
  const [name, setName] = useState<string>("");
  const [rows, setRows] = useState<RowData[]>([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [is409Error, setIs409Error] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const group = localStorage.getItem("group-data");
      if (group) {
        setGroupData(JSON.parse(group));
      }
    }
  }, []);

  useEffect(() => {
    if (is409Error) {
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
      const data = JSON.stringify(groupData);
      localStorage.setItem("group-data", data);
      setData(groupData);

      setIs409Error(false);
    }
  }, [is409Error, groupData]);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = e.target.value;
    setName(filteredValue);
    const group = localStorage.getItem("group-data");
    if (group) {
      const parsedGroupData = JSON.parse(group);
      parsedGroupData.name = filteredValue;
      const data = JSON.stringify(parsedGroupData);
      localStorage.setItem("group-data", data);
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
        const res = await editGroup(id, updatedData);
        if (res && res.statusCode === 200) {
          setName(name);
          localStorage.setItem("roleName", name);
        }
      } catch (error) {
        console.error("Error updating group:", error);
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const editGroup = async (id: any, updatedData: any) => {
    try {
      const response = await GroupsApi.updateGroupApi(id, updatedData);
      if (response && response.statusCode === 200) {
        setRows(response);
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

  if (!groupData) {
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
      <Box sx={{ marginTop:"auto",p:2 }}>
        {saveAlert && (
          <Alert
            severity={saveAlert.severity}
            onClose={() => {
              setSaveAlert(null);
            }}
            sx={{
              width: "100%",
            }}
          >
            {saveAlert.message}
          </Alert>
        )}
        <Box
          component="fieldset"
          sx={{
            border: "1px solid #ededed",
            borderRadius: "5px",
            margin: "5% 0px 3% 0px",
            overflowX: "auto",
            paddingRight: "90px",
            paddingLeft: "20px",
            width: "100%",
          }}
        >
          <legend> Group</legend>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontSize: 30, border: "none",marginLeft:"30" }}>
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
      <Card sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          sx={{ marginLeft: 3 }}
        >
          <Tab label="Users" {...TabProps(0)} />
        </Tabs>
        <CustomTabPanel
          value={tabValue}
          index={0}
          sx={{ width: "100%", height: "100%" }}
        >
          <TableContainer>
            <UserList
              roleId={undefined}
              title={false}
              id={id}
              isView={false}
              isListPage={false}
              showRole={true}
              roleView={false}
              groupView={true}
              roleName={undefined}
              applicationId={undefined}
              groupId={id}
              showGroup={false}
              groupName={name}
              isGroup={true}
            />
          </TableContainer>
        </CustomTabPanel>
      </Card>
      <Box display="flex" justifyContent="flex-end">
        <BackButton
          variant="contained"
          onClick={handleBackButtonClick}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </BackButton>
      </Box>
      </Box>
    </Container>
  );
};

export default GroupView;
