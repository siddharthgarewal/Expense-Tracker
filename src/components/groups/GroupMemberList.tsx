import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, IconButton, Tooltip } from '@mui/material';
import { GroupMember } from '../../services/group.service';
import { useUserAuth } from '../context/UserAuthContext';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

interface GroupMemberListProps {
  members: GroupMember[];
}

const GroupMemberList: React.FC<GroupMemberListProps> = ({ members }) => {
  const { user } = useUserAuth();
  const currentUserId = user?.uid || user?.email;
  const currentUser = members.find(m => m.id === currentUserId);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <List>
      {members.map((m) => (
        <ListItem key={m.id} secondaryAction={
          isAdmin && m.role !== 'admin' ? (
            <>
              <Tooltip title="Change Role (coming soon)"><IconButton edge="end"><EditIcon /></IconButton></Tooltip>
              <Tooltip title="Remove Member (coming soon)"><IconButton edge="end" color="error"><RemoveCircleOutlineIcon /></IconButton></Tooltip>
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
    </List>
  );
};

export default GroupMemberList; 