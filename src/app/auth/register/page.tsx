"use client";
import { z } from 'zod';
import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Typography, Button, TextField, Container } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type TSignUp = z.infer<typeof schema>;

export default function SignUpPage() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<TSignUp>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: TSignUp) => {
    try {
      const resp = await api.post('/auth/register', data);
      if (resp.status === 200) {
        login(resp.data?.data?.token);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" mt={4} mb={2} align='center'>Register</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
        <Link href="/auth/login">
          <Button variant="text" fullWidth sx={{ mt: 2 }}>Login</Button>
        </Link>
      </form>
    </Container>
  );
}