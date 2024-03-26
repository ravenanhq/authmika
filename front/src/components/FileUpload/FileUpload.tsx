import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Box,
  CardMedia,
  Typography,
  styled,
  Card,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  imageFile: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, imageFile }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const MAX_FILE_SIZE_KB = 70;

  useEffect(() => {
    if (imageFile) {
      setImageUrl("/assets/images/" + imageFile);
    } else {
      setImageUrl("/assets/images/no_image.jpg");
    }
  }, [imageFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");

    const files = event.target.files;
    if (files && files.length > 0) {
      if (!files[0].type.startsWith("image/")) {
        setErrorMessage("Please select an image file.");
      } else if (!["image/png", "image/jpeg"].includes(files[0].type)) {
        setErrorMessage("Only PNG and JPG files are allowed.");
      } else if (files[0].size > MAX_FILE_SIZE_KB * 1024) {
        setErrorMessage(`File size exceeds ${MAX_FILE_SIZE_KB} KB.`);
      } else {
        setSelectedFile(files[0]);
        onFileUpload(files[0]);

        if (files[0]) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageUrl(reader.result as string); // Cast reader.result to string
          };
          reader.readAsDataURL(files[0]);
        }
      }
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
    <Card sx={{ padding: "10px", paddingTop: "20px", paddingBottom: "20px" }}>
      <Box>
        <input
          accept=".png,.jpg,.jpeg"
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", marginRight: "15px" }}
          >
            Logo
          </Typography>

          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              style={{
                textTransform: "none",
                paddingLeft: "10px",
                paddingRight: "10px",
                backgroundColor: "#1C658C",
                color: "#fff",
              }}
            >
              Upload
            </Button>
            {/* <PrimaryButton variant="contained" startIcon={<CloudUploadIcon />}>
              Upload
            </PrimaryButton> */}
          </label>
          {/* {selectedFile && (
            <Typography variant="body1" sx={{ marginLeft: "10px" }}>
              {selectedFile.name}
            </Typography>
          )} */}

          {/* <Card sx={{ marginLeft: '10px' }}> */}
          {imageUrl && (
            <CardMedia
              component="img"
              alt="Uploaded Image"
              height="auto"
              image={imageUrl}
              style={{ width: "50px", marginLeft: "20px" }}
            />
          )}
          {/* </Card> */}
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </Box>
    </Card>
  );
};

export default FileUpload;
