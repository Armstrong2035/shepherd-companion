"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  PeopleAlt as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  AssignmentLate as AssignmentLateIcon,
} from "@mui/icons-material";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  // Placeholder data for dashboard - would be replaced with real data
  const stats = [
    {
      title: "Assigned Members",
      value: 12,
      icon: <PeopleIcon color="primary" />,
    },
    {
      title: "Completed Follow-ups",
      value: 8,
      icon: <CheckCircleIcon color="success" />,
    },
    {
      title: "Upcoming Activities",
      value: 5,
      icon: <CalendarIcon color="info" />,
    },
    {
      title: "Pending Tasks",
      value: 3,
      icon: <AssignmentLateIcon color="warning" />,
    },
  ];

  // Placeholder recent activity data
  const recentActivities = [
    {
      id: 1,
      type: "follow-up",
      name: "John Smith",
      date: "2023-03-08",
      status: "Completed",
    },
    {
      id: 2,
      type: "call",
      name: "Sarah Johnson",
      date: "2023-03-07",
      status: "Completed",
    },
    {
      id: 3,
      type: "meeting",
      name: "Robert Williams",
      date: "2023-03-06",
      status: "Missed",
    },
  ];

  // Placeholder upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Weekly Prayer Meeting",
      date: "2023-03-12",
      time: "18:00",
    },
    { id: 2, title: "Youth Group Session", date: "2023-03-15", time: "17:30" },
    { id: 3, title: "Community Outreach", date: "2023-03-18", time: "10:00" },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {userProfile?.displayName || "Team Member"}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's an overview of your activities and assigned members.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{ mb: 1, display: "flex", justifyContent: "center" }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      {stat.title}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Recent Activities and Upcoming Events */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Recent Activities" />
                  <Divider />
                  <CardContent sx={{ p: 0 }}>
                    <List sx={{ width: "100%" }}>
                      {recentActivities.map((activity) => (
                        <Box key={activity.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar
                                alt={activity.name}
                                src={`/avatars/${activity.id}.jpg`}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={activity.name}
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {activity.type.charAt(0).toUpperCase() +
                                      activity.type.slice(1)}
                                  </Typography>
                                  {` — ${activity.date} • `}
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color={
                                      activity.status === "Completed"
                                        ? "success.main"
                                        : "error.main"
                                    }
                                  >
                                    {activity.status}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </Box>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Upcoming Events" />
                  <Divider />
                  <CardContent sx={{ p: 0 }}>
                    <List sx={{ width: "100%" }}>
                      {upcomingEvents.map((event) => (
                        <Box key={event.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar>
                                <CalendarIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={event.title}
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {event.date}
                                  </Typography>
                                  {` at ${event.time}`}
                                </>
                              }
                            />
                            <Button size="small" variant="outlined">
                              Details
                            </Button>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </Box>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
