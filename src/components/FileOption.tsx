import React, { useState } from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";

const FileOption: React.FC = () => {
  // ✅ Independent state management
  const [selection, setSelection] = useState("No"); // Default: "No"
  const [embedSelection, setEmbedSelection] = useState("No"); // Default: "No"
  const [sharingSelection, setSharingSelection] = useState("Shared"); // Default: "Shared"

  return (
    <Box
      sx={{
        padding: "6px",
        width: "80px",
        display: "flex",
        flexDirection: "column",
        gap: 2, // Increased spacing for clarity
      }}
    >
      {/* 🔹 Sharing Permission (Independent) */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", fontSize: "10px", marginBottom: "4px" }}
        >
          Sharing Permission
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            borderRadius: "12px",
            border: "2px solid #3578FE",
            overflow: "hidden",
          }}
        >
          {/* ✅ Moving background indicator */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: sharingSelection === "Individual" ? "0%" : "50%",
              width: "50%",
              height: "100%",
              backgroundColor: "#3578FE",
              transition: "left 0.3s ease-in-out",
              borderRadius: "10px",
            }}
          />

          <ToggleButtonGroup
            value={sharingSelection}
            exclusive
            onChange={(_, newValue) => newValue && setSharingSelection(newValue)}
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            <ToggleButton
              value="Individual"
              sx={{
                flex: 1,
                borderRadius: "12px",
                fontSize: "10px",
                color: sharingSelection === "Individual" ? "white" : "#3578FE",
                fontWeight: "bold",
                textTransform: "none",
                padding: "4px",
              }}
            >
              Individual
            </ToggleButton>

            <ToggleButton
              value="Shared"
              sx={{
                flex: 1,
                borderRadius: "12px",
                fontSize: "10px",
                color: sharingSelection === "Shared" ? "white" : "#3578FE",
                fontWeight: "bold",
                textTransform: "none",
                padding: "4px",
              }}
            >
              Shared
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* 🔹 Generate Table and Figure */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", fontSize: "10px", marginBottom: "4px" }}
        >
          Generate Table and Figure
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            borderRadius: "12px",
            border: "2px solid #3578FE",
            overflow: "hidden",
          }}
        >
          {/* ✅ Moving background indicator */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: selection === "Yes" ? "0%" : "50%",
              width: "50%",
              height: "100%",
              backgroundColor: "#3578FE",
              transition: "left 0.3s ease-in-out",
              borderRadius: "10px",
            }}
          />

          <ToggleButtonGroup
            value={selection}
            exclusive
            onChange={(_, newValue) => {
              if (newValue) {
                setSelection(newValue);
                if (newValue === "No") {
                  setEmbedSelection("No"); // Reset Embed Selection when first toggle is "No"
                }
              }
            }}
            sx={{
              display: "flex",
              width: "100%",
              position: "relative",
              zIndex: 2,
            }}
          >
            <ToggleButton
              value="Yes"
              sx={{
                flex: 1,
                borderRadius: "12px",
                fontSize: "10px",
                color: selection === "Yes" ? "white" : "#3578FE",
                fontWeight: "bold",
                textTransform: "none",
                padding: "4px",
                zIndex: 2,
              }}
            >
              Yes
            </ToggleButton>

            <ToggleButton
              value="No"
              sx={{
                flex: 1,
                borderRadius: "12px",
                fontSize: "10px",
                color: selection === "No" ? "white" : "#3578FE",
                fontWeight: "bold",
                textTransform: "none",
                padding: "4px",
                zIndex: 2,
              }}
            >
              No
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* ✅ Embed tables appears only if "Yes" is selected */}
      {selection === "Yes" && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", fontSize: "10px", marginTop: "4px" }}
          >
            Embed tables
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              borderRadius: "12px",
              border: "2px solid #3578FE",
              overflow: "hidden",
            }}
          >
            {/* ✅ Moving background indicator */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: embedSelection === "Yes" ? "0%" : "50%",
                width: "50%",
                height: "100%",
                backgroundColor: "#3578FE",
                transition: "left 0.3s ease-in-out",
                borderRadius: "10px",
              }}
            />

            <ToggleButtonGroup
              value={embedSelection}
              exclusive
              onChange={(_, newValue) => newValue && setEmbedSelection(newValue)}
              sx={{
                display: "flex",
                width: "100%",
              }}
            >
              <ToggleButton
                value="Yes"
                sx={{
                  flex: 1,
                  borderRadius: "12px",
                  fontSize: "10px",
                  color: embedSelection === "Yes" ? "white" : "#3578FE",
                  fontWeight: "bold",
                  textTransform: "none",
                  padding: "4px",
                }}
              >
                Yes
              </ToggleButton>

              <ToggleButton
                value="No"
                sx={{
                  flex: 1,
                  borderRadius: "12px",
                  fontSize: "10px",
                  color: embedSelection === "No" ? "white" : "#3578FE",
                  fontWeight: "bold",
                  textTransform: "none",
                  padding: "4px",
                }}
              >
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileOption;
