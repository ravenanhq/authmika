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
  Stack,
  Alert,
  CardMedia,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SetStateAction, useEffect, useState } from "react";
import { ApplicationApi } from "@/services/api/ApplicationApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddApplicationModal from "./AddApplicationModal";
import EditApplicationModal from "./EditApplicationModal";
import DeleteApplicationModal from "./DeleteApplicationModal";
import { Visibility } from "@mui/icons-material";
import { getSession } from "next-auth/react";

export interface RowData {
  id: number;
  name?: string;
  application?: string;
  baseUrl?: string;
  base_url?: string;
  file?: string;
  logoPath: string;
  logo_path: string;
}

interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const ApplicationList = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState("");
  const [isAddApplicationModalOpen, setAddApplicationModalOpen] =
    useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [alertShow, setAlertShow] = useState("");
  const [uniqueAlert, setUniqueAlert] = useState("");
  const [deleteAlert, setDeleteAlert] = useState<AlertState | null>(null);
  const [userRole, setUserRole] = useState<string>();

  useEffect(() => {
    restrictMenuAccess();
    getApplications();
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
        setUserRole(session.user.role);
        let role = session.user.role;
        if (role.toLowerCase() === "client") {
          const restrictedPage = "/applications";
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

  const handleEdit = (rowData: SetStateAction<null>) => {
    setSelectedRow(rowData);
    setEditModalOpen(true);
  };

  const handleAddApplication = (newApplication: RowData) => {
    addApplication(newApplication);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedRow(null);
  };

  const handleEditSave = (editedData: RowData) => {
    editedData["logo_path"] = editedData["logoPath"];
    editedData["base_url"] = editedData["baseUrl"];
    editApplication(editedData.id, editedData);
  };

  const handleDelete = (rowData: SetStateAction<null>) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const handleAddApplicationClick = () => {
    setAddApplicationModalOpen(true);
  };

  const handleCloseAddApplicationModal = () => {
    setAddApplicationModalOpen(false);
  };

  const handleView = (rowData: RowData) => {
    const data = JSON.stringify(rowData);
    localStorage.setItem("application-data", data);
    const url = `/applications/${rowData.id}`;
    window.location.href = url;
  };

  const columns: GridColDef[] = [
    // {
    //   field: "logoPath",
    //   headerName: "Logo",
    //   headerClassName: "application-header",
    //   flex: 1,
    //   minWidth: 100,
    //   disableColumnMenu: true,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <CardMedia
    //       component="img"
    //       alt="Image"
    //       height="auto"
    //       image={
    //         "/assets/images/" + (params.value ? params.value : "no_image.jpg")
    //       }
    //       style={{ width: "20%", padding: "10px" }}
    //     />
    //   ),
    // },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "application",
      headerName: "Application",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "baseUrl",
      headerName: "Base URL",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 150,
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

  const addApplication = async (newApplication: RowData) => {
    try {
      const response = await ApplicationApi.addApplication(newApplication);
      setUniqueAlert("");
      if (response) {
        if (response.statusCode == 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode == 200) {
          handleCloseAddApplicationModal();
          setRows(response.data);
          setAlertShow(response.message);
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

  const editApplication = async (applicationId: any, updatedData: any) => {
    try {
      const response = await ApplicationApi.updateApplication(
        applicationId,
        updatedData
      );
      setUniqueAlert("");
      if (response) {
        if (response.statusCode == 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode == 200) {
          handleEditModalClose();
          setRows(response.data);
          setAlertShow(response.message);
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

  const handleDeleteConfirm = async (selectedRow: any) => {
    if (selectedRow !== null) {
      try {
        const response = await ApplicationApi.deleteApplication(selectedRow.id);

        if (response && response.data) {
          setRows(response.data);
          setDeleteAlert({ severity: "error", message: response.message });
        }
        setDeleteModalOpen(false);
      } catch (error: any) {
        console.error(error);
        setDeleteAlert({
          severity: "error",
          message: "An error occurred while deleting.",
        });
      }
    }
  };

  const getApplications = async () => {
    try {
      const response = await ApplicationApi.getApplications();
      if (response) {
        setLoading(false);
        setRows(response);
      }
    } catch (error: any) {
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
        "& .application-header": {
          backgroundColor: "#265073",
          color: "#fff",
        },
        gridWidth: "500px",
      }}
    >
      <Snackbar autoHideDuration={3000} message={message} />
      <CardContent style={{ padding: "0" }}>
        <Typography variant="h4">Applications</Typography>
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
                  onClick={handleAddApplicationClick}
                >
                  Add New Application
                </PrimaryButton>
              </Grid>
            </Grid>
            <StyledDataGrid
              rows={rows}
              columns={columns}
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

      <EditApplicationModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        rowData={selectedRow}
        onEdit={handleEditSave}
        uniqueValidation={uniqueAlert}
      />

      <AddApplicationModal
        open={isAddApplicationModalOpen}
        onClose={handleCloseAddApplicationModal}
        onAddApplication={handleAddApplication}
        uniqueValidation={uniqueAlert}
      />

      <DeleteApplicationModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onDeleteConfirm={() => handleDeleteConfirm(selectedRow)}
        rowData={selectedRow}
      />
    </Card>
  );
};

export default ApplicationList;
