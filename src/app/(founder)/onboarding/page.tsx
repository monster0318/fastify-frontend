"use client";
import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import CompanyBasicsForm from "@/components/views/onboardingForms/CompanyBasicsForm";
import KYCForm from "@/components/views/onboardingForms/KYCForm";
import FinancialForm from "@/components/views/onboardingForms/FinancialForm";
import { useAuth } from "@/contexts/AuthContext";

const steps = ['Company Basics', 'KYC Verify', 'Financial Link'];

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const renderStep = () => {
    if (user && user.companies)
      switch (activeStep) {
        case 0:
          return <CompanyBasicsForm
                    company={user.companies[0]}
                    onNext={() => setActiveStep(1)} />;
        case 1:
          return <KYCForm
            company={user.companies[0]}
            onPrevious={() => setActiveStep(0)}
            onNext={() => setActiveStep(2)}
          />;
        case 2:
          return <FinancialForm
            company={user.companies[0]}
            onPrevious={() => setActiveStep(1)}
            onNext={() => router.push('/dashboard')}
          />;
        default:
          return <CompanyBasicsForm
                  company={user.companies[0]}
                  onNext={() => setActiveStep(1)} />;
      }
    else return null;
  };

  return (
    <Box maxWidth="sm" mx="auto">
      <Typography variant="h4" my={2} align="center">Onboarding Wizard</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>
      <Box mt={4} sx={{ mx: { xs: 2, sm: 0 } }}>
        {renderStep()}
      </Box>
    </Box>
  );
}