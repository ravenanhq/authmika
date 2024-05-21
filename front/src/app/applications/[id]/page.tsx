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
} from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { config } from "../../../../config";
interface ApplicationData {
  name: string;
  logo_path: string;
  client: string;
  application: string;
  baseUrl: string;
  callBackUrl: string;
  clientSecretId: string;
  clientSecretKey: string;
  logoPath: string;
}

const ApplicationView = () => {
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const theme = useTheme();

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
