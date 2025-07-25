import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Avatar, Box } from '@mui/material';
import { GroupService } from '../../services/group.service';
import { useUserAuth } from '../context/UserAuthContext';

interface CreateGroupFormProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (groupId: string) => void;
}

const groupService = new GroupService();

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUserAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;
    setLoading(true);
    const currentUser = {
      id: user.uid || user.email,
      name: user.displayName || user.email,
      email: user.email,
      role: 'admin',
    };
    const groupData = {
      name: name.trim(),
      icon: icon.trim(),
      description: description.trim(),
      members: [currentUser],
      createdBy: currentUser.id,
    };
    try {
      const groupId = await groupService.createGroup(groupData);
      setName(''); setIcon(''); setDescription('');
      if (onCreated) onCreated(groupId);
      onClose();
    } catch (err) {
      // Optionally show error
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create Group</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 48, height: 48, fontSize: 32 }}>{icon || name[0] || '?'}</Avatar>
            <TextField
              label="Group Icon (emoji or letter)"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              inputProps={{ maxLength: 2 }}
              sx={{ width: 120 }}
            />
          </Box>
          <TextField
            label="Group Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || !name.trim()}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateGroupForm; 