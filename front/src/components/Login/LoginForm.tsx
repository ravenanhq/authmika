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
  Skeleton,
  styled,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserApi } from "@/services/api/UserApi";
import { getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import * as dotenv from "dotenv";
import { ApplicationApi } from "@/services/api/ApplicationApi";
import { Session } from "next-auth";
import EmailIcon from "@mui/icons-material/Email";

dotenv.config();

interface ISignInFormProp {
  email?: string;
  password?: string;
}

const Login = () => {
  const searchParams = useSearchParams();
  const key = searchParams?.get("key");

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm<ISignInFormProp>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [error, setError] = useState<string>("");
  const [unAuthorized, setUnAuthorized] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const setClientDetails: () => Promise<void> = async () => {
    const session = await getSession();
    const isTwoFactorEnabled = session?.user?.is_two_factor_enabled;
    if (isTwoFactorEnabled === true) {
      setLoading(false);
    } else if (session && !key) {
      window.location.href = "/dashboard";
    } else if (key) {
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
    } else {
      setLoading(false);
    }
  };

  const goToApp = async () => {
    const session = await getSession();
    if (session) {
      const response = await ApplicationApi.getApplicationByClientId(clientId!);
      if (response.statusCode == 200 && response.applicationId) {
        const result = await UserApi.quickSignIn({
          userId: session.user.id,
          applicationId: response.applicationId,
        });
        const { apiToken, callBackUrl } = result;
        if (apiToken && callBackUrl) {
          window.location.href = `${callBackUrl}?code=${apiToken}`;
        } else if (result.statusCode == 401) {
          setUnAuthorized(true);
          setError(result.message);
          setLoading(false);
        }
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    setClientDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (key && clientId) {
      goToApp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, clientId]);

  const onSubmit: SubmitHandler<ISignInFormProp> = async () => {
    setError("");
    const user = { email, password };
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      clientId: clientId,
    });
    if (res?.error == null) {
      const session: Session | null = await getSession();
      if (session) {
        const isTwoFactorEnabled = session?.user?.is_two_factor_enabled;
        if (session?.apiToken) {
          const externalAppUrl = redirectUrl;
          const params = new URLSearchParams({
            code: session?.apiToken,
          });
          window.location.href = `${externalAppUrl}?${params.toString()}`;
        } else if (isTwoFactorEnabled === true) {
          window.location.href = "/two-factor";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } else {
      setError(res?.error || "");
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePasswordChange = (e: string) => {
    setValue("password", e);
    setPassword(e);
  };

  const handleEmailChange = (e: string) => {
    setValue("email", e);
    setEmail(e);
  };

  const logOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" });
    if (data.url) {
      window.location.href = data.url;
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
        minHeight: "100vh",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Typography component="h1" variant="h4" align="center" sx={{ mb: 3 }}>
        Authmika
      </Typography>

      <Card sx={{ px: 5, py: 5 }}>
        {unAuthorized ? (
          <>
            <p>{error} </p>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
              size="medium"
              onClick={() => logOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Typography component="h1" variant="h5" align="center">
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit((data) => onSubmit(data))}
              noValidate
              sx={{ mt: 1 }}
            >
              {loading ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    width={280}
                    sx={{ mt: 2, mb: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    width={280}
                    sx={{ mt: 2, mb: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={40}
                    width={280}
                    sx={{ mt: 2, mb: 1 }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    size="small"
                    id="email"
                    label="Email"
                    autoComplete="email"
                    autoFocus
                    {...register("email", {
                      required: "Email is required.",
                    })}
                    onChange={(e) => {
                      handleEmailChange(e.target.value);
                      clearErrors("email");
                    }}
                    variant="outlined"
                    error={Boolean(errors.email)}
                    helperText={
                      errors.email ? errors.email.message?.toString() : null
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <EmailIcon />
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
                      errors.password
                        ? errors.password.message?.toString()
                        : null
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
                  <Typography variant="body1" color="error">
                    {error}
                  </Typography>
                  <PrimaryButton
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
                  </PrimaryButton>
                  <Grid container>
                    <Grid item xs textAlign="right" sx={{ mt: 1 }}>
                      <Link href="/forgot-password" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
};

export default Login;
