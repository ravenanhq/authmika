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
} from "@mui/material";
import React from "react";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ApplicationView = () => {
  const application = localStorage.getItem("application-data");
  const applicationData = application ? JSON.parse(application) : null;
  const theme = useTheme();

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
  return (
    <Card
      sx={{
        width: "50%",
        margin: "auto",
        mt: "50px",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
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
                  <Image
                    src={"/assets/images/" + applicationData.logoPath}
                    alt="logo"
                    width={80}
                    height={100}
                  />
                ) : (
                  <Image
                    src="/assets/images/no_image.jpg"
                    alt="logo"
                    width={80}
                    height={100}
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
                <strong>Client Secret ID:</strong>
              </TableCell>
              <TableCell
                style={{ whiteSpace: "unset", wordBreak: "break-all" }}
              >
                {applicationData.clientSecretId}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Client Secret Key:</strong>
              </TableCell>
              <TableCell
                style={{ whiteSpace: "unset", wordBreak: "break-all" }}
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
  );
};

export default ApplicationView;
