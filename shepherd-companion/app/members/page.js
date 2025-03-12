"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Map as MapIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

// Placeholder data - would be replaced with real data from Firebase
const MEMBERS_DATA = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown",
    tags: ["New Believer", "Youth Group"],
    lastContact: "2023-03-01",
    notes: "Interested in joining the worship team.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "234-567-8901",
    address: "456 Oak Ave, Somecity",
    tags: ["Prayer Team", "Volunteer"],
    lastContact: "2023-03-05",
    notes: "Needs transportation to Sunday service.",
  },
  {
    id: 3,
    name: "Robert Williams",
    email: "rob.w@example.com",
    phone: "345-678-9012",
    address: "789 Pine St, Othertown",
    tags: ["Elderly", "Homebound"],
    lastContact: "2023-02-28",
    notes: "Prefers visits on weekday afternoons.",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "456-789-0123",
    address: "101 Elm St, Newcity",
    tags: ["New Visitor", "Young Adult"],
    lastContact: "2023-03-07",
    notes: "Attending for the first time last Sunday.",
  },
];

export default function MembersPage() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    // Simulate fetching data from Firebase
    const timer = setTimeout(() => {
      setMembers(MEMBERS_DATA);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1">
            Members
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            size="large"
          >
            Add Member
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5} lg={4}>
            <Paper sx={{ mb: 3, p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>

            <Paper>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {filteredMembers.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No members found" />
                    </ListItem>
                  ) : (
                    filteredMembers.map((member) => (
                      <Box key={member.id}>
                        <ListItem
                          alignItems="flex-start"
                          button
                          selected={selectedMember?.id === member.id}
                          onClick={() => handleMemberSelect(member)}
                        >
                          <ListItemAvatar>
                            <Avatar
                              alt={member.name}
                              src={`/avatars/${member.id}.jpg`}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={member.name}
                            secondary={
                              <>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Last contact: {member.lastContact}
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                  {member.tags.map((tag) => (
                                    <Chip
                                      key={tag}
                                      label={tag}
                                      size="small"
                                      sx={{ mr: 0.5, mb: 0.5 }}
                                    />
                                  ))}
                                </Box>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </Box>
                    ))
                  )}
                </List>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={7} lg={8}>
            {selectedMember ? (
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      alt={selectedMember.name}
                      src={`/avatars/${selectedMember.id}.jpg`}
                      sx={{ width: 64, height: 64, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h5" component="div">
                        {selectedMember.name}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {selectedMember.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Contact Information
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <PhoneIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            {selectedMember.phone}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <EmailIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            {selectedMember.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <MapIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            {selectedMember.address}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Contact
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {selectedMember.lastContact}
                      </Typography>

                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                      >
                        Notes
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {selectedMember.notes}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<PhoneIcon />}>
                    Call
                  </Button>
                  <Button size="small" startIcon={<EmailIcon />}>
                    Email
                  </Button>
                  <Button size="small" color="primary" variant="contained">
                    Log Interaction
                  </Button>
                </CardActions>
              </Card>
            ) : (
              <Paper sx={{ p: 4, textAlign: "center", height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "300px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Select a member to view details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click on a member from the list to view their profile
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
