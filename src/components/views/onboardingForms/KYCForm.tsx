"use client";
import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { useAuth, type Company, type User } from "@/contexts/AuthContext";
import api from "@/lib/axios";

export default function KYCForm(
  {company, onNext, onPrevious}:
  {company: Company | null; onNext: () => void; onPrevious: () => void}
) {
  const [loading, setLoading] = useState(false);
  const { fetchUser } = useAuth();

  const handleKycVerify = async () => {
    setLoading(true);
    const resp = await api.post('/kyc/verify');
    if (resp.status === 200) {
      fetchUser();
    }
    setLoading(false);
  }

  return (
    <>
      <Typography variant="h6" mt={2} align="center">KYC Verify</Typography>

      {company?.kycVerified ?
        <Button variant="contained" color="secondary" fullWidth sx={{ mt: 6 }} disabled>Verified</Button> :
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 6 }}
          onClick={handleKycVerify}
          loading={loading}
        >
          Verify Now
        </Button>
      }

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={onNext}
        disabled={!company?.kycVerified}
      >
        Next
      </Button>
      <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={onPrevious}>Previous</Button>
    </>
  );
}
