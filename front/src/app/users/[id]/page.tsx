"use client";
import Application from "@/app/applications/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserApi } from "@/services/api/UserApi";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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
  useTheme,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Container } from "@mui/material";

export interface RowData {
  name: string;
  id: number;
}

interface IUserView {
  id?: number;
  username?: string;
  email?: string;
}

interface ICreateListProps {
  name: string;
  id: number;
}

interface Application {
  logoPath: string;
  id: number;
  name: string;
}

interface ExtractedDataItem {
  application: {
    id: any;
    name: string;
    baseUrl: string;
    logoPath: string;
  };
  name: string;
  baseUrl: string;
}

interface UserData {
  userName: string;
  displayName: string;
  email: string;
  role: string;
}

const UserView = ({ params }: { params: IUserView }) => {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = useState<ICreateListProps[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    ICreateListProps[]
  >([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [id, setId] = useState<number | undefined>(params.id);
  const theme = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [existingCheckboxes, setExistingCheckboxes] = useState<
    ICreateListProps[]
  >([]);

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

      setExistingCheckboxes(
        applications.map((app) => ({
          application: app,
          name: app.name,
          id: app.id,
          isChecked: true,
        }))
      );
    }
  }, [applications]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const application = localStorage.getItem("user-data");
      if (application) {
        setUserData(JSON.parse(application));
      }
    }
  }, []);

  const getApplicationsByUserId = async (id: number | undefined) => {
    try {
      if (id === undefined) {
        return;
      }
      const res = await UserApi.getApplicationsByUserId(id);
      if (res.length === 0) {
        setApplications([]);
        setSelectedCheckboxes([]);
        return;
      }
      const extractedData: ExtractedDataItem[] = res;
      const mappedData: Application[] = extractedData.map(
        (item: ExtractedDataItem) => ({
          id: item.application.id,
          name: item.application.name,
          baseUrl: item.application.baseUrl,
          logoPath: item.application.logoPath,
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
    if (selectedCheckboxes.some((checkbox) => checkbox.id === optionId)) {
      setSelectedCheckboxes((prevSelected) =>
        prevSelected.filter((checkbox) => checkbox.id !== optionId)
      );
    } else {
      const selectedOption = options.find((opt) => opt.id === optionId);
      if (selectedOption) {
        setSelectedCheckboxes((prevSelected) => [
          ...prevSelected,
          {
            name: selectedOption.name,
            id: selectedOption.id,
          },
        ]);
      }
    }
  };

  const handleCancelClick = () => {
    setSelectedCheckboxes(existingCheckboxes);
    setOpen(false);
  };

  const handleCancel = async (
    userId: number | undefined,
    applicationId: number
  ) => {
    try {
      await UserApi.deleteUserApplicationMapping(userId!, applicationId);
      getApplicationsByUserId(userId);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting user application mapping:", error);
    }
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

  if (!userData) {
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
          User Details
        </Typography>
        <Divider sx={{ marginBottom: 1, flexGrow: 1 }} color="#265073" />
        <Card
          sx={{
            width: "60%",
            margin: "auto",
            mt: "30px",
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
                    <strong>Username:</strong>
                  </TableCell>
                  <TableCell
                    style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                  >
                    {userData.userName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Display Name:</strong>
                  </TableCell>
                  <TableCell
                    style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                  >
                    {userData.displayName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Email:</strong>
                  </TableCell>
                  <TableCell
                    style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                  >
                    {userData.email}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Role:</strong>
                  </TableCell>
                  <TableCell
                    style={{ whiteSpace: "unset", wordBreak: "break-all" }}
                  >
                    {userData.role}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Typography
          variant="h5"
          component="h2"
          sx={{ marginBottom: 1, marginTop: 7 }}
        >
          Assigned Applications
        </Typography>
        <Divider sx={{ marginBottom: 1, flexGrow: 2 }} color="#265073" />
        <TableContainer
          component={Paper}
          sx={{ width: "100%", maxHeight: 400, overflow: "auto" }}
        >
          <Table stickyHeader style={{ maxWidth: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <PrimaryButton
                        variant="contained"
                        onClick={handleOpen}
                        startIcon={<AddIcon />}
                      >
                        Assign Applications
                      </PrimaryButton>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {applications.length > 0 && (
                        <Box display="flex" justifyContent="flex-end" width="100%">
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
                      )}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.length < 1 && (
                <TableRow>
                  <TableCell>
                    <Typography>No results found</Typography>
                  </TableCell>
                </TableRow>
              )}
              {filteredApplications.map((application) => (
                <TableRow key={application.id} style={{ display: "flex" }}>
                  {/* <TableCell style={{ width: "6%" }}>
                    {application.logoPath !== undefined &&
                    application.logoPath !== "" &&
                    application.logoPath !== null ? (
                      <Image
                        src={"/assets/images/" + application.logoPath}
                        alt="logo"
                        width={60}
                        height={40}
                      />
                    ) : (
                      <Image
                        src="/assets/images/no_image.jpg"
                        alt="logo"
                        width={60}
                        height={40}
                      />
                    )}
                  </TableCell> */}
                  <TableCell style={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        padding: "10px",
                      }}
                    >
                      <Typography
                        style={{
                          marginRight: "auto",
                          display: "inline",
                          textAlign: "left",
                        }}
                      >
                        {application.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    style={{
                      width: "10%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        handleCancel(id, application.id);
                      }}
                      sx={{
                        fontSize: "4px",
                        color: "#FF9843",
                        filled: "none",
                        padding: 0,
                        display: "inline",
                        width: "100",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
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
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "400px",
                width: "90%",
                maxHeight: "95vh",
                overflowX: "hidden",
                bgcolor: "background.paper",
                boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
              }}
            >
              <DialogTitle
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
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
                    <Box
                      sx={{
                        mt: 2,
                        mx: 2,
                        overflowX: "hidden",
                        height: "200px",
                      }}
                    >
                      <FormGroup sx={{ marginLeft: 7 }}>
                        <Grid container spacing={1}>
                          {options.map((option) => (
                            <Grid item xs={6} key={option.id}>
                              <FormControlLabel
                                key={option.id}
                                control={
                                  <Checkbox
                                    key={option.id}
                                    checked={selectedCheckboxes.some(
                                      (checkbox) => checkbox.id === option.id
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
                                      whiteSpace: "unset",
                                      textOverflow: "ellipsis",
                                      wordBreak: "break-all",
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
                  <Box
                    style={{
                      position: "sticky",
                      bottom: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                      padding: "10px",
                    }}
                  >
                    <Divider color="#265073" />
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
                        onClick={() => {
                          handleCancelClick();
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </SecondaryButton>
                    </DialogActions>
                  </Box>
                </Box>
              )}
            </Box>
          </Modal>
        )}
      </Box>
    </Container>
  );
};

export default UserView;
