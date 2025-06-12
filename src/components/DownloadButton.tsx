const downloadFile = async (id: number) => {
  try {
    const endpoint = `auth/feedbacks/${id}/file`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint, true);

    xhr.responseType = 'blob';

    // Track download progress and update UI
    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setDownloadProgress(prev => ({ ...prev, [id]: percent })); // Update progress for row
      }
    };

    xhr.onload = () => {
      // Remove progress on finish
      setDownloadProgress(prev => ({ ...prev, [id]: 0 }));

      if (xhr.status === 200) {
        const disposition = xhr.getResponseHeader('content-disposition');
        let fileName = `file_${id}`; // default

        if (disposition && disposition.indexOf('filename=') !== -1) {
          const matches = /filename\*?=([^;]+)(;|$)/.exec(disposition);
          if (matches) {
            // Handles filename with or without quotes
            fileName = matches[1].replace(/UTF-8''/, '').replace(/['"]/g, '').trim();
          }
        }

        const url = window.URL.createObjectURL(xhr.response);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // Download with correct filename

        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

      } else {
        alert('Failed to download file');
      }
    };

    xhr.onerror = () => {
      setDownloadProgress(prev => ({ ...prev, [id]: 0 }));
      alert('Error downloading file');
    };

    xhr.send();
    setDownloadProgress(prev => ({ ...prev, [id]: 1 })); // Start progress

  } catch (error) {
    setDownloadProgress(prev => ({ ...prev, [id]: 0 }));
    alert('Error: ' + error);
  }
};
