"use client";
import {
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  styled,
  useTheme,
  Typography,
  Box,
  Divider,
  Container,
  CardMedia,
  IconButton,
  Alert,
} from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { config } from "../../../../config";
import EditApplicationModal from "@/components/Applications/EditApplicationModal";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { ApplicationApi } from "@/services/api/ApplicationApi";

interface ApplicationData {
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
}

const ApplicationView = () => {
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const theme = useTheme();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uniqueAlert, setUniqueAlert] = useState("");
  const [alertShow, setAlertShow] = useState("");

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setUniqueAlert("");
  };

  const handleEditSave = (editedData: ApplicationData) => {
    editedData["logo_path"] = editedData["logoPath"];
    editedData["base_url"] = editedData["baseUrl"];
    editedData["call_back_url"] = editedData["callBackUrl"];
    editApplication(editedData.id, editedData);
  };

  const editApplication = async (applicationId: any, updatedData: any) => {
    try {
      const response = await ApplicationApi.updateApplication(
        applicationId,
        updatedData
      );
      setUniqueAlert("");
      if (response) {
        if (response.statusCode === 409) {
          setUniqueAlert(response.setAlertShowmessage);
        } else if (response.statusCode === 200) {
          setApplicationData(response.data);
          handleEditModalClose();
          response.message;
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

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const application = localStorage.getItem("application-data");
      if (application) {
        setApplicationData(JSON.parse(application));
      }
    }
  }, []);
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
    textAlign: "end",
    float: "right",
    marginBottom: "20px",
  }));

  const handleBackButtonClick = () => {
    localStorage.clear();
    window.location.href = "/applications";
  };

  if (!applicationData) {
    return null;
  }

  return (
    <Container maxWidth="xl">
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
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{ marginBottom: 1, marginTop: 2 }}
        >
          Application Details
        </Typography>
        <Divider sx={{ marginBottom: 1, flexGrow: 1 }} color="#265073" />
        <Card
          sx={{
            width: "60%",
            margin: "auto",
            mt: "50px",
            [theme.breakpoints.down("md")]: {
              width: "100%",
            },
            overflowX: "auto",
          }}
        >
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <EditApplicationModal
                      open={editModalOpen}
                      onClose={handleEditModalClose}
                      rowData={applicationData}
                      onEdit={handleEditSave}
                      uniqueValidation={uniqueAlert}
                    />
                    <IconButton aria-label="edit" onClick={() => handleEdit()}>
                      <EditNoteIcon style={{ fontSize: '30px' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Name:</strong>
                  </TableCell>
                  <TableCell>{applicationData.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Image:</strong>
                  </TableCell>
                  <TableCell>
                    {applicationData.logoPath !== undefined &&
                    applicationData.logoPath !== "" &&
                    applicationData.logoPath !== null ? (
                      <CardMedia
                        component="img"
                        src={`${config.service}/assets/images/${applicationData.logoPath}`}
                        alt="logo"
                        height="100"
                        style={{ width: "80px" }}
                      />
                    ) : (
                      <CardMedia
                        component="img"
                        src={`${config.service}/assets/images/no_image.jpg`}
                        alt="logo"
                        height="100"
                        style={{ width: "80px" }}
                      />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Application:</strong>
                  </TableCell>
                  <TableCell>{applicationData.application}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Base URL:</strong>
                  </TableCell>
                  <TableCell>{applicationData.baseUrl}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Call Back URL:</strong>
                  </TableCell>
                  <TableCell>{applicationData.callBackUrl}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Client Secret ID:</strong>
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "unset",
                      wordBreak: "break-all",
                    }}
                  >
                    {applicationData.clientSecretId}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Client Secret Key:</strong>
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "unset",
                      wordBreak: "break-all",
                    }}
                  >
                    {applicationData.clientSecretKey}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <BackButton
              variant="contained"
              onClick={handleBackButtonClick}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </BackButton>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ApplicationView;