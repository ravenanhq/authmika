"use client";
import { UserApi } from "@/services/api/UserApi";
import { Box, Card, CircularProgress, Link, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const searchParams = useSearchParams();
  const key = searchParams ? searchParams.get("key") : null;
  const expires = searchParams ? searchParams.get("expires") : null;
  const [isPasswordReset, setisPasswordReset] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserId = async () => {
    try {
      const data = {
        key: key!,
        expires: expires!,
      };
      const res = await UserApi.activeUsers(data);
      setLoading(false);
      if (res.statusCode == 200) {
        setisPasswordReset(true);
      } else if (res.statusCode == 410) {
        setIsLinkExpired(true);
      } else {
        if (res.statusCode == 409) {
          setIsLinkExpired(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentTime = Date.now();
    const linkExpirationTime = Number(expires);
    if (currentTime > linkExpirationTime) {
      setIsLinkExpired(true);
    }
  }, [expires]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        justifyContent: "center",
        backgroundColor: "#edf0f5",
      }}
    >
      <Card
        sx={{
          px: 5,
          py: 5,
          maxWidth: "500px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        )}
        {isPasswordReset && (
          <>
            <Typography component="p" align="center">
              User activated successfully.
            </Typography>
            <Typography component="p" align="center">
              Click{" "}
              <Link href="/login" variant="body2">
                here
              </Link>{" "}
              to login.
            </Typography>
          </>
        )}
        {isLinkExpired && !isPasswordReset && (
          <Typography component="p" align="center">
            Sorry the activation link has expired.
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default Page;
