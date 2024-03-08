"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Application {
  id: number;
  name: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const style = {
  py: 0,
  width: "100%",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
};

const ApplicationView = () => {
  const [applications, setApplications] = React.useState<Application[]>([
    { id: 1, name: "App 1" },
    { id: 2, name: "App 2" },
    { id: 3, name: "App 3" },
    { id: 4, name: "App 4" },
    { id: 5, name: "App 5" },
  ]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredApplications = applications.filter((application) =>
    application.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div style={{ width: "100%" }}>
      <Typography variant="h5" component="h2" mb={1}>
        Admin User
      </Typography>
      <Chip label="adminuser@gmail.com" />

      <Typography variant="h6" component="h2">
        Assigned Applications
      </Typography>
      <Divider sx={{marginBottom: 5}} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button variant="contained">Outlined</Button>
                  <div style={{ marginLeft: "auto" }}>
                    <TextField
                      placeholder="Search applications"
                      variant="outlined"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      size="small"
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ApplicationView;
