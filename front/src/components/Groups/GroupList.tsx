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
import { Visibility } from "@mui/icons-material";
import { SetStateAction, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import AddGroupModal from "./AddGroupModal";
import React from "react";
import { GroupsApi } from "@/services/api/GroupsApi";
import DeleteGroupModal from "./DeleteGroupModal";
import EditGroupModal from "./EditGroupModal";
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

const GroupListPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState<RowData[]>([]);
  const [isAddGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [uniqueAlert, setUniqueAlert] = useState("");
  const [alertShow, setAlertShow] = useState("");
  const filteredRows = rows.filter((row) => row.id);
  const [deleteAlert, setDeleteAlert] = useState<AlertState | null>(null);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    getGroupsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddGroupClick = () => {
    setAddGroupModalOpen(true);
  };

  const handleCloseAddGroupModal = () => {
    setAddGroupModalOpen(false);
  };

  const handleAddGroup = (newGroup: RowData) => {
    addGroup(newGroup);
  };
  const handleDelete = (rowData: SetStateAction<null>) => {
    setSelectedRow(rowData);
    setDeleteGroupModalOpen(true);
  };

  const handleDeleteGroupModalClose = () => {
    setDeleteGroupModalOpen(false);
    setSelectedRow(null);
  };

  const handleView = (rowData: RowData) => {
    const data = JSON.stringify(rowData);
    localStorage.setItem("group-data", data);
    const url = `/groups/${rowData.id}`;
    window.location.href = url;
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      headerClassName: "group-header",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "created_at",
      headerName: "Created At",
      headerClassName: "group-header",
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
      headerClassName: "group-header",
      flex: 1,
      minWidth: 120,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <>
         <IconButton aria-label="view" onClick={() => handleView(params.row)}>
            <Visibility />
          </IconButton>
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

  const addGroup = async (newGroup: RowData) => {
    try {
      const response = await GroupsApi.addGroupApi(newGroup);
      setUniqueAlert("");
      if (response) {
        if (response.statusCode == 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode == 200) {
          setRows(response.data.groups);
          const sortedGroups = [...response.data.groups].sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });
          handleCloseAddGroupModal();
          setRows(sortedGroups);
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

  const getGroupsList = async () => {
    try {
      const response = await GroupsApi.getAllGroupsApi();
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
      console.log(error);
    }
  };

  const handleDeleteGroup = async (selectedRow: any) => {
    if (selectedRow !== null) {
      try {
        const currentRows = [...rows];
        const itemIndex = currentRows.findIndex(
          (item) => item.id === selectedRow.id
        );
        if (itemIndex !== -1) {
          const response = await GroupsApi.deleteGroupApi(selectedRow.id);
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
        setDeleteGroupModalOpen(false);
      } catch (error: any) {
        console.error(error);
        setDeleteAlert({
          severity: "error",
          message: "An error occurred while deleting.",
        });
      }
    }
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
    editGroup(editedData.id, editedData);
  };

  const editGroup = async (id: any, updatedData: any) => {
    try {
      const response = await GroupsApi.updateGroupApi(id, updatedData);
      setUniqueAlert("");
      if (response) {
        if (response.statusCode === 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode === 200) {
          const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, ...updatedData } : row
          );
          handleEditModalClose();
          setRows(updatedRows);
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
        "& .group-header": {
          backgroundColor: "#265073",
          color: "#fff",
        },
        gridWidth: "200px",
      }}
    >
      <Snackbar autoHideDuration={3000} message={message} />
      <CardContent style={{ padding: "0" }}>
        <Typography variant="h4">Groups</Typography>
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
                  onClick={handleAddGroupClick}
                >
                  Add New Group
                </PrimaryButton>
              </Grid>
            </Grid>
            <StyledDataGrid
              rows={filteredRows}
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
      <AddGroupModal
        open={isAddGroupModalOpen}
        onClose={handleCloseAddGroupModal}
        onAddGroup={handleAddGroup}
        uniqueNameValidation={uniqueAlert}
      />

      <EditGroupModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        rowData={selectedRow}
        onEdit={handleEditSave}
        uniqueValidation={uniqueAlert}
      />

      <DeleteGroupModal
        open={deleteGroupModalOpen}
        onClose={handleDeleteGroupModalClose}
        onDeleteConfirm={() => handleDeleteGroup(selectedRow)}
        rowData={selectedRow}
       />
    </Card>
  );
};
export default GroupListPage;
