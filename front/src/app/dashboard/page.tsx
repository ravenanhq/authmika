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
    baseUrl: string;
    onClick: () => void;
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState<Application[]>([]);
    const [userRole, setUserRole] = useState<string>();

    useEffect(() => {
        getApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getApplications = async () => {
        const session = await getSession();
        try {
            if (
                session &&
                session.hasOwnProperty("user") &&
                session.user.hasOwnProperty("role")
            ) {
                setUserRole(session.user.role);
                let role = session.user.role;
                if (role.toLowerCase() === "client") {
                    const restrictedPages = ["/users", "/applications"];
                    if (restrictedPages.includes(window.location.pathname)) {
                        window.location.href = "/dashboard";
                        return;
                    }
                }
                const response = await DashboardApi.getApplicationsByUserId(
                    role.toLowerCase() === "admin" ? "" : session?.user.id
                );
                setLoading(false);
                setApplications(
                    role.toLowerCase() === "admin"
                        ? response.application
                        : response
                );
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <>
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ marginTop: "5%" }}>
                    {userRole?.toLowerCase() === "client"
                        ? "Your Applications"
                        : "Applications"}
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
                     {applications.length === 0 && (
                   <Typography component="p" align="center">No applications found</Typography>
              )}
                        <Grid container spacing={3}>
                            {userRole?.toLowerCase() === "admin"
                                ? applications.map((result, index: number) => (
                                      <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={2}
                                          key={index}
                                      >
                                          <CustomCard
                                              name={result.name}
                                              logo_path={result.logoPath}
                                              applicationId={
                                                  result.application.id
                                              }
                                          />
                                      </Grid>
                                  ))
                                : applications.map((result, index) => (
                                      <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={2}
                                          key={index}
                                      >
                                          <CustomCard
                                              name={result.application.name}
                                              logo_path={
                                                  result.application.logoPath
                                              }
                                              applicationId={
                                                  result.application.id
                                              }
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
