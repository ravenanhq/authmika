"use client";
import Application from "@/app/applications/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserApi } from "@/services/api/UserApi";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  DialogActions,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

interface IUserView {
  id?: number;
  username?: string;
  email?: string;
}

interface ICreateListProps {
  application: Application;
  name: string;
  id: number;
  isChecked: boolean;
}

interface Application {
  id: number;
  name: string;
}

interface ExtractedDataItem {
  application: {
    id: any;
    name: string;
    baseUrl: string;
  };
  name: string;
  baseUrl: string;
}

const UserView = ({ params }: { params: IUserView }) => {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = useState<ICreateListProps[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    ICreateListProps[]
  >([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const users = localStorage.getItem("user-data");
  const userData = users ? JSON.parse(users) : null;
  const [id, setId] = useState<number | undefined>(params.id);

  useEffect(() => {
    getApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      getApplicationsByUserId(id);
    }
  }, [id]);

  useEffect(() => {
    if (applications.length > 0) {
      setSelectedCheckboxes(
        applications.map((app) => ({
          application: app,
          name: app.name,
          id: app.id,
          isChecked: true,
        }))
      );
    }
  }, [applications]);

  const getApplicationsByUserId = async (id: number | undefined) => {
    try {
      if (id === undefined) {
        return;
      }
      const res = await UserApi.getApplicationsByUserId(id);
      if (res.length === 0) {
        setApplications([]); // Clear applications array
        setSelectedCheckboxes([]);
        return;
      }
      const extractedData: ExtractedDataItem[] = res;
      const mappedData: Application[] = extractedData.map(
        (item: ExtractedDataItem) => ({
          id: item.application.id,
          name: item.application.name,
          baseUrl: item.application.baseUrl,
        })
      );
      setApplications(mappedData);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getApplication = async () => {
    try {
      const res = await UserApi.getApplication();
      setOptions(res);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredApplications = applications
    ? applications.filter((application) => {
        if (application.name) {
          return application.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return false;
      })
    : [];

  const handleSubmit = async (selectedCheckboxes: ICreateListProps[]) => {
    await onSubmit(selectedCheckboxes);
    setOpen(false);
  };

  const onSubmit = async (formData: ICreateListProps | ICreateListProps[]) => {
    const formDataArray = Array.isArray(formData) ? formData : [formData];
    const applicationIds: string[] = formDataArray.map((formDataItem) => {
      return formDataItem.id.toString();
    });
    try {
      await UserApi.userApplicationMapping(id!, applicationIds);
      getApplicationsByUserId(id);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleCheckboxChange = (optionId: number) => {
    setSelectedCheckboxes((prevSelected) => {
      const existingOptionIndex = prevSelected.findIndex(
        (item) => item.id === optionId
      );
      if (existingOptionIndex !== -1) {
        const updatedSelected = [...prevSelected];
        updatedSelected.splice(existingOptionIndex, 1);
        return updatedSelected;
      } else {
        const selectedOption = options.find((opt) => opt.id === optionId);
        if (!selectedOption) {
          return prevSelected;
        }
        return [
          ...prevSelected,
          {
            application: selectedOption,
            name: selectedOption.name,
            id: selectedOption.id,
            isChecked: true,
          },
        ];
      }
    });
  };

  const handleBackButtonClick = () => {
    localStorage.clear();
    window.location.href = "/users";
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

  const SecondaryButton = styled(Button)(() => ({
    textTransform: "none",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: "#FF9843",
    color: "#fff",
    ":hover": {
      color: "#fff",
      backgroundColor: "#FE7A36",
    },
  }));

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
  }));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h2" mb={1} sx={{ marginTop: 5 }}>
        {userData.userName}
      </Typography>
      <Chip label={userData.email} />
      <Typography
        variant="h5"
        component="h2"
        sx={{ marginBottom: 1, marginTop: 7 }}
      >
        Assigned Applications
      </Typography>
      <Divider sx={{ marginBottom: 1, flexGrow: 1 }} color="#265073" />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <PrimaryButton
                      variant="contained"
                      onClick={handleOpen}
                      startIcon={<AddIcon />}
                    >
                      Assign Applications
                    </PrimaryButton>
                  </Grid>
                  {applications.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" justifyContent="flex-end">
                        <TextField
                          InputProps={{
                            startAdornment: (
                              <SearchIcon
                                sx={{
                                  color: "grey",
                                }}
                              />
                            ),
                          }}
                          placeholder="Search applications"
                          variant="outlined"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography>No results found</Typography>
                </TableCell>
              </TableRow>
            )}

            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <BackButton
          variant="contained"
          onClick={handleBackButtonClick}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </BackButton>
      </Box>
      {options && options.length > 0 && (
        <Modal
          open={open && options.length > 0}
          onClose={() => setOpen(false)}
          title="Application"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "relative",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#265073",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "12px",
              }}
            >
              Assign Applications
              <IconButton
                onClick={handleClose}
                sx={{
                  backgroundColor: "#FF9843",
                  color: "#fff",
                  ":hover": {
                    color: "#fff",
                    backgroundColor: "#FE7A36",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Divider color="#265073" />
            {open && options.length > 0 && (
              <Box id="modal-description" sx={{ mt: 2 }}>
                <Box style={{ width: "100%", boxSizing: "border-box" }}>
                  <Box sx={{ mt: 2, mx: 2, height: 250, overflowY: "scroll" }}>
                    <FormGroup sx={{ marginLeft: 7 }}>
                      <Grid container spacing={1}>
                        {options.map((option) => (
                          <Grid item xs={6} key={option.id}>
                            <FormControlLabel
                              key={option.id}
                              control={
                                <Checkbox
                                  checked={selectedCheckboxes.some(
                                    (item) => item.id === option.id
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(option.id)
                                  }
                                  style={{ color: "#265073" }}
                                />
                              }
                              label={
                                <span
                                  style={{
                                    maxWidth: "150px",
                                    overflow: "hidden",
                                    display: "inline-block",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {option.name}
                                </span>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </FormGroup>
                  </Box>
                </Box>

                <Divider
                  color="#265073"
                  sx={{ marginBottom: "2%", marginTop: "10%" }}
                ></Divider>
                <DialogActions style={{ margin: "0 16px 10px 0" }}>
                  <PrimaryButton
                    startIcon={<AddIcon />}
                    type="submit"
                    onClick={() => handleSubmit(selectedCheckboxes)}
                  >
                    Add
                  </PrimaryButton>
                  <SecondaryButton
                    startIcon={<CloseIcon />}
                    type="submit"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </SecondaryButton>
                </DialogActions>
              </Box>
            )}
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default UserView;
