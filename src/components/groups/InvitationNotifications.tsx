import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { GroupService, GroupInvitation } from '../../services/group.service';
import { useUserAuth } from '../context/UserAuthContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import GroupIcon from '@mui/icons-material/Group';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const InvitationNotifications: React.FC = () => {
  const { user } = useUserAuth();
  const groupService = new GroupService();

  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<GroupInvitation | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<'accept' | 'decline' | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fetchInvitations = async () => {
    if (!user?.email) return;
    
    try {
      const userInvitations = await groupService.getInvitationsForUser(user.email);
      setInvitations(userInvitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user?.email]);

  const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleAcceptInvitation = async () => {
    if (!selectedInvitation || !user) return;

    setLoading(true);
    try {
      await groupService.acceptInvitation(selectedInvitation.id!, {
        id: user.uid || user.email!,
        name: user.displayName || user.email!,
        email: user.email!
      });

      setSnackbarMessage(`Successfully joined ${selectedInvitation.groupName}!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Refresh invitations
      await fetchInvitations();
      
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setSnackbarMessage(error.message || 'Failed to accept invitation');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setConfirmDialog(null);
      setSelectedInvitation(null);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!selectedInvitation) return;

    setLoading(true);
    try {
      await groupService.declineInvitation(selectedInvitation.id!);
      
      setSnackbarMessage('Invitation declined');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Refresh invitations
      await fetchInvitations();
      
    } catch (error: any) {
      console.error('Error declining invitation:', error);
      setSnackbarMessage(error.message || 'Failed to decline invitation');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setConfirmDialog(null);
      setSelectedInvitation(null);
    }
  };

  const formatTimeRemaining = (expiresAt: any) => {
    const now = new Date();
    const expiration = expiresAt.toDate();
    const diff = expiration.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Expires in ${days}d ${hours}h`;
    return `Expires in ${hours}h`;
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Badge badgeContent={invitations.length} color="error">
        <IconButton
          color="inherit"
          onClick={handleNotificationClick}
          sx={{ ml: 1 }}
        >
          <NotificationsIcon />
        </IconButton>
      </Badge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Group Invitations
          </Typography>
          
          {invitations.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No pending invitations
            </Typography>
          ) : (
            <List dense sx={{ width: '100%' }}>
              {invitations.map((invitation, index) => (
                <React.Fragment key={invitation.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <GroupIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle2" noWrap>
                            {invitation.groupName}
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
                          <Typography variant="caption" display="block" color="text.secondary">
                            Invited by {invitation.inviterName}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {formatTimeRemaining(invitation.expiresAt)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={<CheckIcon />}
                              onClick={() => {
                                setSelectedInvitation(invitation);
                                setConfirmDialog('accept');
                                handleNotificationClose();
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<CloseIcon />}
                              onClick={() => {
                                setSelectedInvitation(invitation);
                                setConfirmDialog('decline');
                                handleNotificationClose();
                              }}
                            >
                              Decline
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < invitations.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>

      {/* Confirmation Dialogs */}
      <Dialog
        open={confirmDialog === 'accept'}
        onClose={() => setConfirmDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon color="primary" />
            <Typography variant="h6">Join Group</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to join <strong>{selectedInvitation?.groupName}</strong> as a{' '}
            <strong>{selectedInvitation?.role}</strong>?
          </Typography>
          {selectedInvitation?.role === 'admin' && (
            <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
              As an admin, you'll be able to manage group members and settings.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAcceptInvitation} 
            variant="contained" 
            disabled={loading}
            startIcon={<CheckIcon />}
          >
            {loading ? 'Joining...' : 'Join Group'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialog === 'decline'}
        onClose={() => setConfirmDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloseIcon color="error" />
            <Typography variant="h6">Decline Invitation</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to decline the invitation to join{' '}
            <strong>{selectedInvitation?.groupName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You can always be invited again later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeclineInvitation} 
            variant="contained" 
            color="error"
            disabled={loading}
            startIcon={<CloseIcon />}
          >
            {loading ? 'Declining...' : 'Decline'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default InvitationNotifications;
