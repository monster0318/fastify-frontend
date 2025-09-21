"use client";
import { z } from 'zod';
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import api from '@/lib/axios';
import { useAuth, type Company } from '@/contexts/AuthContext';

const schema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters"),
  sector: z.enum(["ecommerce", "healthcare", "finance", "education"]),
  targetRaise: z.number().min(1000, "Target raise must be at least $1,000"),
  revenue: z.number().min(0, "Revenue must be a positive number"),
});
type TCompany = z.infer<typeof schema>;

export default function CompanyBasicsForm(
  {company, onNext}: {company: Company | null; onNext: () => void}
) {
  const { fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm<TCompany>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: company?.name,
      sector: company?.sector as Company["sector"] || "ecommerce",
      targetRaise: company?.targetRaise ?? 10000,
      revenue: company?.revenue ?? 0,
    },
  });

  const onSubmit = async (data: TCompany) => {
    setLoading(true);
    const resp = await api.post('/company', data);
    if (resp.status === 200) {
      fetchUser();
      onNext();
    }
    setLoading(false);
  };

  return (
    <>
      <Typography variant="h6" my={2} align="center">Company Basics</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Company Name"
          fullWidth
          margin="normal"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <FormControl fullWidth error={!!errors.sector} sx={{ mt: 2 }}>
          <InputLabel id="sector-select-label">Sector</InputLabel>
          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <Select
                labelId="sector-select-label"
                id="sector-select"
                label="Sector"
                {...field}
              >
                <MenuItem value="ecommerce">ECommerce</MenuItem>
                <MenuItem value="healthcare">Health Care</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="education">Education</MenuItem>
              </Select>
            )}
          />
          {errors.sector ? (
            <FormHelperText>{errors.sector.message as string}</FormHelperText>
          ) : null}
        </FormControl>

        <TextField
          label="Target Raise ($)"
          fullWidth
          margin="normal"
          {...register('targetRaise', { valueAsNumber: true })}
          error={!!errors.targetRaise}
          helperText={errors.targetRaise?.message}
        />

        <TextField
          label="Revenue ($)"
          fullWidth
          margin="normal"
          {...register('revenue', { valueAsNumber: true })}
          error={!!errors.revenue}
          helperText={errors.revenue?.message}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} loading={loading}>Next</Button>
      </form>
    </>
  );
}
