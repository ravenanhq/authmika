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
import DeleteIcon from "@mui/icons-material/Delete";
import AddApplicationModal from "./AddApplicationModal";
import DeleteApplicationModal from "./DeleteApplicationModal";
import { Visibility } from "@mui/icons-material";
import { getSession } from "next-auth/react";
import { config } from "../../../config";

export interface RowData {
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

interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

interface ApplicationListProps {
  title: boolean;
  get: string;
  userId: number | undefined;
  isAdd:string | boolean,
}

const ApplicationList: React.FC<ApplicationListProps> = ({
  title,
  get,
  userId,
  isAdd
}) => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RowData[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [message, setMessage] = useState("");
  const [isAddApplicationModalOpen, setAddApplicationModalOpen] =
    useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [alertShow, setAlertShow] = useState("");
  const [uniqueAlert, setUniqueAlert] = useState("");
  const [deleteAlert, setDeleteAlert] = useState<AlertState | null>(null);
  const filteredRows = rows.filter((row) => row.id);
  const GET_FILTER = 'filter';

  useEffect(() => {
    restrictMenuAccess();
    getApplications(get, userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userId !== undefined) {
      getApplications(GET_FILTER, userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
    {
      field: "logoPath",
      headerName: "Logo",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <CardMedia
          component="img"
          alt="logo"
          height="auto"
          image={`${config.service}/assets/images/${
            params.value ? params.value : "no_image.jpg"
          }`}
          sx={{
            width: "20%",
            padding: "10px",
            "@media (max-width: 1200px)": {
              padding: "0px",
              width: "40%",
            },
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "application",
      headerName: "Application",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "baseUrl",
      headerName: "Base URL",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "created_at",
      headerName: "Created At",
      headerClassName: "user-header",
      type: "date",
      flex: 0.5,
      minWidth: 100,
      valueGetter: (params) => {
        return new Date(params.row.created_at);
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "application-header",
      flex: 1,
      minWidth: 100,
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

  const handleAddApplication = async (newApplication: RowData, isAdd:string | boolean,userId: number | undefined): Promise<void> => {
    try {
      const response = await ApplicationApi.addApplication(newApplication,isAdd,userId);
      setUniqueAlert("");
      if (response) {
        if (response.statusCode == 409) {
          setUniqueAlert(response.message);
        } else if (response.statusCode == 200) {
          setRows(response.data);
          const sortedApplications = [...response.data].sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });
          handleCloseAddApplicationModal();
          setRows(sortedApplications);
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
        const currentRows = [...rows];
        const itemIndex = currentRows.findIndex(
          (item) => item.id === selectedRow.id
        );
        if (itemIndex !== -1) {
          const response = await ApplicationApi.deleteApplication(
            selectedRow.id
          );
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
        setDeleteModalOpen(false);
      } catch (error: any) {
        console.error(error);
        setDeleteAlert({
          severity: "error",
          message: "An error occurred while deleting.",
        });
      }
      setDeleteModalOpen(false);
    }
  };

  const getApplications = async (
    get: string,
    userId: number | undefined,
  ) => {
    try {
      const response = await ApplicationApi.getApplications(
        get,
        userId
      );
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
      marginTop: title ? "5%" : "0",
      "& .application-header": {
        backgroundColor: "#265073",
        color: "#fff",
      },
      "@media (max-width: 1024px) and (max-height: 1366px)": {
        ".MuiDataGrid-virtualScroller": {
          overflowY: "hidden",
        },
      },
      "@media (max-width: 1366px) and (max-height: 1024px)": {
        ".MuiDataGrid-virtualScroller": {
          overflowY: "hidden",
        },
      },
      gridWidth: "100%",
    }}
  >
      <Snackbar autoHideDuration={3000} message={message} />
      <CardContent style={{ padding: "0" }}>
        {title && (
          <>
            <Typography variant="h4">Applications</Typography>
            <Divider
              color="#265073"
              sx={{ marginTop: "5px", marginBottom: "3%" }}
            ></Divider>
          </>
        )}
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

      <AddApplicationModal
        open={isAddApplicationModalOpen}
        onClose={handleCloseAddApplicationModal}
        onAddApplication={handleAddApplication}
        uniqueValidation={uniqueAlert}
        isAdd={isAdd}
        userId={userId}
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
