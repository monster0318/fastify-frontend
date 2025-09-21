"use client";
import api from "@/lib/axios";
import { Box, Typography, TableContainer, Paper, Table, TableHead,
  TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";

interface CapData {
  owner: string;
  shares: number;
  class: string;
  percent: string;
}

export default function CartaTab() {
  const [capRows, setCapRows] = useState<CapData[]>([]);

  useEffect(() => {
    async function fetchCapRows() {
      const resp = await api.get('/cap-table');
      if (resp.status === 200) {
        setCapRows(resp.data.capTable);
      }
    }
    fetchCapRows();
  }, []);

  return (
    <Box width="full" component="section">
      <Typography variant="h6" mb={2}>
        CARTA/409A
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Owner</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Class</TableCell>
              <TableCell align="right">Percent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {capRows.map((row, index) => (
              <TableRow
                key={index.toString()}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.owner}
                </TableCell>
                <TableCell align="right">{row.shares}</TableCell>
                <TableCell align="right">{row.class}</TableCell>
                <TableCell align="right">{row.percent}</TableCell>
              </TableRow>
            ))}
            {capRows.length === 0 &&
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                    No cap table data available.
                  </Typography>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}