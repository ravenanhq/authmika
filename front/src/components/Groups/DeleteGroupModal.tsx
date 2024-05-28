import React from "react";
import { Modal, Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export interface RowData {
  name?: string;
  created_at: string | number | Date;
}

interface DeleteGroupModalProps {
  open: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
  rowData: RowData | null;
  tableRowName:
    | {
        name?: string;
      }
    | null
    | undefined;
}

const DeleteModal: React.FC<DeleteGroupModalProps> = ({
  open,
  onClose,
  onDeleteConfirm,
  tableRowName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const DeleteName = tableRowName && tableRowName.name ? tableRowName.name : "";
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
            Are you sure you want to delete this ?{" "}
            <span style={{ color: "#191c1a" }}>{DeleteName}</span>
          </p>
          <Button
            onClick={onDeleteConfirm}
            variant="contained"
            color="primary"
            style={{ margin: "15px 0 0 0" }}
          >
            Delete
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            color="warning"
            style={{ margin: "15px 0 0 10px" }}
          >
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
