"use client";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function SchedulingTab() {
  return (
    <Box width="full" component="section">
      <Typography variant="h6" mb={2}>
        Scheduling the meeting
      </Typography>
      
      <iframe
        src={process.env.NEXT_PUBLIC_CAL_COM_BOOKING_URL}
        width="100%"
        height="600"
        style={{ border: 0, borderRadius: "4px" }}
      />
    </Box>
  );
}