import { signIn } from "next-auth/react";
import React, { useState } from "react";
import {
  Grid,
  Link,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  Alert,
  IconButton,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";

import * as dotenv from "dotenv";

dotenv.config();

interface ISignInFormProp {
  username?: string;
  password?: string;
}

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm<ISignInFormProp>();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [error, setError] = useState<string>("");

  const onSubmit: SubmitHandler<ISignInFormProp> = async () => {
    setError("");
    const user = { username, password };
    const res = await signIn("credentials", {
      username: user.username,
      password: user.password,
      redirect: false,
    });
    if (res?.error == null) {
      window.location.href = "/dashboard";
    } else {
      setError(res.error);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePasswordChange = (e: string) => {
    setValue("password", e);
    setPassword(e);
  };

  const handleUserNameChange = (e: string) => {
    setValue("username", e);
    setUsername(e);
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
        }}
      >
        <Typography component="h1" variant="h5" align="center">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            required
            size="small"
            id="username"
            label="Username"
            autoComplete="username"
            autoFocus
            {...register("username", {
              required: "Username is required.",
            })}
            onChange={(e) => {
              handleUserNameChange(e.target.value);
              clearErrors("username");
            }}
            variant="outlined"
            error={Boolean(errors.username)}
            helperText={
              errors.username ? errors.username.message?.toString() : null
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            size="small"
            fullWidth
            required
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            variant="outlined"
            {...register("password", {
              required: "Password is required",
            })}
            onChange={(e) => {
              handlePasswordChange(e.target.value);
              clearErrors("password");
            }}
            error={Boolean(errors.password)}
            helperText={
              errors.password ? errors.password.message?.toString() : null
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handlePasswordVisibility}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body1" color="red">
            {error ? error : ""}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            size="medium"
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs textAlign="right" sx={{ mt: 1 }}>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
