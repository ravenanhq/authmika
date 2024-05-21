import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { UserServiceApi } from "@/services/api/UserServiceApi";
import { getSession } from "next-auth/react";
import { CardMedia } from "@mui/material";
import { config } from "../../../config";
interface CustomCardProps {
  logo_path: string;
  name: string;
  applicationId: number;
}

const CustomCard: React.FC<CustomCardProps> = ({
  name,
  logo_path,
  applicationId,
}) => {
  const [hovered, setHovered] = useState(false);
  const [role, setRole] = useState<string>();
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    const setUserDetails = async () => {
      const session = await getSession();
      setRole(session?.user.role);
      setUserId(session?.user.id);
    };

    setUserDetails();
  }, []);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleClick = async () => {
    try {
      if (role?.toLowerCase() === "client") {
        const response = await UserServiceApi.quickSignIn({
          userId: userId,
          applicationId: applicationId,
        });
        const { apiToken, callBackUrl } = response;
        if (apiToken && callBackUrl) {
          window.open(`${callBackUrl}?code=${apiToken}`, "_blank");
        } else {
          alert("Something went wrong try again later.");
        }
      }
    } catch (error) {
      console.log("Error getting quick sign in", error);
    }
  };

  return (
    <Card
      variant="outlined"
      style={{
        marginTop: "25px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        cursor: role?.toLowerCase() === "client" ? "pointer" : "default",
        transition: "transform 0.3s ease",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent
        style={{
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          display: "inline",
        }}
      >
        {logo_path !== undefined && logo_path !== "" && logo_path !== null ? (
          <CardMedia
            component="img"
            src={`${config.service}/assets/images/${logo_path}`}
            alt="logo"
            height="100"
            style={{
              width: "80px",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              display: "inline",
            }}
          />
        ) : (
          <CardMedia
            component="img"
            src={`${config.service}/assets/images/${logo_path}`}
            alt="logo"
            height="100"
            style={{
              width: "80px",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              display: "inline",
            }}
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
