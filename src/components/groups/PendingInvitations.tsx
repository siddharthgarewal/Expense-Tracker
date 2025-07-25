import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Snackbar,
  Alert,
  Collapse
} from '@mui/material';
import { GroupService, GroupInvitation } from '../../services/group.service';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface PendingInvitationsProps {
  groupId: string;
  isAdmin: boolean;
  onInvitationUpdate?: () => void;
}

const PendingInvitations: React.FC<PendingInvitationsProps> = ({ 
  groupId, 
  isAdmin, 
  onInvitationUpdate 
}) => {
  const groupService = new GroupService();

  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fetchInvitations = useCallback(async () => {
    try {
      const groupInvitations = await groupService.getInvitationsForGroup(groupId);
      const pendingInvitations = groupInvitations.filter(inv => inv.status === 'pending');
      setInvitations(pendingInvitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } 
  }, [groupId, groupService]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleCancelInvitation = async (invitationId: string, inviteeEmail: string) => {
    try {
      await groupService.cancelInvitation(invitationId);
      setSnackbarMessage(`Invitation to ${inviteeEmail} has been cancelled`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Refresh invitations
      await fetchInvitations();
      
      if (onInvitationUpdate) {
        onInvitationUpdate();
      }
    } catch (error: any) {
      console.error('Error cancelling invitation:', error);
      setSnackbarMessage(error.message || 'Failed to cancel invitation');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const formatTimeRemaining = (expiresAt: any) => {
    const now = new Date();
    const expiration = expiresAt.toDate();
    const diff = expiration.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  if (!isAdmin || invitations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          mb: 1
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Pending Invitations ({invitations.length})
        </Typography>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      <Collapse in={expanded}>
        <Paper sx={{ mt: 1, borderRadius: 2 }}>
          <List dense>
            {invitations.map((invitation) => (
              <ListItem
                key={invitation.id}
                secondaryAction={
                  <Tooltip title="Cancel Invitation">
                    <IconButton
                      edge="end"
                      size="small"
                      color="error"
                      onClick={() => handleCancelInvitation(invitation.id!, invitation.inviteeEmail)}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {invitation.inviteeEmail}
                      </Typography>
                      <Chip
                        label={invitation.role}
                        size="small"
                        color={invitation.role === 'admin' ? 'primary' : 'default'}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Invited by {invitation.inviterName}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeRemaining(invitation.expiresAt)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Collapse>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingInvitations;
