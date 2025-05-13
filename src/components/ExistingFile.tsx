import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // ✅ Import the three-dot menu icon

interface Document {
  id: number; // ✅ Unique identifier for the document
  name: string; // ✅ File name for display
  path: string; // ✅ File path for detailed view
}

interface ExistingFileProps {
  searchQuery: string; // ✅ Search input to filter the document list
  onSelectionChange: (selected: number[]) => void; // ✅ new change: Callback to update selected files in `DrawerDocument.tsx`
}

const ExistingFile: React.FC<ExistingFileProps> = ({
  searchQuery,
  onSelectionChange,
}) => {
  // ✅ Stores the list of documents fetched from the API
  const [documents, setDocuments] = useState<Document[]>([]);
  //   const [selectedFiles, setSelectedFiles] = useState<number[]>([]); // ✅ new change: Track selected files

  // ✅ Stores selected file IDs for multi-selection
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  // ✅ Stores anchor element for popover (when clicking the three dots)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // ✅ Stores the document details to display in popover
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  // ✅ Fetch document list when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/get-all-document-list/", {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json()) // ✅ Convert response to JSON
      .then((data) => {
        setDocuments(data.documents || []); // ✅ Extract document list safely
      })
      .catch(() => console.error("Failed to fetch documents")); // ✅ Handle fetch failure
  }, []);

  // ✅ Filter the document list based on the search input
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ new ch ange: Handle file selection and notify `DrawerDocument.tsx`
  const handleSelection = (id: number) => {
    setSelectedFiles((prevSelected) => {
      const updatedSelection = prevSelected.includes(id)
        ? prevSelected.filter((fileId) => fileId !== id) // ✅ Deselect
        : [...prevSelected, id]; // ✅ Select

      onSelectionChange(updatedSelection); // ✅ Notify parent component (`DrawerDocument.tsx`)
      return updatedSelection; // ✅ Ensure state updates correctly
    });
  };

  // ✅ Handle opening the popover to show full file details
  const handleOpenPopover = (
    event: React.MouseEvent<HTMLElement>,
    doc: Document
  ) => {
    setAnchorEl(event.currentTarget); // ✅ Set popover anchor (position where clicked)
    setSelectedDocument(doc); // ✅ Store document details for display
  };

  // ✅ Handle closing the popover
  const handleClosePopover = () => {
    setAnchorEl(null); // ✅ Reset anchor to close popover
    setSelectedDocument(null); // ✅ Clear selected document
  };

  return (
    <div style={{ padding: "10px 16px" }}>
      {/* ✅ Loop through filtered document list and display checkboxes with filenames */}
      {filteredDocuments.map((doc) => (
        <div
          key={doc.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ✅ Checkbox for selecting files */}
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFiles.includes(doc.id)} // ✅ Show checked state dynamically
                onChange={() => handleSelection(doc.id)} // ✅ Handle selection toggle
                color="primary"
                sx={{ marginLeft: "-12px", color: "#357BFF" }} // ✅ new change: Push checkbox slightly right
              />
            }
            label={
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "normal",
                  whiteSpace: "nowrap",
                }}
              >
                {" "}
                {/* ✅ new change: Stronger font size reduction */}
                {doc.name} {/* ✅ Show the filename next to the checkbox */}
              </span>
            }
            sx={{
              flex: 1,
              // fontSize: "-10px", // ✅ Reduced font size from default (14px) to a smaller size
              padding: "1px 0", // ✅ Adjust spacing to keep UI clean
              color: "#333", // ✅ Keeps filename readable without overpowering UI
              // justifyContent: "space-between", // ✅ new change: Keeps checkbox and filename aligned properly
              width: "100%", // ✅ Ensures correct spacing between elements
              overflow: "hidden", // ✅ Prevents text overflow issues
              textOverflow: "ellipsis", // ✅ Keeps filenames readable
              maxWidth: "180px", // ✅ Controls width to avoid overlap
            }}
          />

          {/* ✅ Three-dot menu for displaying file details */}
          <IconButton
            size="small"
            onClick={(event) => handleOpenPopover(event, doc)}
          >
            <MoreVertIcon />
          </IconButton>
        </div>
      ))}

      {/* ✅ Popover to show detailed file info when clicking three-dot menu */}
      <Popover
        open={Boolean(anchorEl)} // ✅ Opens when anchor is set
        anchorEl={anchorEl} // ✅ Positions popover at clicked location
        onClose={handleClosePopover} // ✅ Closes popover when clicked outside
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // ✅ Defines popover alignment
      >
        <Typography sx={{ p: 2 }}>
          {/* ✅ Display file details inside the popover */}
          {selectedDocument ? (
            <>
              <strong>Name:</strong> {selectedDocument.name} <br />
              <strong>Path:</strong> {selectedDocument.path}
            </>
          ) : null}
        </Typography>
      </Popover>
    </div>
  );
};

export default ExistingFile;
