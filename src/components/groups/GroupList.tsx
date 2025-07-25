import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Avatar, Box } from '@mui/material';
import { GroupService } from '../../services/group.service';
import { useUserAuth } from '../context/UserAuthContext';
import CreateGroupForm from './CreateGroupForm';
import { useNavigate } from 'react-router-dom';

const groupService = new GroupService();

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const loadGroups = () => {
    if (user) {
      const userId = user.uid ?? user.email;
      if (userId) {
        groupService.getGroupsForUser(userId).then(setGroups);
      }
    }
  };

  useEffect(() => {
    loadGroups();
    // eslint-disable-next-line
  }, [user]);

  return (
    <Box sx={{ maxWidth: 900, margin: '0 auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>My Groups</Typography>
        <Button variant="contained" color="primary" onClick={() => setCreateOpen(true)}>Create Group</Button>
      </Box>
      <Grid container spacing={3}>
        {groups.map(group => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card
              sx={{ borderRadius: 3, boxShadow: 3, cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{group.icon || group.name?.[0] || '?'}</Avatar>
                  <Typography variant="h6">{group.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {group.description || 'No description'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {group.members?.length || 0} members
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <CreateGroupForm open={createOpen} onClose={() => setCreateOpen(false)} onCreated={loadGroups} />
    </Box>
  );
};

export default GroupList; 