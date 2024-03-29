import { signIn } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Link,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { AccountCircle, Visibility, VisibilityOff } from "@mui/icons-material";
import { UserApi } from "@/services/api/UserApi";
import { getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import * as dotenv from "dotenv";

dotenv.config();

interface ISignInFormProp {
  username?: string;
  password?: string;
}

const Login = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

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
  const [clientId, setClientId] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  useEffect(() => {
    setClientDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setClientDetails = async () => {
    const session = await getSession();
    if (session) {
      window.location.href = "/dashboard";
    }

    if (key) {
      try {
        const param = {
          key: key,
        };
        const response = await UserApi.setClientDetails(param);
        if (response.statusCode == 200) {
          if (response.clientId) setClientId(response.clientId);
          if (response.redirectUrl) setRedirectUrl(response.redirectUrl);
        } else {
          if (response.message) setError(response.message);
        }
      } catch (error: any) {
        setError(error.response.data.message);
      }
    }
  };

  const onSubmit: SubmitHandler<ISignInFormProp> = async () => {
    const user = { username, password };
    const res = await signIn("credentials", {
      username: user.username,
      password: user.password,
      redirect: false,
      clientId: clientId,
    });
    if (res?.error == null) {
      const session = await getSession();

      if (session?.apiToken) {
        const externalAppUrl = redirectUrl;
        const params = new URLSearchParams({
          code: session?.apiToken,
        });

        window.location.href = `${externalAppUrl}?${params.toString()}`;
      } else {
        window.location.href = "/dashboard";
      }
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
      <Typography component="h1" variant="h4" align="center" sx={{ mb: 3 }}>
        Authmika
      </Typography>

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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
            onClick={() => {
              setError("");
            }}
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
