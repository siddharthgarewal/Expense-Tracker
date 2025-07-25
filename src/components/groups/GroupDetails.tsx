import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, CircularProgress, Paper } from '@mui/material';
import { GroupService, GroupMember } from '../../services/group.service';
import { useUserAuth } from '../context/UserAuthContext';
import GroupMemberList from './GroupMemberList';
import InviteMemberForm from './InviteMemberForm';
import PendingInvitations from './PendingInvitations';
import EditGroupForm from './EditGroupForm';
const groupService = new GroupService();

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useUserAuth();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if current user is admin
  const currentUserId = user?.uid || user?.email;
  const currentUser = group?.members?.find((m: GroupMember) => m.id === currentUserId);
  const isAdmin = currentUser?.role === 'admin';

  const fetchGroup = useCallback(() => {
    if (groupId) {
      setLoading(true);
      groupService.getGroupById(groupId)
        .then(g => setGroup(g))
        .finally(() => setLoading(false));
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (!group) return <Box sx={{ textAlign: 'center', mt: 8 }}><Typography variant="h6">Group not found</Typography></Box>;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      
      <Paper sx={{ p: 4, borderRadius: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 64, height: 64, fontSize: 40, bgcolor: 'primary.main', mr: 3 }}>{group.icon || group.name?.[0] || '?'}</Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight={700}>{group.name}</Typography>
            <Typography variant="body1" color="text.secondary">{group.description || 'No description'}</Typography>
          </Box>
          {isAdmin && (
            <EditGroupForm 
              group={group}
              onGroupUpdated={fetchGroup}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>Members</Typography>
          {isAdmin && (
            <InviteMemberForm 
              groupId={groupId!}
              onInvitationSent={fetchGroup}
            />
          )}
        </Box>
        <GroupMemberList 
          members={group.members || []} 
          groupId={groupId!} 
          onMembersChange={fetchGroup}
        />
        
        {/* Pending Invitations */}
        <PendingInvitations 
          groupId={groupId!}
          isAdmin={isAdmin}
          onInvitationUpdate={fetchGroup}
        />
      </Paper>
    </Box>
  );
};

export default GroupDetails; 