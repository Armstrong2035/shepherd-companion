import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Fade,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import ContactActivities from "./activities/ContactActivities";

export default function AssignedContacts({ contacts }) {
  const [expandedContact, setExpandedContact] = useState(null);

  const handleContactExpand = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <PeopleOutlineIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Assigned Contacts 
          <Chip 
            label={contacts ? contacts.length : 0} 
            size="small" 
            sx={{ 
              ml: 1.5,
              fontWeight: 600,
              backgroundColor: "rgba(46, 117, 204, 0.1)",
              color: "primary.main",
            }} 
          />
        </Typography>
      </Box>

      {!contacts || contacts.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: "center", 
            backgroundColor: "white",
            border: "1px dashed rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <PeopleOutlineIcon sx={{ fontSize: 48, color: "text.secondary" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "text.secondary" }}>
            No contacts assigned to you yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your assigned contacts will appear here once they're assigned to you by an administrator.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {contacts.map((contact) => (
            <Grid item xs={12} key={contact.id}>
              <Card 
                elevation={0}
                sx={{ 
                  mb: 0.5,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: "8px",
                  overflow: "visible",
                  backgroundColor: "white",
                  transition: "all 0.2s",
                  '&:hover': {
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 3px 0px",
                    borderColor: "rgba(0, 0, 0, 0.12)",
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 2, pb: expandedContact === contact.id ? 0 : 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "primary.main",
                          mr: 2,
                          fontSize: "1rem",
                        }}
                      >
                        {getInitials(contact.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {contact.name}
                        </Typography>
                        
                        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                          {contact.status && (
                            <Chip 
                              label={contact.status} 
                              size="small" 
                              sx={{ 
                                mr: 1, 
                                mb: 0.5,
                                fontWeight: 500,
                                backgroundColor: contact.status === "New" ? "rgba(46, 117, 204, 0.1)" : "rgba(0, 0, 0, 0.06)",
                                color: contact.status === "New" ? "primary.main" : "text.secondary",
                              }} 
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {contact.phone && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <PhoneIcon sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {contact.phone}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {contact.email && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <EmailIcon sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {contact.email}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {(contact.location || (contact.city && contact.state)) && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} />
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {contact.location || `${contact.city}${contact.city && contact.state ? ', ' : ''}${contact.state || ''}`}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <CardActionArea 
                        onClick={() => handleContactExpand(contact.id)}
                        sx={{ 
                          py: 1, 
                          px: 2, 
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "flex-start",
                          backgroundColor: expandedContact === contact.id ? "rgba(0, 0, 0, 0.04)" : "transparent"
                        }}
                      >
                        <CommentOutlinedIcon 
                          sx={{ 
                            mr: 1, 
                            fontSize: 20, 
                            transform: expandedContact === contact.id ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                            color: "text.secondary"
                          }} 
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>
                          Activities & Comments
                        </Typography>
                      </CardActionArea>
                    </Box>
                  </Box>
                  
                  {expandedContact === contact.id && (
                    <Fade in={expandedContact === contact.id} timeout={200}>
                      <Box sx={{ px: 2, pt: 0, pb: 2 }}>
                        <ContactActivities contact={contact} />
                      </Box>
                    </Fade>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
