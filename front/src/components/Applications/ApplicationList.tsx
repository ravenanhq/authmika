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
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SetStateAction, useEffect, useState } from "react";
import { ApplicationApi } from "@/services/api/ApplicationApi";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddApplicationModal from "./AddApplicationModal";
import EditApplicationModal from "./EditApplicationModal";

export interface RowData {
  id: number;
  name?: string;
  application?: string;
  baseUrl?: string;
  base_url?: string;
}

const ApplicationList = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isAddApplicationModalOpen, setAddApplicationModalOpen] =
    useState(false);

  useEffect(() => {
    getApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (rowData: SetStateAction<null>) => {
    setSelectedRow(rowData);
    setEditModalOpen(true);
  };

  const handleAddApplication = (newApplication: RowData) => {
    addApplication(newApplication);
    setSuccessMessageOpen(true);
    setMessage("Application added successfully!");
    handleCloseAddApplicationModal();
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedRow(null);
  };

  const handleEditSave = (editedData: RowData) => {
    editedData["base_url"] = editedData["baseUrl"];
    delete editedData["baseUrl"];
    editApplication(editedData.id, editedData);
    handleEditModalClose();
    setSuccessMessageOpen(true);
    setMessage("Application updated successfully!");
  };

  const handleSnackbarClose = () => {
    setSuccessMessageOpen(false);
  };

  const handleAddApplicationClick = () => {
    setAddApplicationModalOpen(true);
  };

  const handleCloseAddApplicationModal = () => {
    setAddApplicationModalOpen(false);
  };

  const columns: GridColDef[] = [
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
      renderCell: (params) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
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
      if (response) {
        setRows(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const editApplication = async (applicationId: any, updatedData: any) => {
    try {
      const response = await ApplicationApi.updateApplication(
        applicationId,
        updatedData
      );

      if (response) {
        setRows(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const getApplications = async () => {
    try {
      const response = await ApplicationApi.getApplications();
      setRows(response);
      if (response) {
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error)
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
    color: "white"
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
        "gridWidth": "500px",
      }}
    >
      <Snackbar
        open={successMessageOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={message}
      />
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
        <><Grid
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
          </Grid><StyledDataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 15, 20]}
              style={{
                backgroundColor: "white",
                marginTop: "2%",
                width: "100%",
              }} /></>
        )}
      </CardContent>

      <EditApplicationModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        rowData={selectedRow}
        onEdit={handleEditSave}
      />

      <AddApplicationModal
        open={isAddApplicationModalOpen}
        onClose={handleCloseAddApplicationModal}
        onAddApplication={handleAddApplication}
      />
    </Card>
  );
};

export default ApplicationList;
