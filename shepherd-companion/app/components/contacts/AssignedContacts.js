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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactActivities from "./activities/ContactActivities";

export default function AssignedContacts({ contacts }) {
  const [expandedContact, setExpandedContact] = useState(null);

  const handleContactExpand = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Assigned Contacts ({contacts ? contacts.length : 0})
      </Typography>

      {!contacts || contacts.length === 0 ? (
        <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">
            No contacts assigned to you yet
          </Typography>
        </Paper>
      ) : (
        <Box>
          {contacts.map((contact) => (
            <Card key={contact.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{contact.name}</Typography>

                <Box sx={{ mt: 1 }}>
                  {contact.phone && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Phone:</strong> {contact.phone}
                    </Typography>
                  )}

                  {contact.email && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Email:</strong> {contact.email}
                    </Typography>
                  )}

                  {contact.location && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Location:</strong> {contact.location}
                    </Typography>
                  )}

                  {contact.status && (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Status:</strong> {contact.status}
                    </Typography>
                  )}
                </Box>

                <Accordion
                  expanded={expandedContact === contact.id}
                  onChange={() => handleContactExpand(contact.id)}
                  sx={{
                    mt: 2,
                    boxShadow: "none",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="activities-content"
                    id="activities-header"
                  >
                    <Typography>Activities & Comments</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ContactActivities contact={contact} />
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
