import React, { useState } from "react";
import DownloadIcon from '@mui/icons-material/Download'; // MUI download icon
import { IconButton, Tooltip, Box, Typography } from "@mui/material";
//////////////////////////
// Store progress as { [id: number]: number }
const [downloadProgress, setDownloadProgress] = useState<{ [key: number]: number }>({});
//////////////////////////////////////////

const downloadFile = async (id: number) => {
  try {
    // API endpoint to download file
    const endpoint = `auth/feedbacks/${id}/file`;

    // Create a new XMLHttpRequest to track progress
    const xhr = new XMLHttpRequest();

    // Open GET request to the endpoint
    xhr.open('GET', endpoint, true);

    // Set response type to blob for binary data
    xhr.responseType = 'blob';

    // When progress is received, update the progress state
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        // Calculate percentage downloaded
        const percent = Math.round((event.loaded / event.total) * 100);
        // Update progress for this ID
        setDownloadProgress(prev => ({ ...prev, [id]: percent }));
      }
    };

    // When download is complete
    xhr.onload = () => {
      // Remove progress indicator (set to 0 or undefined)
      setDownloadProgress(prev => ({ ...prev, [id]: 0 }));

      // Check if request was successful
      if (xhr.status === 200) {
        // Get file name from header or use a default name
        const disposition = xhr.getResponseHeader('content-disposition');
        let fileName = `file_${id}`;
        if (disposition && disposition.indexOf('filename=') !== -1) {
          fileName = disposition.split('filename=')[1].replace(/"/g, '');
        }

        // Create blob URL for the file
        const url = window.URL.createObjectURL(xhr.response);

        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);

        // Append link to body and trigger click
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // Handle non-200 response
        alert('Failed to download file');
      }
    };

    // On error, reset progress and alert error
    xhr.onerror = () => {
      setDownloadProgress(prev => ({ ...prev, [id]: 0 }));
      alert('Error downloading file');
    };

    // Send the request
    xhr.send();

    // Set initial progress to 1% to show user that download has started
    setDownloadProgress(prev => ({ ...prev, [id]: 1 }));
  } catch (error) {
    // Reset progress and show error message
    setDownloadProgress(prev => ({ ...prev, [id]: 0 }));
    alert('Error: ' + error);
  }
};


///////////////////////////////////////////////////////

const columns: GridColDef[] = [
  // ... other columns
  {
    field: 'attach',
    headerName: 'Attach',
    width: 130,
    flex: 1,
    renderCell: (params) => (
      <Box display="flex" alignItems="center">
        <Tooltip title="Download Attachment">
          <span>
            <IconButton
              color="primary"
              // Disable button if download is already in progress (100% not reached)
              disabled={downloadProgress[params.row.id] && downloadProgress[params.row.id] < 100}
              onClick={() => downloadFile(params.row.id)}
            >
              <DownloadIcon />
            </IconButton>
          </span>
        </Tooltip>
        {/* Show download progress percentage if downloading */}
        {downloadProgress[params.row.id] && downloadProgress[params.row.id] > 0 && downloadProgress[params.row.id] < 100 && (
          <Typography variant="caption" sx={{ ml: 1 }}>
            {downloadProgress[params.row.id]}%
          </Typography>
        )}
      </Box>
    ),
  },
  // ... other columns
];
