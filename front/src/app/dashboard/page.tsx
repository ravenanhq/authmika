"use client";
import CustomCard from "@/components/CustomCard/CustomCard";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Home() {
  const applications = [
    {
      logo: "/assets/images/nativekrea-logo.png",
      appName: "Native krea",
    },
    {
      logo: "/assets/images/ravenan-logo.png",
      appName: "Ravenan",
    },
    {
      logo: "/assets/images/trinity-logo.png",
      appName: "Trinity",
    },
    {
      logo: "/assets/images/klas-logo.png",
      appName: "klas",
    },
    {
      logo: "/assets/images/nativekrea-logo.png",
      appName: "Native krea",
    },
    {
      logo: "/assets/images/ravenan-logo.png",
      appName: "Ravenan",
    },
    {
      logo: "/assets/images/trinity-logo.png",
      appName: "Trinity",
    },
    {
      logo: "/assets/images/klas-logo.png",
      appName: "klas",
    },
  ];

  return (
    <>
      <Typography variant="h5" sx={{ marginTop: "25px" }}>
        My Applications
      </Typography>
      <Grid container spacing={3}>
        {applications.map((app, index) => (
          <Grid item xs={12} sm={6} md={2} key={index}>
            <CustomCard {...app} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
