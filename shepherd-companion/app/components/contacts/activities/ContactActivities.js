import { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { addComment } from '@/firebase/contacts';

export default function ContactActivities({ contact }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  // Get and sort activities
  const activities = [...(contact.activities || [])].sort((a, b) => {
    // Convert timestamps to Date objects for comparison
    const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
    const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
    
    // Sort in descending order (newest first)
    return dateB - dateA;
  });

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Activities & Comments
      </Typography>
      
      {/* Comment Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmitComment}>
          <TextField
            fullWidth
            label="Add a comment"
            multiline
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            margin="normal"
            variant="outlined"
            disabled={isSubmitting}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting || !comment.trim()}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Add Comment'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      {/* Activities List */}
      {activities.length > 0 ? (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {activities.map((activity, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1" component="div">
                  {activity.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.userName || activity.userId || 'Unknown user'} • {formatDate(activity.timestamp)}
                </Typography>
                {activity.type === 'comment' && (
                  <Typography variant="caption" color="primary">
                    Comment
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No activities yet.
        </Typography>
      )}
    </Box>
  );
}