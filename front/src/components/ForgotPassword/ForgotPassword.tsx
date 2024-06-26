"use client";
import { UserServiceApi } from "@/services/api/UserServiceApi";
import { AlternateEmailRounded } from "@mui/icons-material";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  styled,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SendIcon from '@mui/icons-material/Send';

interface IForgotPasswordProps {
  email?: string;
}

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<IForgotPasswordProps>();
  const [isMailSent, setIsMailSent] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onSubmit = async (data: IForgotPasswordProps) => {
    const emailData = { email: data.email };
    if (data.email) setSubmittedEmail(data.email);
    try {
      const response = await UserServiceApi.forgotPassword(emailData);
      if (response.statusCode == 200) {
        setIsMailSent(true);
      } else {
        if (response.message) setError(response.message);
      }
    } catch (error: any) {
      setError(error.response.data.message);
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
      <Typography component="h1" variant="h4" align="center" sx={{ mb: 3 }}>
        Authmika
      </Typography>

      <Card
        sx={{
          px: 5,
          py: 5,
          width: "100%",
        }}
      >
        <Typography component="h1" variant="h5" align="center">
          {!isMailSent ? "Forgot Password" : "Check your email"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          {isMailSent ? (
            <Typography component="p" align="center">
              We sent a password reset link to {submittedEmail}
            </Typography>
          ) : (
            <>
              <TextField
                label="Email"
                fullWidth
                required
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Enter a valid email.",
                  },
                })}
                type="email"
                onChange={(e) => {
                  clearErrors("email");
                }}
                margin="normal"
                variant="outlined"
                error={Boolean(errors.email)}
                helperText={
                  errors.email ? errors.email.message?.toString() : null
                }
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AlternateEmailRounded />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body1" color="red">
                {error ? error : ""}
              </Typography>
              <PrimaryButton
                type="submit"
                fullWidth
                sx={{ mt: 2, mb: 1 }}
                variant="contained"
                startIcon={<SendIcon/>}
                onClick={() => {
                  setError("");
                }}
              >
                Send Link
              </PrimaryButton>
            </>
          )}

          <Typography component="p" variant="h5" align="center">
            <Link href="/login" variant="body2">
              {"Return to Sign In"}
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
