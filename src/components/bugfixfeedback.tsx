const [submitting, setSubmitting] = useState(false);

<Button
  sx={{ ...buttonStyles, color: "#007BFF" }}
  onClick={handleSubmit}
  variant="contained"
  disabled={
    submitting ||             // Disable while submitting
    !subject.trim() ||        // Disable if subject is empty
    !description.trim()       // Disable if description is empty
  }
>
  Submit
</Button>

/////////////////////////

const handleSubmit = async () => {
  if (!subject || !description) {
    setErrorMessage("Please fill Subject and Description fields before submitting the feedback.");
    return;
  }
  setSubmitting(true); // <-- Add this
  // ... rest of code
  try {
    // ... rest of code
    setSubmitted(true);
  } catch (error) {
    // ... rest of code
  } finally {
    setSubmitting(false); // <-- Add this (so user can retry if failed)
  }
};


////////////////////////////////////

<Button sx={buttonStyles} component="label" disabled={files.length >= 1}>
  Choose File
  <input type="file" hidden onChange={handleFileChange} />
</Button>


///////////////////////////////////////

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    setFiles([event.target.files[0]]); // Only allow one file
  }
};
