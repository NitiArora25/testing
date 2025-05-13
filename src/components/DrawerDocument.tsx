import React, { useState, useEffect } from "react";
import {
  Drawer,
  Container,
  IconButton,
  Button,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ExistingFile from "../components/ExistingFile";
import BrowserDialog from "../components/BrowserDialog"; // ✅ Import the new dialog component

interface DrawerDocumentProps {
  isopen: boolean; // ✅ Controls drawer visibility
  onClose: () => void; // ✅ Function to close the drawer
}

const DrawerDocument: React.FC<DrawerDocumentProps> = ({ isopen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Stores search input value
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]); // ✅ new change: Track selected files
  const [dialogOpen, setDialogOpen] = useState(false); // ✅ Track dialog visibility

  

  // ✅ Clear search query when drawer opens to prevent old searches persisting
  useEffect(() => {
    if (isopen) {
      setSearchQuery(""); // ✅ Reset search term every time drawer opens
    }
  }, [isopen]);

  return (
    <Drawer
      anchor="right"
      open={isopen}
      onClose={onClose}
      PaperProps={{
        style: {
          width: "285px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        },
      }}
    >
      {/* ✅ Top Section - Add Document & Close Button */}
      <Container
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          sx={buttonStyles}
          onClick={() => setDialogOpen(true)} // ✅ Opens dialog when clicked
          disabled={selectedFiles.length > 0}
        >
          Add Document
        </Button>

        <IconButton
          onClick={onClose}
          sx={{
            backgroundColor: "white",
            borderRadius: "26px",
            border: "1px solid #9CC0FF",
          }}
        >
          <CloseIcon sx={{ color: "#3578FE", fontSize: 24 }} />
        </IconButton>
      </Container>

      {/* ✅ Search Bar - Clears automatically on drawer open */}
      <Box sx={{ paddingX: "10px", marginTop: -1 }}>
        <TextField
          variant="outlined"
          placeholder="Search Document..."
          fullWidth
          value={searchQuery} // ✅ Controlled input state
          onChange={(e) => setSearchQuery(e.target.value)} // ✅ Updates state dynamically
          sx={{
            backgroundColor: "#EBF2FF",
            borderRadius: "27px",
            height: "30px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "27px",
              height: "30px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#3578FE" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* ✅ File List Section - Scrollable */}
      <Box sx={{ flex: 1, overflowY: "auto", paddingX: "10px", marginTop: 1 }}>
        <ExistingFile
          searchQuery={searchQuery}
          onSelectionChange={setSelectedFiles}
        />
      </Box>

      {/* ✅ Sticky Action Buttons */}
      <Box
        sx={{
          position: "sticky", // ✅ Keeps buttons fixed at the bottom
          bottom: 0, // ✅ Ensures buttons always stay at the lowest point
          background: "white", // ✅ Prevents overlap with scrolling content
          padding: "10px",
          boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.1)", // ✅ Adds subtle shadow effect
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            sx={buttonStyles}
            disabled={selectedFiles.length === 0}
          >
            Attach
          </Button>
          <Button
            variant="outlined"
            sx={buttonStyles}
            disabled={selectedFiles.length === 0}
          >
            Summary
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
          <Button
            variant="outlined"
            sx={buttonStyles}
            disabled={selectedFiles.length === 0}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            sx={buttonStyles}
            disabled={selectedFiles.length === 0}
          >
            Compare
          </Button>
        </Box>
      </Box>
            {/* ✅ Browser Dialog - Pops up when "Add Document" is clicked */}
            <BrowserDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Drawer>
  );
};

const buttonStyles = {
  width: 164,
  height: 30,
  borderRadius: "27px",
  backgroundColor: "#EBF2FF",
  border: "none",
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#D0E0FF",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  "&:active": {
    backgroundColor: "#A5C3FF",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.3)",
  },
};

export default DrawerDocument;
