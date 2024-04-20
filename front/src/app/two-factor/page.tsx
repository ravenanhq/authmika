"use client";
import { Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { UserApi } from "@/services/api/UserApi";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface Errors {
  otp?: string;
}

const Twofactor = () => {
  const [id, setId] = useState<number>(-1);
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [tokenAlert, setTokenAlert] = useState("");
  const [userData, setUserData] = useState<any>({
    userId: "",
    userName: "",
    displayName: "",
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const session = await getSession();
        const user = session?.user;
        if (user && user.id && user.userName && user.displayName) {
          setId(user.id);
          setUserData({
            id: user.id,
            user_name: user.userName,
            display_name: user.displayName,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            otp: user.otp,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserId();
  }, []);

  const validateOtp = () => {
    let newErrors: Errors = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyToken = async (id: number, otp: string) => {
    if (validateOtp()) {
      try {
        const isOtpMatch = await UserApi.verifyOtp(id, otp);

        if (isOtpMatch.success === true) {
          window.location.href = "/dashboard";
        } else {
          setTokenAlert("Invalid token. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100VH",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          px: 5,
          py: 5,
          flexDirection: "column",
          width: "30%",
          justifyContent: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{ marginBottom: 2 }}
        >
          OTP Verification
        </Typography>
        <Typography>
          Please Confirm access to your account by entering the One-Time
          Password (OTP), This OTP is valid for a single use and must be entered
          promptly. It has been sent to your email address
        </Typography>
        <TextField
          margin="normal"
          label="OTP"
          size="small"
          id="code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          error={!!errors.otp}
          helperText={errors.otp}
          name="Code"
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {tokenAlert && <p style={{ color: "#d10007" }}>{tokenAlert}</p>}
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            sx={{
              position: "sticky",
              top: "20px",
              textTransform: "none",
              paddingLeft: "10px",
              paddingRight: "10px",
              backgroundColor: "#1C658C",
              color: "#fff",
              ":hover": {
                color: "#fff",
                backgroundColor: "#265073",
              },
            }}
            startIcon={<LoginIcon />}
            onClick={() => {
              handleVerifyToken(id, otp);
            }}
          >
            Verify
          </Button>
        </Grid>
      </Card>
    </Box>
  );
};

export default Twofactor;
