"use client";
import { useState } from "react";
import { Box, Link, Button, Typography, CircularProgress } from "@mui/material";
import type { Company, User } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
export default function FinancialForm(
  {company, onNext, onPrevious}:
  {company: Company | null; onNext: () => void; onPrevious: () => void}
) {
  const [loading, setLoading] = useState(false);
  const { user, fetchUser } = useAuth();

  const handleLinkFinancial = async () => {
    setLoading(true);
    const resp = await api.post('/financials/link');
    if (resp.status === 200) {
      fetchUser();
    }
    setLoading(false);
  }

  return (
    <>
      <Typography variant="h6" mt={2} align="center">Financial Link</Typography>

      <Box width="full" display="flex" alignItems="center" mt={2}>
        {loading ?
          <CircularProgress size={24} /> :
          (company?.financialsLinked ?
            <Typography variant="body1">Your Financials are already linked. You can proceed to complete the onboarding.</Typography> :
            <Typography variant="body1">
              <Link onClick={handleLinkFinancial} color="primary" sx={{ cursor: "pointer" }}>Click here</Link> to link your Financial
            </Typography>
          )
        }
      </Box>

      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onNext} disabled={!company?.financialsLinked}>Complete</Button>
      <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onPrevious}>Previous</Button>
    </>
  );
}
