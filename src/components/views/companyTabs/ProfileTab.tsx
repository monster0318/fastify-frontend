"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export interface Score {
  score: number;
  scorePercentage: number;
  maxPossibleScore: number;
  improvementRecommendations: string[];
}

export default function ProfileTab() {
  const { user } = useAuth();
  const [score, setScore] = useState<Score | null>(null);
  
  useEffect(() => {
    async function fetchScore() {
      const resp = await api.get('/score');
      if (resp.status === 200) {
        setScore(resp.data.data);
      }
    }

    fetchScore();
  }, []);

  return (
    <Box width="full" component="section">
      <Typography variant="h6" mb={2}>
        Company Profile
      </Typography>

      {user?.companies &&
        <>
        <Box display="flex" gap={6} sx={{ flexDirection: { xs: "column-reverse", md: "row" } }}>
          <Box flex="1" border="1px solid #ddd" p={2} borderRadius={2}>
            <Box component="dl">
              <Box
                display="flex"
                gap={2}
                alignItems="center"
                mt={2}
                mb={1}
                component="div"
              >
                <Box component="dt" width="30%">
                  <Typography variant="body1" component="span">
                    Name:
                  </Typography>
                </Box>
                <Box component="dd" width="70%">
                  <Typography variant="body1" component="span">
                    {user.companies[0]?.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box component="dl">
              <Box
                display="flex"
                gap={2}
                alignItems="center"
                mt={2}
                mb={1}
                component="div"
              >
                <Box component="dt" width="30%">
                  <Typography variant="body1" component="span">
                    Sector:
                  </Typography>
                </Box>
                <Box component="dd" width="70%">
                  <Typography variant="body1" component="span">
                    {user.companies[0]?.sector}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box component="dl">
              <Box
                display="flex"
                gap={2}
                alignItems="center"
                mt={2}
                mb={1}
                component="div"
              >
                <Box component="dt" width="30%">
                  <Typography variant="body1" component="span">
                    Target Raise:
                  </Typography>
                </Box>
                <Box component="dd" width="70%">
                  <Typography variant="body1" component="span">
                    {user.companies[0]?.targetRaise ? parseInt(String(user.companies[0]?.targetRaise), 10).toLocaleString() : "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box component="dl">
              <Box
                display="flex"
                gap={2}
                alignItems="center"
                mt={2}
                mb={1}
                component="div"
              >
                <Box component="dt" width="30%">
                  <Typography variant="body1" component="span">
                    Revenue:
                  </Typography>
                </Box>
                <Box component="dd" width="70%">
                  <Typography variant="body1" component="span">
                    {user.companies[0]?.revenue ? parseInt(String(user.companies[0]?.revenue), 10).toLocaleString() : "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box width={240}>
            <Typography variant="h4" fontSize={60} textAlign="center">{ score?.score }</Typography>
            <ul>
              {score?.improvementRecommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </Box>
        </Box>
        </>
      }
    </Box>
  );
}