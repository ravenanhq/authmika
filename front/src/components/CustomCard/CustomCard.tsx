import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";

interface CustomCardProps {
  logo_path: string;
  name: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ name, logo_path }) => {
  return (
    <Card
      variant="outlined"
      style={{ marginTop: "25px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <CardContent style={{ textAlign: "center" }}>
        {logo_path !== undefined && logo_path !== "" ? (
          <Image src={logo_path} alt="logo" width={80} height={100} />
        ) : (
          <Image
            src="/assets/images/no_image.jpg"
            alt="logo"
            width={80}
            height={100}
          />
        )}
        <Typography variant="h5" component="div">
          {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
