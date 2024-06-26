"use client";
import {
  Card,
  CardContent,
  Button,
  Snackbar,
  Grid,
  IconButton,
  Typography,
  Divider,
  styled,
  CircularProgress,
  Alert,
  Stack,
  Container,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteUserModal";
import AddUserModal from "./AddUserModal";
import { UserApi } from "@/services/api/UserApi";
import { UserServiceApi } from "@/services/api/UserServiceApi";
import { Visibility } from "@mui/icons-material";
import { getSession } from "next-auth/react";

export interface RowData {
  created_at: string | number | Date;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: number;
  mobile: string;
  id: number;
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

const UserList = () => {
  const [alertShow, setAlertShow] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RowData[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState("");
  const [deleteAlert, setDeleteAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    restrictMenuAccess();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restrictMenuAccess = async () => {
    const session = await getSession();
    try {
      if (
        session &&
        session.hasOwnProperty("user") &&
        session.user.hasOwnProperty("role")
      ) {
        let role = session.user.role;
        if (role.toLowerCase() === "client") {
          const restrictedPage = "/users";
          if (restrictedPage == window.location.pathname) {
            window.location.href = "/dashboard";
            return;
          }
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleView = (rowData: RowData) => {
    const data = JSON.stringify(rowData);
    localStorage.setItem("user-data", data);
    const url = `/users/${rowData.id}`;
    window.location.href = url;
  };

  const handleAddUser = (newUser: RowData) => {
    addUser(newUser);
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

  const handleAddUserClick = () => {
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setAddUserModalOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First name",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 140,
    },
    {
      field: "lastName",
      headerName: "Last name",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 160,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 180,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 120,
    },
    {
      field: "role",
      headerName: "Role",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "user-header",
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
      headerClassName: "user-header",
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

  const getUsers = async () => {
    try {
      const response = await UserApi.getUsers();
      if (response) {
        const sortedRows = response.sort((a: RowData, b: RowData) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        setRows(sortedRows);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
  };

  const addUser = async (newUser: RowData) => {
    try {
      const response = await UserServiceApi.create(newUser);
      setInvalidEmail("");
      if (response) {
        if (response.statusCode == 409) {
          setInvalidEmail(response.message);
        } else if (response.statusCode == 201) {
          setRows(response.data);
          const newUserId = Math.floor(Math.random() * 1000);
          const newUserData = {
            ...newUser,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            status: 2,
            id: newUserId,
          };
          const currentUsers = [...rows];
          currentUsers.unshift(newUserData);
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
      var response = error.response.data;
      if (response.statusCode == 422 && response.message.email) {
        setInvalidEmail(response.message.email);
      }
      console.log(error);
    }
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

  return (
    <Container maxWidth="xl">
      <Card
        sx={{
          boxShadow: "none",
          marginTop: "5vh",
          "& .user-header": {
            backgroundColor: "#265073",
            color: "#fff",
          },
          gridWidth: "500px",
        }}
      >
        <Snackbar autoHideDuration={12000} />
        <CardContent style={{ padding: "0" }}>
          <Typography variant="h4">Users</Typography>
          <Divider
            color="#265073"
            sx={{ marginTop: "5px", marginBottom: "3%" }}
          ></Divider>
          {loading && (
            <div style={{ textAlign: "center", marginTop: "5%" }}>
              <CircularProgress />
            </div>
          )}
          {!loading && (
            <>
              <Stack sx={{ width: "100%", paddingBottom: "20px" }} spacing={4}>
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
              </Stack>
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
            </>
          )}
        </CardContent>

        <DeleteModal
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
      </Card>
    </Container>
  );
};

export default UserList;
