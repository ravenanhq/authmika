"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { ApiResponseDto } from "@/models/users.dto";
import { UserApi } from "@/services/api/UserApi";
import { useSearchParams } from "next/navigation";

interface IResetPasswordProps {
  password?: string | undefined;
  confirmPassword?: string | undefined;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

const ResetPassword = () => {
  const [isVisible, setIsVisible] = useState<IResetPasswordProps>({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [isPasswordReset, setisPasswordReset] = useState<boolean>(false);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const expires = searchParams.get("expires");
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    setValue,
  } = useForm<IResetPasswordProps>();

  const handlePasswordVisibility = (field: keyof IResetPasswordProps) => {
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

  const onSubmit = async (formData: IResetPasswordProps) => {
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const data = {
      key: key!,
      expires: expires!,
      password: password!,
      confirmPassword: confirmPassword!,
    };
    const res: ApiResponseDto = await UserApi.resetpassword(data);
    if (res.statusCode == 200) {
      setisPasswordReset(true);
    } else if (res.statusCode == 410) {
      setIsLinkExpired(true);
    } else {
      if (res.message) setError(res.message);
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
      <Typography component="h1" variant="h4" align="center" sx={{ mb: 3 }}>
        Authmika
      </Typography>

      <Card sx={{ px: 3, py: 5 }}>
        {!isLinkExpired && !isPasswordReset && (
          <Typography component="h1" variant="h5" align="center">
            Reset Password
          </Typography>
        )}
        {isLinkExpired ? (
          <Typography component="p" align="center">
            Sorry, the reset password link has expired. Please{" "}
            <Link href="/forgot-password">request a new reset link</Link> to
            reset your password.
          </Typography>
        ) : isPasswordReset ? (
          <>
            <Typography component="p" align="center">
              Your password has been successfully reset.
            </Typography>
            <Typography component="p" align="center">
              Click below to login.
            </Typography>
            <Link href="/login" color="#FFFFFF">
              <Button
                type="submit"
                fullWidth
                sx={{ mt: 2, mb: 1 }}
                variant="contained"
              >
                Login
              </Button>
            </Link>
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
            <Button
              type="submit"
              fullWidth
              sx={{ mt: 2, mb: 1 }}
              variant="contained"
              onClick={() => {
                setError("");
              }}
            >
              Reset
            </Button>
            <Typography component="p" variant="h5" align="center">
              <Link href="/login" variant="body2">
                {"Return to Sign In"}
              </Link>
            </Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ResetPassword;
