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
  Alert,
  Stack,
  CardMedia,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "./DeleteUserModal";
import AddUserModal from "./AddUserModal";
import { UserServiceApi } from "@/services/api/UserServiceApi";
import { Visibility } from "@mui/icons-material";
import { getSession } from "next-auth/react";
import { UserApi } from "@/services/api/UserApi";
import { GroupData } from "@/app/users/[id]/page";
import { config } from "../../../config";
interface CustomField {
  id: string;
  field_name: string;
  field_value: string | number | boolean;
}
export interface RowData {
  groupId: string;
  groups: GroupData;
  created_at: string | number | Date;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: number;
  mobile: string;
  id: number;
  file: string;
  avatar: string;
  customFields?: CustomField[] | string;
}

interface AlertState {
  severity: "success" | "info" | "warning" | "error";
  message: string;
}

const userStatus: { [key: number]: string } = {
  1: "Active",
  2: "Pending",
  3: "Inactive",
};

interface UserListProps {
  title: boolean;
  isListPage: boolean;
  applicationId: number | undefined;
  isView: string | boolean;
  roleId: number | undefined;
  id: number | undefined;
  showRole: boolean;
  roleView: boolean;
  roleName: string | undefined;
  groupId: number | undefined;
  groupView: boolean;
  showGroup: boolean;
  isGroup: boolean;
  groupName: string | undefined;
}
const TruncatedCell = styled("div")({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .truncatedCell": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

const UserList: React.FC<UserListProps> = ({
  title,
  isListPage,
  applicationId,
  isView,
  roleId,
  id,
  showRole,
  roleView,
  roleName,
  groupId,
  groupView,
  showGroup,
  isGroup,
  groupName,
}) => {
  const [alertShow, setAlertShow] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RowData[]>([]);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState("");
  const [deleteAlert, setDeleteAlert] = useState<AlertState | null>(null);
  const [invalidPassword, setInvalidPassword] = useState("");
  const [invalidMobile, setInvalidMobile] = useState("");

  useEffect(() => {
    restrictMenuAccess();
    getUsers(isListPage, applicationId, roleId, id, groupId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          const restrictedPage = "/users";
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

  const handleView = (rowData: RowData) => {
    const data = JSON.stringify(rowData);
    localStorage.setItem("user-data", data);
    const url = `/users/${rowData.id}`;
    window.location.href = url;
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

  const handleAddUserClick = () => {
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setAddUserModalOpen(false);
  };

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "Avatar",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 100,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <CardMedia
          component="img"
          alt="avatar"
          height="auto"
          image={`${config.service}/assets/images/${
            params.value ? params.value : "no_image.jpg"
          }`}
          sx={{
            width: title ? "40%" : "15%",
            padding: title ? "10%" : "0%",
            "@media (max-width: 1200px)": {
              padding: "0px",
              width: title ? "40%" : "10%",
            },
          }}
        />
      ),
    },

    {
      field: "firstName",
      headerName: "First name",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 140,
      cellClassName: "truncatedCell",
    },
    {
      field: "lastName",
      headerName: "Last name",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 160,
      cellClassName: "truncatedCell",
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 180,
      cellClassName: "truncatedCell",
    },
    {
      field: "mobile",
      headerName: "Mobile",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 120,
      cellClassName: "truncatedCell",
    },
    ...(title
      ? [
          {
            field: "role",
            headerName: "Role",
            headerClassName: "user-header",
            flex: 0.5,
            minWidth: 100,
            cellClassName: "truncatedCell",
          },
          {
            field: "groups",
            headerName: "Group",
            headerClassName: "user-header",
            flex: 0.5,
            minWidth: 120,
            cellClassName: "truncatedCell",
            valueGetter: (params: GridValueGetterParams) => {
              let paramsName = params.row.groups;

              return paramsName ? paramsName.name : "-";
            },
          },

          {
            field: "status",
            headerName: "Status",
            headerClassName: "user-header",
            flex: 0.5,
            minWidth: 120,
            cellClassName: "truncatedCell",
            renderCell: (params: GridRenderCellParams) => (
              <>{userStatus[params.value]}</>
            ),
          },
        ]
      : []),
    {
      field: "created_at",
      headerName: "Created At",
      type: "date",
      flex: 0.5,
      minWidth: 160,
      cellClassName: "truncatedCell",
      valueGetter: (params) => {
        return new Date(params.row.created_at);
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "user-header",
      flex: 0.5,
      minWidth: 140,
      disableColumnMenu: true,
      sortable: false,
      cellClassName: "truncatedCell",
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

  const getUsers = async (
    isListPage: boolean,
    applicationId: number | undefined,
    roleId: number | undefined,
    id: number | undefined,
    groupId: number | undefined
  ) => {
    try {
      const response = await UserApi.getUsers(
        isListPage,
        applicationId,
        roleId,
        id,
        groupId
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
      setLoading(false);
      console.log(error);
    }
  };

  const handleAddUser = async (
    newUser: RowData,
    isView: string | boolean,
    applicationId: number | undefined,
    isGroup: boolean
  ) => {
    try {
      const response = await UserServiceApi.create(
        newUser,
        isView,
        applicationId,
        isGroup
      );

      setInvalidEmail("");
      setInvalidPassword("");
      setInvalidMobile("");
      if (response) {
        if (response.statusCode == 201 || response.statusCode == 200) {
          const sortedUsers = response.data.sort(
            (
              a: { created_at: string | number | Date },
              b: { created_at: string | number | Date }
            ) => {
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            }
          );
          setRows(sortedUsers);
          handleCloseAddUserModal();
          setAlertShow(response.message);
        }
      }
    } catch (error: any) {
      var response = error.response.data;
      if (response.statusCode == 422 && response.message.email) {
        setInvalidEmail(response.message.email);
      } else if (response.statusCode == 422 && response.message.password) {
        setInvalidPassword(response.message.password);
      } else if (response.statusCode == 409) {
        setInvalidEmail(response.message);
      } else if (response.statusCode == 422 && response.message.mobile) {
        setInvalidMobile(response.message.mobile);
      }
      console.log(error);
    }
  };

  const handleDeleteConfirm = async (selectedRow: any) => {
    if (selectedRow !== null) {
      try {
        const currentRows = [...rows];
        const userIndex = currentRows.findIndex(
          (user) => user.id === selectedRow.id
        );

        if (userIndex !== -1) {
          const response = await UserApi.deleteUser(selectedRow.id);
          if (response && response.statusCode == 422) {
            setDeleteAlert({
              severity: "error",
              message: response.message,
            });
          } else if (response && response.statusCode == 200) {
            currentRows.splice(userIndex, 1);
            setRows(currentRows);
            setDeleteAlert({ severity: "success", message: response.message });
          }
        }
        setDeleteModalOpen(false);
      } catch (error: any) {
        console.error(error);
      }
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
        "& .user-header": {
          backgroundColor: "#265073",
          color: "#fff",
        },
        gridWidth: "100%",
        overflowX: "auto",
        "@media(width: 1024px) and (height: 1366px)": {
          gridWidth: "100%",
          overflowX: "auto",
        },
        "@media(width: 1024px) and (height: 768px),(width: 1180px) and (height: 820px),(width: 1024px) and (height: 1366px),(width: 1280px) and (height: 800px),(width: 1024px) and (height: 600px),(width: 1280px) and (height: 853px)":
          {
            maxWidth: "90vw",
            overflowX: "auto",
          },
        "@media (width: 1024px) and (height: 1366px)": {
          ".MuiDataGrid-virtualScroller": {
            overflow: "hidden",
          },
        },
        "@media (width: 1366px) and (height: 1024px)": {
          ".MuiDataGrid-virtualScroller": {
            overflow: "hidden",
          },
        },
        "@media (width: 1180px) and (height: 820px)": {
          ".MuiDataGrid-virtualScroller": {
            overflow: "hidden",
          },
        },
      }}
    >
      <Snackbar autoHideDuration={12000} />
      <CardContent style={{ padding: "0" }}>
        {title && (
          <>
            {" "}
            <Typography variant="h4">Users</Typography>
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
            <Stack sx={{ width: "100%", paddingBottom: "20px" }} spacing={4}>
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
                  onClick={handleAddUserClick}
                >
                  Add New User
                </PrimaryButton>
              </Grid>
            </Grid>
            <div
              className="flex flex-col h-screen"
              style={{ maxWidth: "100%" }}
            >
              <StyledDataGrid
                rows={rows}
                columns={columns.filter(
                  (column) => column.field !== "created_at"
                )}
                getRowId={(row) => row.id}
                autoHeight
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                disableVirtualization
                slots={{
                  noResultsOverlay: () => {
                    return (
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{ marginTop: 10, justifyContent: "center" }}
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
            </div>
          </>
        )}
      </CardContent>

      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onDeleteConfirm={() => handleDeleteConfirm(selectedRow)}
        rowData={selectedRow}
      />

      <AddUserModal
        open={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onAddUser={handleAddUser}
        uniqueEmail={invalidEmail}
        isView={isView}
        applicationId={applicationId}
        isListPage={isListPage}
        validatePassword={invalidPassword}
        showRole={showRole}
        roleView={roleView}
        roleName={roleName}
        groupView={groupView}
        showGroup={showGroup}
        groupName={groupName}
        groupId={groupId}
        isGroup={isGroup}
        validateMobile={invalidMobile}
      />
    </Card>
  );
};

export default UserList;
