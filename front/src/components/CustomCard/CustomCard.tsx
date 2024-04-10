import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { UserApi } from "@/services/api/UserApi";
import { getSession } from "next-auth/react";

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
                console.log(role);
                const response = await UserApi.quickSignIn({
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
                cursor:
                    role?.toLowerCase() === "client" ? "pointer" : "default",
                transition: "transform 0.3s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <CardContent style={{ textAlign: "center" }}>
                {logo_path !== undefined &&
                logo_path !== "" &&
                logo_path !== null ? (
                    <Image
                        src={"/assets/images/" + logo_path}
                        alt="logo"
                        width={80}
                        height={100}
                    />
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
