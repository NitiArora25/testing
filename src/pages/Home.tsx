import React, { useState } from "react";
import { Container } from "@mui/material";
import UploadMenu from "../components/UploadMenu";
import DrawerDocument from "../components/DrawerDocument";

const Home: React.FC = () => {
  const [isopen, setIsOpen] = useState(false); // Controls drawer visibility

  return (
    <Container style={{ textAlign: "center", marginTop: "20vh" }}>
      {/* UploadMenu Component with renamed prop */}
      <UploadMenu handleAdvClick={() => setIsOpen(true)} />

      {/* Drawer Component */}
      <DrawerDocument isopen={isopen} onClose={() => setIsOpen(false)} />
    </Container>
  );
};

export default Home;
