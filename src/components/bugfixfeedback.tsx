import DownloadIcon from '@mui/icons-material/Download'; // Top of your file

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, flex: 1 },
  {
    field: 'attach',
    headerName: 'Attach',
    width: 130,
    flex: 1,
    // params.value is value of 'attach' from the row, params.row.id is id
    renderCell: (params) => (
      params.value === null || params.value === undefined ? (
        // If attach field is null, show No File
        <span>No File</span>
      ) : (
        // Else show download icon button
        <Tooltip title="Download Attachment">
          <span>
            <IconButton
              color="primary"
              onClick={() => downloadFile(params.row.id)}
            >
              <DownloadIcon />
            </IconButton>
          </span>
        </Tooltip>
      )
    )
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    flex: 1,
    renderCell: (params) => (
      <Box>
        <Tooltip title="Mark as Resolved">
          <span>
            <IconButton
              color="primary"
              disabled={params.row.status === 'resolved'}
              onClick={() => updateStatus(params.row.id, 'resolved')}
            >
              {/* Your existing icon here */}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    ),
  }
];
///////////////////////////////////////////

const downloadFile = async (id: number) => {
  try {
    // API endpoint to download the file using the feedback id
    const endpoint = `auth/feedbacks/feedbacks/${id}/file`;

    // Make a GET request to fetch the file
    const response = await fetch(endpoint, {
      method: 'GET',
      // If you need auth, add headers here (e.g., Authorization)
      // headers: { 'Authorization': 'Bearer <token>' }
    });

    // If the response is not OK (e.g. 404, 500), handle the error
    if (!response.ok) {
      // Try to get a reason from the response if available
      let errText = `Failed to download file. Status: ${response.status}`;
      try {
        const errMsg = await response.text();
        if (errMsg) errText += ` - ${errMsg}`;
      } catch (ignore) {}
      throw new Error(errText);
    }

    // Get the Content-Disposition header to determine filename
    const disposition = response.headers.get('content-disposition');
    let fileName = `file_${id}`;

    if (disposition && disposition.toLowerCase().includes('filename=')) {
      // Extract filename using regex: handles quotes, spaces, and UTF-8 names
      // e.g. content-disposition: attachment; filename="my file.pdf"
      const fileNameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)["']?/i);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = decodeURIComponent(fileNameMatch[1]);
      }
    }

    // Convert the response to a blob (handles any binary file type)
    const blob = await response.blob();

    // Edge case: Check for empty file
    if (blob.size === 0) {
      throw new Error('The file is empty or does not exist.');
    }

    // Create a temporary URL for the blob to trigger download
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element for download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);

    // Add link to DOM, click it, and then remove for cleanup
    document.body.appendChild(link);
    link.click();

    // Clean up: remove link and revoke blob URL
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    // Log detailed error to console
    console.error('Error downloading file:', error);
    // Show user-friendly alert
    alert(
      error?.message
        ? `Download failed: ${error.message}`
        : 'No file found or download failed. Please try again later.'
    );
  }
};
