"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface GroupData {
  name: string;
}

const GroupViewPage = () => {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const group = localStorage.getItem("group-data");
      if (group) {
        setGroupData(JSON.parse(group));
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
    window.location.href = "/groups";
  };

  if (!groupData) {
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
          Group Details
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
                  <TableCell>{groupData.name}</TableCell>
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

export default GroupViewPage;