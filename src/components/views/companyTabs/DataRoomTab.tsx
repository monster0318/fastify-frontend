"use client";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileDropzone from "../inputFields/FileDropzone";

export default function DataRoomTab() {
  return (
    <Box width="full" component="section">
      <Typography variant="h6" mb={2}>
        Data Room
      </Typography>

      <FileDropzone />
    </Box>
  );
}