import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import type { Metadata } from "next";
import theme from '@/lib/theme';
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Capital Marketplace",
  description: "A marketplace for buying and selling capital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <CssBaseline />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
