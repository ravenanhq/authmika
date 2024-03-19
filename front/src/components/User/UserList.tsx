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
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteUserModal";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { UserApi } from "@/services/api/UserApi";

export interface RowData {
  id: number;
  userName?: string;
  user_name?: string;
  display_name?: string;
  displayName?: string;
  email?: string;
  mobile?: string;
  role?: string;
}

const UserList = () => {
  const [alertShow, setAlertShow] = useState('');
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RowData[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [uniqueAlert, setUniqueAlert] = useState("");

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps    
  }, []);
  
  
  const handleEdit = (rowData: RowData | null) => {
    setSelectedRow((prevRowData) => {
      if (rowData !== null) {
        return rowData;
      }

      return prevRowData;
    });

    setEditModalOpen(true);
  };

  const handleAddUser = (newUser: RowData) => {
    addUser(newUser);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedRow(null);
  };

  const handleEditSave = async (editedData: RowData) => {
    if ("id" in editedData) {
      editedData.user_name = editedData.userName;
      editedData.display_name = editedData.displayName;

      await editUser(editedData.id, editedData);
    }
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
      field: "userName",
      headerName: "Username",
      headerClassName: "user-header",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "displayName",
      headerName: "Display Name",
      headerClassName: "user-header",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "user-header",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      headerClassName: "user-header",
      flex: 1,
      minWidth: 200,
    },

    {
      field: "role",
      headerName: "Role",
      headerClassName: "user-header",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "user-header",
      flex: 1,
      minWidth: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
            <EditIcon />
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
        setRows(response);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const addUser = async (newUser: RowData) => {
    try {
      const response = await UserApi.create(newUser);
      setUniqueAlert("");
      if (response) {
        if (response.statusCode == 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode == 200) {
          setRows(response.data);
          setAlertShow(response.message);
          handleCloseAddUserModal();
        }
      }
    } catch (error: any) {
      var response = error.response.data;
      if (response.statusCode == 422 && response.message.application) {
        setUniqueAlert(response.message.application);
      }

      console.log(error);
    }
  };

  const editUser = async (id: any, updatedData: any) => {
    try {
      const response = await UserApi.update(id, updatedData);
      setUniqueAlert("");

      if (response) {
        if (response.statusCode == 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode == 200) {
          setRows(response.data);
          setAlertShow(response.message);
          handleEditModalClose();
        }
      }
    } catch (error: any) {
      var response = error.response.data;
      if (response.statusCode == 422 && response.message.application) {
        setUniqueAlert(response.message.application);
      }

      console.error(error);
    }
  };

  const handleDeleteConfirm = async (selectedRow: any) => {
    if (selectedRow !== null) {
      try {
        const response = await UserApi.deleteUser(selectedRow.id);

        if (response && response.data) {
          setRows(response.data);
          setAlertShow(response.message);
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
    <Card
      sx={{
        boxShadow: "none",
        marginTop: "5%",
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
          <Stack sx={{ width: "100%" }} spacing={2}>
              {alertShow && <Alert severity="success" onClose={() => { setAlertShow(""); }}>{alertShow}</Alert>}
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
                  style={{  marginTop: "13%" }}
                  onClick={handleAddUserClick}
                >
                  Add New User
                </PrimaryButton>
              </Grid>
            </Grid>
            <StyledDataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              slots={{
                noResultsOverlay: () => {
                  return (
                    <Typography variant="body1" align="center" sx={{ marginTop: 10, justifyContent: "center"}}>
                      No results found.
                    </Typography>
                  );
                }
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

      <EditUserModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        rowData={selectedRow}
        onEdit={handleEditSave}
        uniqueValidation={uniqueAlert}
      />

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
        uniqueValidation={uniqueAlert}
      />
    </Card>
    
  );
};

export default UserList;
