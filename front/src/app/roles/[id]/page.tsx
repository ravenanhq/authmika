"use client";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { RolesApi } from "@/services/api/RolesApi";
import AddIcon from "@mui/icons-material/Add";
import AddUserModal from "@/components/Roles/AddUserModal";
import { UserServiceApi } from "@/services/api/UserServiceApi";
import { Visibility } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserApi } from "@/services/api/UserApi";
import DeleteUserModal from "@/components/Roles/DeleteUserModal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
const RoleView = ({ params }: { params: IRoleView }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<RoleData | null>(null);
  const [name, setName] = useState<string>("");
  const [rows, setRows] = useState<RowData[]>([]);
  const [id, setId] = useState<number | undefined>(params.id);
  const [roleData, setRoleData] = useState<RoleData | null>(null);
  const [invalidEmail, setInvalidEmail] = useState("");
  const [alertShow, setAlertShow] = useState("");
  const [saveAlert, setSaveAlert] = useState<AlertState | null>(null);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<AlertState | null>(null);
  const [updatedData, setUpdatedData] = useState(data); // Store updated role data

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
        await editGroup(data.id, updatedData);
        localStorage.setItem("roleName", name);
      } catch (error) {
        console.error("Error updating role:", error);
      }
    }
  };

  const editGroup = async (id: any, updatedData: any) => {
    try {
      const response = await RolesApi.updateRoleApi(id, updatedData);
      if (response && response.statusCode === 200) {
        const sortedUsers = response.data.users.sort((a: any, b: any) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setRows(sortedUsers);
      }
    } catch (error: any) {
      var response = error.response.data;
      if (response.statusCode == 409) {
        setSaveAlert({
          severity: "error",
          message: response.message,
        });
        setIsEditing(true);
      }

      console.error(error);
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
  const handleAddUserClick = () => {
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setAddUserModalOpen(false);
  };

  const handleAddUser = async (newUser: RowData) => {
    const roleName = updatedData?.name || data?.name || name;
    const newUserData = { ...newUser, role: roleName };
    setLoading(true);
    try {
      const response = await UserServiceApi.create(newUserData);
      setInvalidEmail("");
      if (response) {
        if (response.statusCode === 201) {
          setRows(response.data);
          const newUserId = Math.floor(Math.random() * 1000);
          const newUserDataWithId = {
            ...newUserData,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            status: 2,
            id: newUserId,
          };
          const currentUsers = [...rows];
          currentUsers.unshift(newUserDataWithId);
          const sortedUsers = currentUsers.sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });
          setRows(sortedUsers);
          handleCloseAddUserModal();
          setAlertShow(response.message);
        }
      }
    } catch (error: any) {
      const response = error.response.data;
      if (response.statusCode === 422 && response.message.email) {
        setInvalidEmail(response.message.email);
      } else if (response.statusCode === 409) {
        setInvalidEmail(response.message);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleView = (rowData: RowData) => {
    const data = JSON.stringify(rowData);
    localStorage.setItem("user-data", data);
    const url = `/users/${rowData.id}`;
    window.location.href = url;
  };

  const handleDelete = (rowData: RowData | null) => {
    setDeleteModalOpen(true);
    setSelectedRow((prevRowData) => {
      if (rowData !== null) {
        return rowData;
      }
      return prevRowData;
    });
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const handleDeleteConfirm = async (selectedRow: any) => {
    if (selectedRow !== null) {
      try {
        const currentRows = [...rows];
        const userIndex = currentRows.findIndex(
          (user) => user.id === selectedRow.id
        );

        if (userIndex !== -1) {
          const response = await UserApi.deleteUser(selectedRow.id);

          if (response && response.statusCode == 422) {
            setDeleteAlert({
              severity: "error",
              message: response.message,
            });
          } else if (response && response.statusCode == 200) {
            currentRows.splice(userIndex, 1);
            setRows(currentRows);
            setDeleteAlert({ severity: "success", message: response.message });
          }
        }
        setDeleteModalOpen(false);
      } catch (error: any) {
        console.error(error);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First name",
      headerClassName: "role-header",
      flex: 0.5,
      minWidth: 140,
    },
    {
      field: "lastName",
      headerName: "Last name",
      headerClassName: "role-header",
      flex: 0.5,
      minWidth: 160,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "role-header",
      flex: 0.5,
      minWidth: 180,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      headerClassName: "role-header",
      flex: 0.5,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "role-header",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => <>{userStatus[params.value]}</>,
    },
    {
      field: "created_at",
      headerName: "Created At",
      type: "date",
      flex: 0.5,
      minWidth: 160,
      valueGetter: (params) => {
        return new Date(params.row.created_at);
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "role-header",
      flex: 0.5,
      minWidth: 140,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton aria-label="view" onClick={() => handleView(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleBackButtonClick = () => {
    localStorage.clear();
    window.location.href = "/roles";
  };

  if (!roleData) {
    return null;
  }

  const StyledDataGrid = styled(DataGrid)((theme) => ({
    "& .MuiDataGrid-sortIcon": {
      opacity: 1,
      color: "white",
    },
    "& .MuiDataGrid-menuIconButton": {
      opacity: 1,
      color: "white",
    },
    "& .MuiDataGrid-filterIcon": {
      opacity: 1,
      color: "white",
    },
  }));

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
    marginTop: "5%",
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
      <Card
        sx={{
          boxShadow: "none",
          marginTop: "5%",
          "& .role-header": {
            backgroundColor: "#265073",
            color: "#fff",
          },
          gridWidth: "500px",
        }}
      >
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
        <CardContent style={{ padding: "0" }}>
          <Box>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{ fontSize: 30, border: "none", padding: "0" }}
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
          {loading && (
            <div style={{ textAlign: "center", marginTop: "5%" }}>
              <CircularProgress />
            </div>
          )}
          {!loading && (
            <>
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                style={{ marginBottom: "5px" }}
              >
                <Grid item>
                  <PrimaryButton
                    startIcon={<AddIcon />}
                    onClick={handleAddUserClick}
                  >
                    Add New User
                  </PrimaryButton>
                </Grid>
              </Grid>
              <StyledDataGrid
                rows={rows}
                columns={columns.filter(
                  (column) => column.field !== "created_at"
                )}
                getRowId={(row) => row.id}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                slots={{
                  noResultsOverlay: () => {
                    return (
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{ marginTop: 10, justifyContent: "center" }}
                      >
                        No results found.
                      </Typography>
                    );
                  },
                }}
                pageSizeOptions={[5, 10, 15, 20]}
                style={{
                  backgroundColor: "white",
                  marginTop: "2%",
                  width: "100%",
                }}
              />

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
            </>
          )}
          <DeleteUserModal
            open={deleteModalOpen}
            onClose={handleDeleteModalClose}
            onDeleteConfirm={() => handleDeleteConfirm(selectedRow)}
            rowData={selectedRow}
          />

          <AddUserModal
            open={isAddUserModalOpen}
            onClose={handleCloseAddUserModal}
            onAddUser={handleAddUser}
            uniqueEmail={invalidEmail}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default RoleView;
