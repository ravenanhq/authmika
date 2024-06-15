import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { SetStateAction, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { RolesApi } from "@/services/api/RolesApi";
import AddRolesModal from "./AddRolesModal";
import DeleteRolesModal from "./DeleteRolesModal";
import EditRolesModal from "./EditRolesModal";
import EditIcon from "@mui/icons-material/Edit";

export interface RowData {
  id?: number;
  name?: string;
  created_at: string | number | Date;
}

interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const RoleListPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState<RowData[]>([]);
  const [isAddRoleModalOpen, setAddRoleModalOpen] = useState(false);
  const [uniqueAlert, setUniqueAlert] = useState("");
  const [alertShow, setAlertShow] = useState("");
  const [deleteAlert, setDeleteAlert] = useState<AlertState | null>(null);
  const [deleteRoleModalOpen, setDeleteRoleModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    getRoleList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddRoleClick = () => {
    setAddRoleModalOpen(true);
  };

  const handleCloseAddRoleModal = () => {
    setAddRoleModalOpen(false);
  };

  const handleAddRole = (data: RowData) => {
    addRole(data);
  };
  const handleDelete = (rowData: SetStateAction<null>) => {
    setSelectedRow(rowData);
    setDeleteRoleModalOpen(true);
  };

  const handleDeleteRoleModalClose = () => {
    setDeleteRoleModalOpen(false);
    setSelectedRow(null);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedRow(null);
    setUniqueAlert("");
  };

  const handleEdit = (rowData: SetStateAction<null>) => {
    setSelectedRow(rowData);
    setEditModalOpen(true);
  };

  const handleEditSave = (editedData: RowData) => {
    editRole(editedData.id, editedData);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      headerClassName: "role-header",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "created_at",
      headerName: "Created At",
      headerClassName: "role-header",
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
      flex: 1,
      minWidth: 120,
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

  const addRole = async (newRole: RowData) => {
    try {
      const response = await RolesApi.addRoleApi(newRole);
      setUniqueAlert("");
      if (response) {
        if (response.statusCode == 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode == 201) {
          setRows(response.data);
          const sortedRoles = [...response.data].sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });

          handleCloseAddRoleModal();
          setRows(sortedRoles);
          setAlertShow(response.message);
        }
      }
    } catch (error: any) {
      var response = error.response.data;
      if (response.statusCode == 422 && response.message.name) {
        setUniqueAlert(response.message.name);
      }
      console.log(error);
    }
  };

  const getRoleList = async () => {
    try {
      const response = await RolesApi.getAllRoleApi();
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

  const handleDeleteRole = async (selectedRow: any) => {
    if (selectedRow !== null) {
      try {
        const currentRows = [...rows];
        const itemIndex = currentRows.findIndex(
          (item) => item.id === selectedRow.id
        );
        if (itemIndex !== -1) {
          const response = await RolesApi.deleteRoleApi(selectedRow.id);
          if (response && response.statusCode == 422) {
            setDeleteAlert({
              severity: "error",
              message: response.message,
            });
          } else if (response && response.statusCode == 200) {
            currentRows.splice(itemIndex, 1);
            setRows(currentRows);
            setDeleteAlert({
              severity: "success",
              message: response.message,
            });
          }
        }
        setDeleteRoleModalOpen(false);
      } catch (error: any) {
        console.error(error);
      }
    }
  };

  const editRole = async (id: any, updatedData: any) => {
    try {
      const response = await RolesApi.updateRoleApi(id, updatedData);
      setUniqueAlert("");
      if (response) {
        if (response.statusCode === 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode === 200) {
          const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, ...updatedData } : row
          );
          setRows(updatedRows);
          handleEditModalClose();
          setAlertShow(response.message);
        }
      }
    } catch (error: any) {
      console.error(error);
      var response = error.response.data;
      if (response.statusCode === 422 && response.message.application) {
        setUniqueAlert(response.message.application);
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
    marginTop: "5%",
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
        "& .role-header": {
          backgroundColor: "#265073",
          color: "#fff",
        },
        gridWidth: "300px",
        "@media (max-width: 1366px) and (max-height: 768px)": {
          ".MuiDataGrid-virtualScroller": {
            overflowY: "hidden",
          }
        },
      }}
    >
      <Snackbar autoHideDuration={3000} message={message} />
      <CardContent style={{ padding: "0" }}>
        <Typography variant="h4">Roles</Typography>
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
                  onClick={handleAddRoleClick}
                >
                  Add New Roles
                </PrimaryButton>
              </Grid>
            </Grid>
            <StyledDataGrid
              rows={rows}
              columns={columns.filter(
                (column) => column.field !== "created_at"
              )}
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
                      sx={{
                        marginTop: 10,
                        justifyContent: "center",
                      }}
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

      <AddRolesModal
        open={isAddRoleModalOpen}
        onClose={handleCloseAddRoleModal}
        onAddRole={handleAddRole}
        uniqueNameValidation={uniqueAlert}
      />

      <EditRolesModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        rowData={selectedRow}
        onEdit={handleEditSave}
        uniqueValidation={uniqueAlert}
      />

      <DeleteRolesModal
        open={deleteRoleModalOpen}
        onClose={handleDeleteRoleModalClose}
        onDeleteConfirm={() => handleDeleteRole(selectedRow)}
        rowData={selectedRow}
      />
    </Card>
  );
};
export default RoleListPage;
