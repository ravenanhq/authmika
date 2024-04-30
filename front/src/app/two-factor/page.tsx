"use client";
import {
  Box,
  Button,
  Card,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
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
  const [errors, setErrors] = useState<Errors>({});
  const [tokenAlert, setTokenAlert] = useState("");
  const [userData, setUserData] = useState<any>({
    userId: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const session = await getSession();
        const user = session?.user;
        if (user && user.id) {
          setId(user.id);
          setUserData({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
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
  }, [id]);

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
        if (isOtpMatch.success) {
          window.location.href = "/dashboard";
        } else {
          if (isOtpMatch.error === "OTP has expired") {
            setTokenAlert("OTP has expired. Please try again.");
          } else {
            setTokenAlert("Invalid OTP. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
      }
    }
  };

  const handleResendOTP = async (id: number, userData: any) => {
    const { email, firstName, lastName, url } = userData;
    try {
      const result = await UserApi.resendOtp({
        id,
        email,
        firstName,
        lastName,
        url,
      });
    } catch (error) {
      console.error("Error while resending OTP:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100VH",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          px: 5,
          py: 5,
          flexDirection: "column",
          width: {
            xs: "100%",
            sm: "80%",
            md: "60%",
            lg: "50%",
            xl: "30%",
          },
          justifyContent: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          sx={{ marginBottom: "2%", wordWrap: "break-word" }}
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
          label="Enter the OTP"
          size="small"
          id="code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          error={!!errors.otp}
          helperText={errors.otp}
          name="Code"
          fullWidth
          sx={{ marginBottom: "2%" }}
        />
        {tokenAlert && <p style={{ color: "#d10007" }}>{tokenAlert}</p>}
        <Typography component="p" variant="h5" align="center">
          <Link
            href="/two-factor"
            variant="body2"
            onClick={() => handleResendOTP(id, userData)}
          >
            {"Resend OTP"}
          </Link>
        </Typography>
        <Typography component="p" variant="h5" align="center">
          <Link href="/login" variant="body2">
            {"Return to Login"}
          </Link>
        </Typography>
        <Grid
          container
          justifyContent="flex-end"
          sx={{ marginTop: "10px", position: "sticky" }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              position: "sticky",
              top: "20px",
              textTransform: "none",
              paddingLeft: "2%",
              paddingRight: "2%",
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
              setTokenAlert("");
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
