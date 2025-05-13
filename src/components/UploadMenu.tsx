import React from "react";
import { Button } from "@mui/material";

interface UploadMenuProps {
  handleAdvClick: () => void; // Prop to handle button click
}

const UploadMenu: React.FC<UploadMenuProps> = ({ handleAdvClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={handleAdvClick}>
      Click Me
    </Button>
  );
};

export default UploadMenu;
