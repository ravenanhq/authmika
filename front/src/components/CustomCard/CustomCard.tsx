import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface CustomCardProps {
  logo: string; // Explicitly typing the logo prop as a string
  appName: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ logo, appName, content }) => {
  return (
    <Card variant="outlined" style={{ marginTop: '25px' }}>
      <CardContent style={{ textAlign: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '100%', height: '100px' }} />
        <Typography variant="h5" component="div">
          {appName}
        </Typography>
      </CardContent>
  </Card>
  );
};

export default CustomCard;
