"use client";
import CustomCard from "@/components/CustomCard/CustomCard";
import { CircularProgress, Container, Divider, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { DashboardApi } from "@/services/api/DashboardApi";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

interface Application {
  application: any;
  logo_path: string;
  name: string;
  logoPath: string;
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
        session?.user.role.toLowerCase() === "admin"
          ? response.application
          : response
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ marginTop: "5%" }}>
          Your Applications
        </Typography>
        <Divider
          color="#265073"
          sx={{ marginTop: "5px", marginBottom: "3%" }}
        ></Divider>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "5%" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <Grid container spacing={3}>
              {sessionData?.toLowerCase() === "admin"
                ? applications.map((result, index) => (
                    <Grid item xs={12} sm={6} md={2} key={index}>
                      <CustomCard
                        name={result.name}
                        logo_path={result.logoPath}
                      />
                    </Grid>
                  ))
                : applications.map((result, index) => (
                    <Grid item xs={12} sm={6} md={2} key={index}>
                      <CustomCard
                        name={result.application.name}
                        logo_path={result.application.logoPath}
                      />
                    </Grid>
                  ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
