import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { GroupService } from '../../services/group.service';
import { useUserAuth } from '../context/UserAuthContext';

interface EditGroupFormProps {
  group: any;
  onGroupUpdated?: () => void;
}

const EditGroupForm: React.FC<EditGroupFormProps> = ({ group, onGroupUpdated }) => {
  const { user } = useUserAuth();
  const groupService = new GroupService();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    visibility: 'private', // private, public
    allowMemberInvites: false,
    requireApproval: true
  });
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Initialize form data when group changes
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        icon: group.icon || '',
        description: group.description || '',
        visibility: group.visibility || 'private',
        allowMemberInvites: group.allowMemberInvites || false,
        requireApproval: group.requireApproval || true
      });
    }
  }, [group]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setSnackbarMessage('Group name is required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    
    try {
      // Track what changed for activity feed
      const changes = [];
      if (formData.name !== group.name) changes.push('name');
      if (formData.icon !== group.icon) changes.push('icon');
      if (formData.description !== group.description) changes.push('description');
      if (formData.visibility !== group.visibility) changes.push('visibility');
      if (formData.allowMemberInvites !== group.allowMemberInvites) changes.push('member invite permissions');
      if (formData.requireApproval !== group.requireApproval) changes.push('approval requirements');

      // Update group
      await groupService.updateGroup(group.id, {
        ...formData,
        updatedAt: new Date(),
        updatedBy: user?.uid || user?.email
      });

      // Add activity if there were changes
      if (changes.length > 0) {
        await groupService.addActivity(group.id, {
          type: 'group_updated',
          user: {
            id: user?.uid || user?.email || '',
            name: user?.displayName || user?.email || 'Unknown User'
          },
          details: { changes }
        });
      }

      setSnackbarMessage('Group updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      setOpen(false);
      
      if (onGroupUpdated) {
        onGroupUpdated();
      }
    } catch (error: any) {
      console.error('Error updating group:', error);
      setSnackbarMessage(error.message || 'Failed to update group');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      // Reset form data
      if (group) {
        setFormData({
          name: group.name || '',
          icon: group.icon || '',
          description: group.description || '',
          visibility: group.visibility || 'private',
          allowMemberInvites: group.allowMemberInvites || false,
          requireApproval: group.requireApproval || true
        });
      }
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        size="small"
        sx={{
          bgcolor: 'action.hover',
          '&:hover': {
            bgcolor: 'action.selected',
          },
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Edit Group Settings</Typography>
            <IconButton onClick={handleClose} disabled={loading}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            {/* Basic Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                Basic Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    mr: 2, 
                    bgcolor: 'primary.main', 
                    width: 56, 
                    height: 56, 
                    fontSize: 24 
                  }}
                >
                  {formData.icon || formData.name[0] || '?'}
                </Avatar>
                <TextField
                  label="Group Icon (emoji or letter)"
                  value={formData.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  inputProps={{ maxLength: 2 }}
                  sx={{ width: 150 }}
                  disabled={loading}
                />
              </Box>

              <TextField
                label="Group Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                fullWidth
                margin="dense"
                disabled={loading}
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                margin="dense"
                multiline
                rows={3}
                disabled={loading}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Privacy & Permissions */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                Privacy & Permissions
              </Typography>

              <FormControl fullWidth margin="dense" disabled={loading}>
                <InputLabel>Visibility</InputLabel>
                <Select
                  value={formData.visibility}
                  label="Visibility"
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                >
                  <MenuItem value="private">
                    <Box>
                      <Typography variant="body2">Private</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Only members can see this group
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="public">
                    <Box>
                      <Typography variant="body2">Public</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Anyone can discover this group
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.allowMemberInvites}
                      onChange={(e) => handleInputChange('allowMemberInvites', e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">Allow members to invite others</Typography>
                      <Typography variant="caption" color="text.secondary">
                        If disabled, only admins can send invitations
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box sx={{ mt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.requireApproval}
                      onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2">Require admin approval for new members</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Admins must approve invitation acceptances
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
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
              type="submit" 
              variant="contained"
              disabled={loading || !formData.name.trim()}
              startIcon={<EditIcon />}
            >
              {loading ? 'Updating...' : 'Update Group'}
            </Button>
          </DialogActions>
        </form>
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

export default EditGroupForm;
