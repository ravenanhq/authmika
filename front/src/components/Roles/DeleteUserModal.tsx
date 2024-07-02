import { Modal, Button, Box, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onDeleteConfirm: (selectedRow: any) => Promise<void>;
  rowData: RowData | null;
}
interface RowData {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
}

export default function EditUserModal({
  open,
  onClose,
  rowData,
  onDeleteConfirm,
}: DeleteModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleteName, setDeleteName] = useState<string | undefined>(
    rowData?.firstName
  );

  useEffect(() => {
    setDeleteName(rowData?.firstName);
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

          <PrimaryButton
            startIcon={<DeleteIcon />}
            style={{ margin: "15px 15px 0 0" }}
            onClick={onDeleteConfirm}
          >
            Delete
          </PrimaryButton>
          <SecondaryButton
            startIcon={<CloseIcon />}
            onClick={onClose}
            style={{ margin: "15px 0 0 0" }}
          >
            Cancel
          </SecondaryButton>
        </div>
      </Box>
    </Modal>
  );
}
