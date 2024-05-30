import React, { useEffect, useState } from "react";
import { Modal, Button, Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { RowData } from "./RolesList";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteRoleModalProps {
  open: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
  rowData: RowData | null;
}

const DeleteModal: React.FC<DeleteRoleModalProps> = ({
  open,
  onClose,
  onDeleteConfirm,
  rowData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleteName, setDeleteName] = useState<string | undefined>(
    rowData?.name
  );

  useEffect(() => {
    setDeleteName(rowData?.name);
  }, [rowData]);

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
    margin: "25px 15px 0 0",
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
    margin: "25px 0 0 0",
  }));
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "80%" : "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div>
          <h2>Delete Confirmation</h2>
          <p>
            Are you sure you want to delete this item?{" "}
            <span style={{ color: "#191c1a" }}>{deleteName}</span>
          </p>
          <PrimaryButton startIcon={<DeleteIcon />} onClick={onDeleteConfirm}>
            Delete
          </PrimaryButton>
          <SecondaryButton startIcon={<CloseIcon />} onClick={onClose}>
            Cancel
          </SecondaryButton>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
