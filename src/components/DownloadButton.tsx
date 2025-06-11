import React from 'react';

// Define a React functional component for the download button
const DownloadButton: React.FC = () => {
  // This function is triggered when the button is clicked
  const handleDownload = async () => {
    try {
      // 1. Make a GET request to your API endpoint which serves the file
      const response = await fetch('https://your-api.com/download/file', {
        method: 'GET',
        headers: {
          // 2. (Optional) Add any required headers like Authorization here
        },
      });

      // 3. Check if the response from server is successful (status code 2xx)
      if (!response.ok) {
        // 4. If not, throw an error which will be caught below
        throw new Error('Network response was not ok');
      }

      // 5. Try to extract the filename from the Content-Disposition header
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'downloaded-file'; // Default filename in case header is missing

      // 6. If header is present and contains 'filename=', try to extract actual file name
      if (disposition && disposition.includes('filename=')) {
        // 7. This regex matches both quoted and unquoted filenames, including UTF-8 encoded ones
        const match = disposition.match(/filename\*?=([^;]+)/);
        if (match) {
          // 8. Remove encoding info (if any), quotes, and decode URI encoding
          filename = decodeURIComponent(
            match[1].replace(/UTF-8''/, '').replace(/['"]/g, '').trim()
          );
        }
      }

      // 9. Get the response body as a binary Blob (works for any file type)
      const blob = await response.blob();

      // 10. Create a temporary object URL for the blob
      const url = window.URL.createObjectURL(blob);

      // 11. Create a temporary anchor (<a>) element
      const link = document.createElement('a');
      // 12. Set the href to the blob URL
      link.href = url;
      // 13. Set the download attribute to specify the file name
      link.setAttribute('download', filename);
      // 14. Add the link to the document (required for some browsers)
      document.body.appendChild(link);
      // 15. Programmatically click the link to trigger download
      link.click();
      // 16. Remove the link from the document after download starts
      document.body.removeChild(link);
      // 17. Release the object URL to free memory
      window.URL.revokeObjectURL(url);

    } catch (error) {
      // 18. If any errors occur, show an alert to the user
      alert('Download failed: ' + (error as Error).message);
    }
  };

  // Render a button that triggers handleDownload when clicked
  return (
    <button onClick={handleDownload}>
      Download
    </button>
  );
};

export default DownloadButton;
