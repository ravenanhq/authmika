import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";

interface CustomCardProps {
  logo: string;
  appName: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ logo, appName }) => {
  return (
    <Card
      variant="outlined"
      style={{ marginTop: "25px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <CardContent style={{ textAlign: "center" }}>
        <Image src={logo} alt="logo" width={80} height={100} />
        <Typography variant="h5" component="div">
          {appName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
