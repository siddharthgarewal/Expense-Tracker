import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { GroupService } from '../../services/group.service';
import { useUserAuth } from '../context/UserAuthContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';

interface InviteMemberFormProps {
  groupId: string;
  onInvitationSent?: () => void;
}

const InviteMemberForm: React.FC<InviteMemberFormProps> = ({ groupId, onInvitationSent }) => {
  const { user } = useUserAuth();
  const groupService = new GroupService();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSendInvitation = async () => {
    if (!email.trim()) {
      setSnackbarMessage('Please enter an email address');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!user) {
      setSnackbarMessage('You must be logged in to send invitations');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      await groupService.sendInvitation(
        groupId,
        email.trim().toLowerCase(),
        user.displayName || user.email || 'Unknown User',
        user.email || '',
        role
      );

      setSnackbarMessage(`Invitation sent to ${email.trim()}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Reset form
      setEmail('');
      setRole('member');
      setOpen(false);
      
      if (onInvitationSent) {
        onInvitationSent();
      }
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      setSnackbarMessage(error.message || 'Failed to send invitation. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setEmail('');
      setRole('member');
    }
  };

  return (
    <>
      <Tooltip title="Invite Member">
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            width: 48,
            height: 48,
          }}
        >
          <PersonAddIcon />
        </IconButton>
      </Tooltip>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="primary" />
            <Typography variant="h6">Invite New Member</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Send an invitation to join this group. The invitation will be valid for 7 days.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            sx={{ mb: 2 }}
            disabled={loading}
          />
          
          <FormControl fullWidth variant="outlined">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="member">
                <Box>
                  <Typography variant="body1">Member</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Can view and add expenses
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="admin">
                <Box>
                  <Typography variant="body1">Admin</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Can manage members and group settings
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendInvitation} 
            variant="contained"
            disabled={loading || !email.trim()}
            startIcon={<EmailIcon />}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
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

export default InviteMemberForm;
