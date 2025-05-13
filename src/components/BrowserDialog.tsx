import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete"; // ✅ Import delete icon
import FileOption from "./FileOption"; // ✅ Import new component

interface BrowserDialogProps {
  open: boolean;
  onClose: () => void;
}

const MAX_SIZE_KB = 400; // ✅ Limit total file size to 400KB

const BrowserDialog: React.FC<BrowserDialogProps> = ({ open, onClose }) => {
  const [files, setFiles] = useState<File[]>([]);

  // ✅ Handle file drop
  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  // ✅ Clear files when dialog is closed
  const handleClose = () => {
    setFiles([]); // ✅ Resets the files array
    onClose(); // ✅ Calls the parent component's close function
  };

  // ✅ Handle file deletion
  const handleDelete = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "application/pdf": [], "image/*": [], "text/plain": [] },
  });

  // ✅ Calculate total file size
  const totalSizeKB = files.reduce((acc, file) => acc + file.size / 1024, 0); // Convert bytes to KB

  // ✅ Determine file status based on total size
  let accumulatedSize = 0;
  const filesWithStatus = files.map((file) => {
    accumulatedSize += file.size / 1024;
    return {
      file,
      status: accumulatedSize <= MAX_SIZE_KB ? "Ready" : "Waiting...",
    };
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md" // ✅ Changed from "sm" to "md" for a medium-sized dialog
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <DialogContent>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* ✅ File Upload Section */}
          <Box sx={{ flex: 1, padding: "16px" }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
              Upload Files
            </Typography>

            {/* ✅ Drag & Drop Area */}
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #3578FE",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#EBF2FF",
                borderRadius: "12px",
              }}
            >
              <input {...getInputProps()} />
              <Typography>
                Drag & drop files here, or click to select
              </Typography>
            </Box>

            {/* ✅ Warning Message When Limit Exceeds */}
            {totalSizeKB > MAX_SIZE_KB && (
              <Typography sx={{ color: "red", fontSize: "14px", marginTop: 2 }}>
                ⚠️ Total file size exceeds 400KB! Remove files to enable upload.
              </Typography>
            )}

            {/* ✅ File List */}
            {files.length > 0 && (
              <Box sx={{ marginTop: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", marginBottom: 1 }}
                >
                  Selected Files
                </Typography>

                {filesWithStatus.map(({ file, status }, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 12px",
                      backgroundColor: "#F7F9FC",
                      borderRadius: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <Typography fontSize="12px" sx={{ flex: 2 }}>
                      {file.name}
                    </Typography>{" "}
                    {/* ✅ Filename */}
                    <Typography fontSize="12px" sx={{ flex: 1 }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </Typography>{" "}
                    {/* ✅ File Size */}
                    <Typography
                      fontSize="12px"
                      sx={{
                        flex: 1,
                        color: status === "Ready" ? "#3578FE" : "gray",
                      }}
                    >
                      {status}
                    </Typography>{" "}
                    {/* ✅ Status */}
                    {/* ✅ Delete Button */}
                    <IconButton
                      onClick={() => handleDelete(index)}
                      size="small"
                    >
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {/* ✅ Vertical Separator */}
          <Box
            sx={{
              width: "2px",
              backgroundColor: "#EBF2FF",
              height: "auto",
              alignSelf: "stretch",
              mx: 2,
            }}
          />{" "}
          {/* ✅ Ensures visibility */}
          {/* ✅ Sharing Permission Section */}
          <FileOption />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>{" "}
        {/* ✅ Clears files when canceled */}
        <Button
          onClick={() => alert(`Uploading ${files.length} files!`)}
          color="primary"
          disabled={totalSizeKB > MAX_SIZE_KB}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrowserDialog;
