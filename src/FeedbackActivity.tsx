import FeedbackActivity from "../components/FeedbackActivity";
        const [isExpanded, setIsExpanded] = useState<boolean>(false);
        <Box>
       <div style={{ border: "1px solid #ccc", padding: "10px", width: "400px" }}>
      <h2 
        style={{ cursor: "pointer", userSelect: "none" }} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Feedbacks {isExpanded ? "▲" : "▼"}
      </h2>
      {isExpanded && <FeedbackActivity />}
    </div>
    </Box>


import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";

// Define the structure of feedback data
interface Feedback {
  id: number;
  full_name: string;
  user_ntid: string;
  type_of_feedback: string;
  desc: string;
  status: string;
  created_date: string;
  email: string;
  subject: string;
  attach?: string;
  consent: boolean;
  updated_date: string;
}

// Map status to respective column names
const STATUS_COLUMNS: Record<string, string> = {
  new: "New",
  "in progress": "In Progress",
  resolved: "Resolved",
};

// Styling for feedback cards
const cardStyles = {
  width: "280px", // Fixed size for all cards
  height: "160px", // Uniform height
  borderRadius: "8px",
  backgroundColor: "#EBF2FF",
  border: "none",
  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
  cursor: "grab", // Enable dragging
  padding: "16px",
  "&:hover": {
    backgroundColor: "#D0E0FF",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    transform: "scale(1.02)",
  },
};

const FeedbackActivity: React.FC = () => {
  // ✅ Fix: TypeScript error resolved by defining correct type for `useState`
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); // Stores all feedback entries
  const [loading, setLoading] = useState<boolean>(true); // Handles loading state
  const [error, setError] = useState<string | null>(null); // Stores error messages
  const [hoveredFeedback, setHoveredFeedback] = useState<Feedback | null>(null); // ✅ Fix: Using useState instead of useRef

  // ✅ Optimization: Use `useRef` instead of `useState` for hover tracking to prevent unnecessary re-renders
  const hoveredFeedbackRef = useRef<Feedback | null>(null);

  // Fetch feedback data when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/feedbacks/get")
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching feedback data");
        setLoading(false);
      });
  }, []);

  // ✅ Function to send status update when a card is moved
  const updateFeedbackStatus = async (id: number, newStatus: string) => {
    const url = `http://127.0.0.1:8000/feedbacks/${id}/status/${newStatus}?operation=update`;
    try {
      await fetch(url, { method: "POST" });
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Handle drop event when a card is moved to another column
  const handleDrop = (feedbackId: number, newStatus: string) => {
    updateFeedbackStatus(feedbackId, newStatus);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "2px",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {Object.entries(STATUS_COLUMNS).map(([key, status]) => (
        <Box
          key={status}
          sx={{
            flex: 1,
            borderRight: "1px solid #ccc",
            p: 2,
            bgcolor: "#f1f1f1",
          }}
          onDragOver={(e) => e.preventDefault()} // Allow dragging over the column
          onDrop={(e) => {
            const feedbackId = Number(e.dataTransfer.getData("text"));
            handleDrop(feedbackId, key);
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            {status}
          </Typography>
          {feedbacks
            .filter((fb) => fb.status === status)
            .map((fb) => (
              <Paper
                key={fb.id}
                elevation={3}
                sx={{
                  ...cardStyles,
                  position: "relative", // ✅ Keeps hover effects inside the card
                  "&:hover": {
                    boxShadow: 4,
                    transform: "scale(1.02)", // ✅ Slight zoom effect without affecting layout
                  },
                }}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", String(fb.id))
                }
                onMouseEnter={() => setHoveredFeedback(fb)}
                onMouseLeave={() => setHoveredFeedback(null)}
              >
                {/* ✅ Subject at top-left, ID at top-right */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    {fb.subject}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "gray" }}>
                    ID: {fb.id}
                  </Typography>
                </Box>

                {/* ✅ Description aligned with subject */}
                <Typography sx={{ mt: 1 }}>
                  <strong>Description:</strong>{" "}
                  {fb.desc.length > 30
                    ? `${fb.desc.substring(0, 30)}...`
                    : fb.desc}
                </Typography>

                {/* ✅ Shared by section */}
                <Typography sx={{ mt: 1, fontSize: 14, color: "gray" }}>
                  Shared by: {fb.full_name} / {fb.user_ntid}
                </Typography>

                {/* ✅ Updated Date */}
                <Typography sx={{ mt: 1, fontSize: 12, color: "gray" }}>
                  Updated on:{" "}
                  {new Date(fb.updated_date).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Typography>

                {/* ✅ Details Box (Fixed & Visible Above All Cards) */}
                {hoveredFeedback?.id === fb.id && (
                  <Box
                    sx={{
                      position: "fixed",
                      top: "20%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "300px",
                      bgcolor: "white",
                      border: 1,
                      boxShadow: 6,
                      borderRadius: 2,
                      p: 2,
                      zIndex: 9999,
                    }}
                  >
                    <Typography>
                      <strong>Details:</strong>
                    </Typography>
                    <Typography>ID: {fb.id}</Typography>
                    <Typography>Full Name: {fb.full_name}</Typography>
                    <Typography>User NTID: {fb.user_ntid}</Typography>
                    <Typography>
                      Type of Feedback: {fb.type_of_feedback}
                    </Typography>
                    <Typography>Description: {fb.desc}</Typography>
                    <Typography>Status: {fb.status}</Typography>
                    <Typography>
                      Created Date: {new Date(fb.created_date).toLocaleString()}
                    </Typography>
                    <Typography>Email: {fb.email}</Typography>
                    <Typography>Subject: {fb.subject}</Typography>
                    {fb.attach && (
                      <Typography>Attachment: {fb.attach}</Typography>
                    )}
                    <Typography>
                      Consent: {fb.consent ? "Yes" : "No"}
                    </Typography>
                    <Typography>
                      Updated Date: {new Date(fb.updated_date).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
        </Box>
      ))}
    </Box>
  );
};

export default FeedbackActivity;
