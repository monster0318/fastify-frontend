"use client";
import React from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography, Button, TextField, Container } from '@mui/material';
import api from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type TSignIn = z.infer<typeof schema>;

export default function SignInPage() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<TSignIn>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: TSignIn) => {
    try {
      const resp = await api.post('/auth/login', data);
      if (resp.status === 200) {
        login(resp.data?.data?.token);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" mt={4} mb={2} align='center'>Login</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
        <Link href="/auth/register">
          <Button variant="text" fullWidth sx={{ mt: 2 }}>Register</Button>
        </Link>
      </form>
    </Container>
  );
}
