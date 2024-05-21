import React from "react";
import { Modal, Button, Box, styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

interface DeActivateModalProps {
  open: boolean;
  onClose: () => void;
  onDeactivateConfirm: () => void;
}

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

const DeActivateModal: React.FC<DeActivateModalProps> = ({
  open,
  onClose,
  onDeactivateConfirm,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
          <h2>Confirmation</h2>
          <p>Are you sure you want to deactivate this user?</p>
          <SecondaryButton
            variant="contained"
            color="primary"
            style={{ margin: "15px 15px 0 0" }}
            startIcon={<CloseIcon />}
            onClick={onClose}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            variant="contained"
            color="primary"
            style={{ margin: "15px 15px 0 0" }}
            startIcon={<CheckIcon />}
            onClick={onDeactivateConfirm}
          >
            Confirm
          </PrimaryButton>
        </div>
      </Box>
    </Modal>
  );
};

export default DeActivateModal;
