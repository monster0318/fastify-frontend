"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Chip, Tabs, Tab } from "@mui/material";
import StringAvatar from "@/components/ui/StringAvatar";
import TabPanel from "@/components/ui/TabPanel";
import ProfileTab from "@/components/views/companyTabs/ProfileTab";
import DataRoomTab from "@/components/views/companyTabs/DataRoomTab";
import SchedulingTab from "@/components/views/companyTabs/SchedulingTab";
import CartaTab from "@/components/views/companyTabs/CartaTab";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  
  if (!user || !user.companies || user.companies.length == 0) return null;

  return (
    <>
      <Box
        width="full"
        display="flex"
        gap={4}
        sx={{ flexDirection: { xs: 'column', md: 'row' } }}
        alignItems="center"
      >
        <StringAvatar name={user?.companies[0].name} size={160} />
        <Box flex={1}>
          <Typography variant="h3" mt={1} sx={{ textAlign: { xs: 'center', md: 'left' } }}>{ user?.companies[0].name }</Typography>
          <Box width="full" mt={2}>
            {user?.companies[0].kycVerified &&
              <Chip label="KYC Verified" color="primary" sx={{ mr: 1 }} />
            }
            {user?.companies[0].financialsLinked &&
              <Chip label="Financial Linked" color="secondary" sx={{ mr: 1 }} />
            }
            {user?.companies[0].documents &&
              <Chip label="Docs Uploaded" color="default" />
            }
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '100%', mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Basics" {...a11yProps(0)} />
            <Tab label="Carta" {...a11yProps(1)} />
            <Tab label="Data" {...a11yProps(2)} />
            <Tab label="Scheduling" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={currentTab} index={0}>
          <ProfileTab />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <CartaTab />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <DataRoomTab />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <SchedulingTab />
        </TabPanel>
      </Box>
    </>
  );
}