import React, { useState } from 'react';
import { Box, TextField, Button, Chip, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

interface Participant {
  name: string;
  email?: string;
}

interface ParticipantSelectorProps {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
  currentUser: Participant;
}

const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({ participants, onChange, currentUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleAdd = () => {
    if (!name.trim()) {
      enqueueSnackbar('Name is required', { variant: 'warning' });
      return;
    }
    if (participants.some(p => p.name === name && (!email || p.email === email))) {
      enqueueSnackbar('Participant already added', { variant: 'info' });
      return;
    }
    onChange([...participants, { name, email: email.trim() || undefined }]);
    setName('');
    setEmail('');
  };

  const handleRemove = (idx: number) => {
    onChange(participants.filter((_, i) => i !== idx));
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Participants</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {/* Always show current user as participant, not removable */}
        <Chip label={currentUser.name + (currentUser.email ? ` (${currentUser.email})` : '')} color="primary" />
        {participants.filter(p => p.name !== currentUser.name || p.email !== currentUser.email).map((p, idx) => (
          <Chip
            key={p.name + p.email}
            label={p.name + (p.email ? ` (${p.email})` : '')}
            onDelete={() => handleRemove(idx)}
            deleteIcon={<DeleteIcon />}
            sx={{ background: 'rgba(102,126,234,0.08)' }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <TextField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          size="small"
        />
        <TextField
          label="Email (optional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleAdd} sx={{ minWidth: 100 }}>Add</Button>
      </Box>
    </Box>
  );
};

export default ParticipantSelector; 