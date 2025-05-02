import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  TextField, 
  Button, 
  Paper,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import { addComment, subscribeToContact } from '@/firebase/contacts';
import SendIcon from '@mui/icons-material/Send';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function ContactActivities({ contact }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentContact, setCurrentContact] = useState(contact);

  // Subscribe to real-time updates for this contact
  // Initialize currentContact with the provided contact
  useEffect(() => {
    setCurrentContact(contact);
  }, [contact]);

  // Subscribe to real-time updates for this contact
  useEffect(() => {
    if (!contact || !contact.id) return;
    
    console.log(`Setting up subscription for contact ${contact.id}`);
    const unsubscribe = subscribeToContact(contact.id, (updatedContact) => {
      if (updatedContact) {
        setCurrentContact(updatedContact);
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      console.log(`Cleaning up subscription for contact ${contact.id}`);
      unsubscribe();
    };
  }, [contact?.id]);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    
    let date;
    try {
      // Handle both Firestore Timestamp and ISO string formats
      if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (timestamp.toDate) {
        date = timestamp.toDate();
      } else {
        date = new Date(timestamp);
      }
      
      // Format as relative time if within the last 24 hours
      const now = new Date();
      const diff = now - date;
      const dayInMs = 24 * 60 * 60 * 1000;
      
      if (diff < dayInMs) {
        // Less than 24 hours ago
        if (diff < 60 * 1000) return 'Just now';
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
        return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
      } else {
        // More than 24 hours ago - use regular date format
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addComment(contact.id, comment);
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field styling for consistent Notion-like appearance
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      '&:hover': {
        border: '1px solid rgba(0, 0, 0, 0.2)',
        boxShadow: 'rgba(15, 15, 15, 0.05) 0px 0px 0px 1px inset',
      },
      '&.Mui-focused': {
        boxShadow: 'rgba(46, 117, 204, 0.15) 0px 0px 0px 2px inset',
        border: '1px solid #2E75CC',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.9rem',
    },
  };

  // Get and sort activities from the current (real-time updated) contact
  const activities = [...(currentContact?.activities || [])].sort((a, b) => {
    // Convert timestamps to Date objects for comparison
    const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
    const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
    
    // Sort in descending order (newest first)
    return dateB - dateA;
  });

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Box sx={{ mt: 0, pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
      {/* Comment Form */}
      <Box sx={{ mb: 3 }}>
        <form onSubmit={handleSubmitComment}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              multiline
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              disabled={isSubmitting}
              sx={fieldSx}
            />
            <IconButton 
              type="submit" 
              disabled={isSubmitting || !comment.trim()}
              sx={{ 
                position: 'absolute', 
                bottom: 8, 
                right: 8,
                color: comment.trim() ? 'primary.main' : 'text.disabled',
              }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
            </IconButton>
          </Box>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>

      {/* Section Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
        <ForumOutlinedIcon color="primary" sx={{ mr: 1.5, fontSize: 18 }} />
        <Typography 
          sx={{ 
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Activity History
        </Typography>
        <Chip 
          label={activities.length} 
          size="small" 
          sx={{ 
            ml: 1.5,
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 600,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            color: "text.secondary",
          }} 
        />
      </Box>
      
      {/* Activities List */}
      {activities.length > 0 ? (
        <Box>  
          {activities.map((activity, index) => {
            const isComment = activity.type === 'comment';
            
            return (
              <Box 
                key={index} 
                sx={{ 
                  mb: 2,
                  p: 2,
                  backgroundColor: isComment ? 'rgba(46, 117, 204, 0.03)' : 'rgba(0, 0, 0, 0.01)',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: isComment ? 'rgba(46, 117, 204, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: isComment ? 'primary.main' : 'rgba(0, 0, 0, 0.1)',
                      fontSize: '0.8rem',
                      mr: 1.5,
                    }}
                  >
                    {getInitials(activity.userName || 'User')}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: isComment ? 'primary.main' : 'text.primary' }}>
                        {activity.userName || activity.userId || 'Unknown user'}
                        {isComment && 
                          <Chip 
                            label="Comment" 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              height: 18, 
                              fontSize: '0.6rem',
                              fontWeight: 600,
                              backgroundColor: 'rgba(46, 117, 204, 0.1)',
                              color: 'primary.main',
                            }} 
                          />
                        }
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 2, fontSize: '0.7rem' }}>
                        {formatDate(activity.timestamp)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                      {activity.text}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
            borderRadius: 2,
            border: '1px dashed rgba(0, 0, 0, 0.1)'
          }}
        >
          <HistoryIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No activities recorded yet
          </Typography>
        </Box>
      )}
    </Box>
  );
}