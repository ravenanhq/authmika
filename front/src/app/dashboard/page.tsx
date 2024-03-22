"use client";
import CustomCard from "@/components/CustomCard/CustomCard";
import { CircularProgress, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { DashboardApi } from "@/services/api/DashboardApi";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

interface Application {
  application: any;
  logo_path: string;
  name: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [sessionData, setSessionData] = useState<string | undefined>();

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    const session = await getSession();
    setSessionData(session?.user.role);
    try {
      const response = await DashboardApi.getApplicationsByUserId(
        session?.user.role.toLowerCase() === "admin" ? "" : session?.user.id
      );

      setLoading(false);
      // Asserting the type of response
      setApplications(
        session?.user.role.toLowerCase() === "admin" ? response.application : response
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "5%" }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Typography variant="h5" sx={{ marginTop: "25px" }}>
            My Applications
          </Typography>
          <Grid container spacing={3}>
            {sessionData?.toLowerCase() === "admin"
              ? applications.map((result, index) => (
                  <Grid item xs={12} sm={6} md={2} key={index}>
                    <CustomCard
                      name={result.name}
                      logo_path={result.logo_path}
                    />
                  </Grid>
                ))
              : applications.map((result, index) => (
                  <Grid item xs={12} sm={6} md={2} key={index}>
                    <CustomCard
                      name={result.application.name}
                      logo_path={result.application.logo_path}
                    />
                  </Grid>
                ))}
          </Grid>
        </>
      )}
    </>
  );
}
