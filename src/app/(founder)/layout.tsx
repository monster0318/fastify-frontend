"use client";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationFeed,
  NotificationIconButton,
  useNotifications,
  useNotificationStore,
  useAuthenticatedKnockClient,
} from "@knocklabs/react";
import { useEffect, useState } from "react";
import { Box, Badge, AppBar, Toolbar, Typography, Container, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import "@knocklabs/react/dist/index.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, fetchUser } = useAuth();
  const router = useRouter();
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [notifyAnchorEl, setNotifyAnchorEl] = useState<null | HTMLElement>(null);

  const knockClient = useAuthenticatedKnockClient(
    process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY as string,
    user?.id,
  );
  const notificationFeed = useNotifications(
    knockClient,
    process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID as string,
  );

  useEffect(() => {
    if (!user) {
      fetchUser();
    } else if (!(user.companies?.length && user.companies[0]?.kycVerified && user.companies[0]?.financialsLinked)) {
      router.push("/onboarding");
    }
  }, [user, router]);

  useEffect(() => {
    notificationFeed.fetch();
  }, [notificationFeed]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.SyntheticEvent<Element>) => {
    setNotifyAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotifyMenuClose = () => {
    setNotifyAnchorEl(null);
  };

  if (!user) return null;

  return (
    <KnockProvider
      apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
      user={{ id: user.id }}
    >
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID}
        colorMode="light"
      >
      <Box>
        <AppBar position="static" sx={{ px: 3 }}>
          <Toolbar>
            <Typography variant="h6">Capital Marketplace</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box display="flex" alignItems="center" gap={2}>
              <NotificationIconButton onClick={handleNotificationMenuOpen} />
              <IconButton size="large" color="inherit" onClick={handleProfileMenuOpen}>
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={notifyAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          id="notification-appbar"
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          
          open={Boolean(notifyAnchorEl)}
          onClose={handleNotifyMenuClose}
        >
          <Box sx={{  height: "420px", width: "400px" }}>
            <NotificationFeed />
          </Box>
        </Menu>
        <Menu
          anchorEl={profileAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          id="menu-appbar"
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
        >
          <Link href="/dashboard"><MenuItem>Dashboard</MenuItem></Link>
          <Link href="/onboarding"><MenuItem>Onboard</MenuItem></Link>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </KnockFeedProvider>
  </KnockProvider>
  );
}
