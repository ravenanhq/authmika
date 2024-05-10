"use client";
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import { UserApi } from "@/services/api/UserApi";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

interface ICreatePasswordProps {
  password?: string | undefined;
  confirmPassword?: string | undefined;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

export default function User() {
  const [isVisible, setIsVisible] = useState<ICreatePasswordProps>({
    showPassword: false,
    showConfirmPassword: false,
  });
  const searchParams = useSearchParams();
  const key = searchParams ? searchParams.get("key") : null;
  const expires = searchParams ? searchParams.get("expires") : null;
  const [isPasswordReset, setisPasswordReset] = useState<boolean>(false);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    setValue,
  } = useForm<ICreatePasswordProps>();

  const handlePasswordVisibility = (field: keyof ICreatePasswordProps) => {
    setIsVisible((prevIsVisible) => ({
      ...prevIsVisible,
      [field]: !prevIsVisible[field],
    }));
  };

  const handlePasswordChange = (e: string) => {
    setValue("password", e);
  };

  const handleConfirmPasswordChange = (e: string) => {
    setValue("confirmPassword", e);
  };

  useEffect(() => {
    const currentTime = Date.now();
    const linkExpirationTime = Number(expires);
    if (currentTime > linkExpirationTime) {
      setIsLinkExpired(true);
    }
  }, [expires]);

  const onSubmit = async (formData: ICreatePasswordProps) => {
      const password = formData.password;
      const confirmPassword = formData.confirmPassword;
      const data = {
        key: key!,
        expires: expires!,
        password: password!,
        confirmPassword: confirmPassword!,
      };

      const res = await UserApi.createPassword(data);
      if (res.statusCode == 200) {
        setisPasswordReset(true);
      } else if (res.statusCode == 410) {
        setIsLinkExpired(true);
      } else {
        if (res.message) setError(res.message);
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
        backgroundColor: "#edf0f5",
      }}
    >
      <Card
        sx={{
          px: 12,
          py: 5,
          maxWidth: "500px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isLinkExpired && !isPasswordReset && (
          <Typography variant="h5" align="center" gutterBottom>
            Create Password
          </Typography>
        )}
        {isLinkExpired ? (
          <Typography component="p" align="center">
            Sorry the create password link has expired. Please contact admin.
          </Typography>
        ) : isPasswordReset ? (
          <>
            <Typography component="p" align="center">
              Your password created successfully.
            </Typography>
            <Typography component="p" align="center">
          Click{" "}
          <Link href="/login" variant="body2">
            here
          </Link>{" "}
          to login.
        </Typography>
          </>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              label="Password"
              required
              fullWidth
              {...register("password", {
                required: "Password is required.",
                pattern: {
                  value:
                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/]).{8,}$/,
                  message:
                    "Must contain: 8 or more characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.",
                },
              })}
              type={isVisible.showPassword ? "text" : "password"}
              value={isVisible.password}
              onChange={(e) => {
                clearErrors("password");
                handlePasswordChange(e.target.value);
              }}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handlePasswordVisibility("showPassword")}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {isVisible.showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(errors.password)}
              helperText={
                errors.password ? errors.password.message?.toString() : null
              }
              size="small"
            />
            <TextField
              label="Confirm Password"
              fullWidth
              required
              {...register("confirmPassword", {
                required: "Confirm password is required.",
                validate: (val: string | undefined) => {
                  if (watch("password") != val) {
                    return "Confirm password does not match";
                  }
                },
              })}
              type={isVisible.showConfirmPassword ? "text" : "password"}
              value={isVisible.confirmPassword}
              onChange={(e) => {
                clearErrors("confirmPassword");
                handleConfirmPasswordChange(e.target.value);
              }}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        handlePasswordVisibility("showConfirmPassword")
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {isVisible.showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(errors.confirmPassword)}
              helperText={
                errors.confirmPassword
                  ? errors.confirmPassword.message?.toString()
                  : null
              }
              size="small"
            />
            <Typography variant="body1" color="red">
              {error ? error : ""}
            </Typography>
            <PrimaryButton
              type="submit"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => {
                setError("");
              }}
            >
              Save
            </PrimaryButton>
          </Box>
        )}
      </Card>
    </Box>
  );
}
