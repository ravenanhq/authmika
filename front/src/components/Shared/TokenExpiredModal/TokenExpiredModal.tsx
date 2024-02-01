import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { signOut } from "next-auth/react";

export const TokenExpiredModal = () => {
  const [show, setShow] = useState<boolean>(true);
  const handleClose = () => {
    signOut();
    setShow(false);
  };

  return (
    <>
      <Dialog
        open={show}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        sx={{ zIndex: 99999 }}
      >
        <DialogTitle
          color="#41505f"
          fontWeight="400"
          fontSize="0.975rem"
          sx={{ pb: 0 }}
        >
          {"Your session has expired. Please sign in again."}
        </DialogTitle>
        <DialogActions sx={{ my: 0, mx: "auto" }}>
          <Button
            onClick={handleClose}
            type="submit"
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            size="medium"
          >
            Signin
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
