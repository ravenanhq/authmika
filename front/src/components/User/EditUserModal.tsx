import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  IconButton,
  Divider,
  DialogContent,
  styled,
  Tabs,
  Tab,
  Box,
  Card,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  FormGroup,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
  CircularProgress,
  TableHead,
  useTheme,
  Alert,
  Autocomplete,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { RowData } from "./UserList";
import { RolesApi } from "@/services/api/RolesApi";
import { UserApi } from "@/services/api/UserApi";
import PropTypes from "prop-types";
import { StylesConfig } from "react-select";
interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
}

interface Role {
  name: string;
}

const InitialRowData = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  role: "",
  created_at: "",
  status: 0,
};

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  rowData: RowData | null;
  uniqueEmail: string;
  params: IUserView;
  onEdit: (editedData: RowData) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface ICreateListProps {
  name: string;
  id: number;
}
interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
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
interface IUserView {
  id?: number;
  username?: string;
  email?: string;
}

interface UserData {
  created_at: string | number | Date;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: number;
  mobile: string;
  id: number;
}

const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
}));

const selectStyles: StylesConfig = {
  container: (base) => ({
    ...base,
    marginTop: "16px",
    marginBottom: "16px",
  }),
};
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EditUserModal({
  onClose,
  open,
  rowData,
  uniqueEmail,
  onEdit,
  params,
}: EditModalProps) {
  const [editedData, setEditedData] = useState<RowData>(InitialRowData);
  const [errors, setErrors] = useState<Errors>({});
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const [roles, setRoles] = useState<{ name: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [options, setOptions] = useState<ICreateListProps[]>([]);
  const theme = useTheme();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    ICreateListProps[]
  >([]);
  const [saveAlert, setSaveAlert] = useState<AlertState | null>(null);
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [id, setId] = useState<number | undefined>(params.id);
  const [existingCheckboxes, setExistingCheckboxes] = useState<
    ICreateListProps[]
  >([]);
  const [value, setValue] = React.useState(0);
  const [invalidEmail, setInvalidEmail] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [alertShow, setAlertShow] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    getroles();
    getApplication();
  }, []);

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData);
    }
  }, [rowData]);

  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    setErrors((prevErrors) => ({ ...prevErrors, email: uniqueEmail }));
    return () => {
      setErrors({});
    };
  }, [uniqueEmail]);

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

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: Role | null
  ) => {
    setEditedData((prevData) => ({
      ...prevData,
      role: newValue ? newValue.name : "",
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const validateForm = () => {
    let newErrors: Errors = {};

    if (!editedData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!editedData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!editedData.email?.trim()) {
      newErrors.email = "Email is required";
    }

    if (!editedData.mobile?.trim()) {
      newErrors.mobile = "Mobile is required";
    }

    if (!editedData.role?.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setInvalidEmail("");
  };

  const handleUpdateUser = async () => {
    setErrors({});
    if (validateForm()) {
      const editUser = async (id: any, updatedData: any) => {
        try {
          const response = await UserApi.update(id, updatedData);
          setInvalidEmail("");
          if (response) {
            if (response && response.statusCode === 200) {
              const updatedRows = response.data.map((row: any) => {
                if (row.id === id) {
                  return { ...row, ...updatedData };
                }
                return row;
              });
              setUserData(updatedData);
              setAlertShow(response.message);
              handleEditModalClose();
            }
          }
        } catch (error: any) {
          var response = error.response.data;
          if (response.statusCode == 422 && response.message.email) {
            setInvalidEmail(response.message.email);
          } else if (response.statusCode == 422) {
            setInvalidEmail(response.message);
          }

          console.log(error);
        }
      };

      if ("id" in editedData) {
        const updatedData = { ...editedData };
        try {
          await editUser(updatedData.id, updatedData);
        } catch (error) {
          console.error("Error editing user:", error);
        }
      }

      onEdit(editedData);
      setErrors({});
    }
    setSuccessMessageOpen(true);
  };

  const getroles = async () => {
    try {
      const response = await RolesApi.getAllRoleApi();
      if (response) {
        const roleData = response;
        setRoles(roleData);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getApplication = async () => {
    try {
      const res = await UserApi.getApplication();
      setOptions(res);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (optionId: number) => {
    if (selectedCheckboxes.some((checkbox) => checkbox.id === optionId)) {
      setSelectedCheckboxes((prevSelected) =>
        prevSelected.filter((checkbox) => checkbox.id !== optionId)
      );
    } else {
      const selectedOption = options.find((opt) => opt.id === optionId);
      if (selectedOption) {
        setSelectedCheckboxes((prevSelected) => {
          const updatedSelection = [
            ...prevSelected,
            {
              name: selectedOption.name,
              id: selectedOption.id,
            },
          ];

          const uniqueSelection = Array.from(
            new Map(
              updatedSelection.map((checkbox) => [checkbox.id, checkbox])
            ).values()
          );
          return uniqueSelection;
        });
      }
    }
  };

  const handleSubmitModal = async (selectedCheckboxes: ICreateListProps[]) => {
    await onSubmitModal(selectedCheckboxes);
  };

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

  const onSubmitModal = async (
    formData: ICreateListProps | ICreateListProps[]
  ) => {
    const formDataArray = Array.isArray(formData) ? formData : [formData];
    const applicationIds: string[] = formDataArray.map((formDataItem) => {
      return formDataItem.id.toString();
    });
    try {
      const res = await UserApi.userApplicationMapping(id!, applicationIds);
      if (res.statusCode === 200 && res.message) {
        setSaveAlert({
          severity: "success",
          message: res.message,
        });
      }
      getApplicationsByUserId(id);
    } catch (error) {
      console.error("Error submitting data:", error);
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          backgroundColor: "#265073",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Update User
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
      <Divider color="#265073"></Divider>
      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
            {saveAlert && (
              <Alert
                severity={saveAlert.severity}
                onClose={() => {
                  setSaveAlert(null);
                }}
              >
                {saveAlert.message}
              </Alert>
            )}
            <Tabs
              value={value}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <CustomTab label="Primary Details" {...a11yProps(0)} />
              <CustomTab label="Assignment" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TextField
              label="First name"
              name="firstName"
              value={editedData.firstName || ""}
              onChange={(e) =>
                setEditedData({ ...editedData, firstName: e.target.value })
              }
              required
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.firstName}
              helperText={errors.firstName && <span>{errors.firstName}</span>}
              sx={{ marginBottom: 1.5 }}
            />

            <TextField
              label="Last name"
              name="lastName"
              required
              value={editedData.lastName || ""}
              onChange={(e) =>
                setEditedData({ ...editedData, lastName: e.target.value })
              }
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName : " "}
            />

            <TextField
              label="Email"
              name="email"
              required
              value={editedData.email || ""}
              onChange={(e) =>
                setEditedData({ ...editedData, email: e.target.value })
              }
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.email}
              helperText={errors.email ? errors.email : " "}
              sx={{ marginTop: 0 }}
            />

            <TextField
              label="Mobile"
              name="mobile"
              required
              value={editedData.mobile || ""}
              onChange={(e) =>
                setEditedData({ ...editedData, mobile: e.target.value })
              }
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.mobile}
              helperText={errors.mobile ? errors.mobile : " "}
              sx={{ marginTop: 0 }}
            />
            {loading ? (
              <CircularProgress />
            ) : (
              <Autocomplete
                value={
                  roles.find((role) => role.name === editedData.role) || null
                }
                onChange={handleChange}
                options={roles}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    error={!!errors.role}
                    size="small"
                    helperText={errors.role ? errors.role : " "}
                  />
                )}
              />
            )}
            <Box display="flex" justifyContent="flex-end">
              <PrimaryButton
                startIcon={<SaveIcon />}
                onClick={handleUpdateUser}
              >
                Update
              </PrimaryButton>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Box
              sx={{
                p: 2,
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "80%",
                  margin: "auto",
                  position: "sticky",
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                  "@media (width: 1366px) and (height: 1024px),(width: 1280px) and (height: 853px),(width: 1280px) and (height: 800px),(width: 1368px) and (height: 912px)":
                    {
                      height: "370px",
                      marginTop: "70px",
                      marginBottom: "40px",
                    },
                }}
              >
                <Table stickyHeader style={{ maxWidth: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Box
                          display="flex"
                          width="100%"
                          margin="auto"
                          marginLeft="0"
                          paddingTop="0px"
                          marginTop="0px"
                          position="sticky"
                          sx={{
                            [theme.breakpoints.down("md")]: {
                              width: "100%",
                            },
                          }}
                        >
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
                            sx={{
                              width: {
                                xs: "200%",
                                sm: "75%",
                                md: "20%",
                                lg: "390px",
                              },
                              height: "40px",
                              "& .MuiInputBase-root": {
                                height: "100%",
                                outline: "none",
                                textDecoration: "none",
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          style={{
                            textAlign: "center",
                            paddingTop: "5%",
                            border: "none",
                          }}
                        >
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && (
                      <TableRow sx={{ marginTop: "0px" }}>
                        <TableCell colSpan={2}>
                          <TableContainer
                            component={Paper}
                            sx={{
                              width: "100%",
                              height: "260px",
                              marginTop: "2px",
                              marginBottom: "0px",
                              overflowY: "auto",
                              border: "none",
                              boxShadow: "none",
                            }}
                          >
                            <FormGroup>
                              {options
                                .filter((option) =>
                                  option.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                )
                                .map((option) => (
                                  <FormControlLabel
                                    key={option.id}
                                    control={
                                      <Checkbox
                                        checked={selectedCheckboxes.some(
                                          (checkbox) =>
                                            checkbox.id === option.id
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(option.id)
                                        }
                                        style={{
                                          color: "#265073",
                                          marginBottom: "0px",
                                          marginTop: "0px",
                                        }}
                                      />
                                    }
                                    label={
                                      <span
                                        style={{
                                          maxWidth: "300px",
                                          overflow: "hidden",
                                          display: "inline-block",
                                          whiteSpace: "unset",
                                          textOverflow: "ellipsis",
                                          wordBreak: "break-all",
                                          marginTop: "0px",
                                          marginBottom: "0px",
                                          paddingTop: "3px",
                                          paddingBottom: "0px",
                                        }}
                                      >
                                        {option.name}
                                      </span>
                                    }
                                  />
                                ))}
                              {options.filter((option) =>
                                option.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              ).length === 0 && (
                                <Typography>
                                  No applications available
                                </Typography>
                              )}
                            </FormGroup>
                          </TableContainer>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
              <Box display="flex" justifyContent="flex-end">
                <PrimaryButton
                  startIcon={<SaveIcon />}
                  type="submit"
                  onClick={() => handleSubmitModal(selectedCheckboxes)}
                  sx={{ marginTop: 3 }}
                >
                  Save
                </PrimaryButton>
              </Box>
            </Box>
          </CustomTabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
