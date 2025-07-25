import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Chip, 
  IconButton, 
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { GroupMember, GroupService } from '../../services/group.service';
import { useUserAuth } from '../context/UserAuthContext';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

interface GroupMemberListProps {
  members: GroupMember[];
  groupId: string;
  onMembersChange?: () => void;
}

const GroupMemberList: React.FC<GroupMemberListProps> = ({ members, groupId, onMembersChange }) => {
  const { user } = useUserAuth();
  const currentUserId = user?.uid || user?.email;
  const currentUser = members.find(m => m.id === currentUserId);
  const isAdmin = currentUser?.role === 'admin';
  const groupService = new GroupService();

  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [newRole, setNewRole] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async () => {
    if (!selectedMember || !newRole) return;
    setLoading(true);
    try {
      const oldRole = selectedMember.role;
      await groupService.changeRole(groupId, selectedMember.id, newRole);
      
      // Add activity log
      await groupService.addActivity(groupId, {
        type: 'role_changed',
        user: {
          id: user?.uid || user?.email || '',
          name: user?.displayName || user?.email || 'Unknown User'
        },
        details: {
          targetUser: selectedMember.name,
          oldRole,
          newRole
        }
      });
      
      setSnackbarMessage(`Role updated for ${selectedMember.name}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      if (onMembersChange) onMembersChange();
    } catch (error) {
      console.error('Error changing role:', error);
      setSnackbarMessage('Failed to change role. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setOpenRoleDialog(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    setLoading(true);
    try {
      await groupService.removeMember(groupId, selectedMember.id);
      
      // Add activity log
      await groupService.addActivity(groupId, {
        type: 'member_removed',
        user: {
          id: user?.uid || user?.email || '',
          name: user?.displayName || user?.email || 'Unknown User'
        },
        details: {
          removedUser: selectedMember.name,
          removedUserEmail: selectedMember.email
        }
      });
      
      setSnackbarMessage(`${selectedMember.name} removed from group`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      if (onMembersChange) onMembersChange();
    } catch (error) {
      console.error('Error removing member:', error);
      setSnackbarMessage('Failed to remove member. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setOpenRemoveDialog(false);
    }
  };

  return (
    <List>
      {members.map((m) => (
        <ListItem key={m.id} secondaryAction={
          isAdmin && m.role !== 'admin' && m.id !== currentUserId ? (
            <>
              <Tooltip title="Change Role"><IconButton edge="end" onClick={() => { setSelectedMember(m); setNewRole(m.role); setOpenRoleDialog(true); }}><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Remove Member"><IconButton edge="end" color="error" onClick={() => { setSelectedMember(m); setOpenRemoveDialog(true); }}><RemoveCircleOutlineIcon /></IconButton></Tooltip>
            </>
          ) : null
        }>
          <ListItemAvatar>
            <Avatar>{m.name?.[0] || '?'}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={m.name}
            secondary={m.email || ''}
          />
          <Chip label={m.role} color={m.role === 'admin' ? 'primary' : 'default'} size="small" sx={{ ml: 2 }} />
        </ListItem>
      ))}
      
      {/* Role Change Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)}>
        <DialogTitle>Change Role for {selectedMember?.name}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleRoleChange} variant="contained" disabled={loading}>Change Role</Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={openRemoveDialog} onClose={() => setOpenRemoveDialog(false)}>
        <DialogTitle>Remove Member</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>{selectedMember?.name}</strong> from this group?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleRemoveMember} variant="contained" color="error" disabled={loading}>
            Remove Member
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
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </List>
  );
};

export default GroupMemberList;
