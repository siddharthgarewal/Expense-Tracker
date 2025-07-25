import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Button,
  Collapse
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  GroupAdd as GroupAddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { GroupService, GroupActivity } from '../../services/group.service';
import { collection, getDocs, query, orderBy, limit } from '@firebase/firestore';
import { db } from '../../firebase';

interface GroupActivityFeedProps {
  groupId: string;
  isAdmin: boolean;
}

interface ActivityWithId extends GroupActivity {
  id?: string;
}

const GroupActivityFeed: React.FC<GroupActivityFeedProps> = ({ groupId, isAdmin }) => {
  const [activities, setActivities] = useState<ActivityWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const activityRef = collection(db, 'groups', groupId, 'activityFeed');
      const q = query(activityRef, orderBy('timestamp', 'desc'), limit(showAll ? 50 : 10));
      const snapshot = await getDocs(q);
      
      const activitiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GroupActivity & { id: string }));
      
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchActivities();
    }
  }, [groupId, expanded, showAll]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member_invited':
        return <EmailIcon color="info" />;
      case 'member_joined':
        return <PersonAddIcon color="success" />;
      case 'member_removed':
        return <PersonRemoveIcon color="error" />;
      case 'member_left':
        return <PersonRemoveIcon color="warning" />;
      case 'role_changed':
        return <AdminIcon color="primary" />;
      case 'group_created':
        return <GroupAddIcon color="success" />;
      case 'group_updated':
        return <EditIcon color="info" />;
      case 'invitation_cancelled':
        return <CancelIcon color="warning" />;
      default:
        return <EditIcon color="action" />;
    }
  };

  const getActivityColor = (type: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (type) {
      case 'member_invited':
        return 'info';
      case 'member_joined':
        return 'success';
      case 'member_removed':
      case 'member_left':
        return 'error';
      case 'role_changed':
        return 'primary';
      case 'group_created':
        return 'success';
      case 'group_updated':
        return 'info';
      case 'invitation_cancelled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatActivityText = (activity: GroupActivity) => {
    const { type, user, details } = activity;
    const userName = user.name || 'Unknown User';

    switch (type) {
      case 'member_invited':
        return {
          primary: `${userName} invited ${details?.inviteeEmail}`,
          secondary: `Role: ${details?.role || 'member'}`
        };
      case 'member_joined':
        return {
          primary: `${userName} joined the group`,
          secondary: `Role: ${details?.role || 'member'}`
        };
      case 'member_removed':
        return {
          primary: `${userName} was removed from the group`,
          secondary: details?.reason ? `Reason: ${details.reason}` : undefined
        };
      case 'member_left':
        return {
          primary: `${userName} left the group`,
          secondary: undefined
        };
      case 'role_changed':
        return {
          primary: `${userName}'s role was changed`,
          secondary: `From ${details?.oldRole} to ${details?.newRole}`
        };
      case 'group_created':
        return {
          primary: `${userName} created the group`,
          secondary: undefined
        };
      case 'group_updated':
        return {
          primary: `${userName} updated group settings`,
          secondary: details?.changes ? `Changed: ${details.changes.join(', ')}` : undefined
        };
      case 'invitation_cancelled':
        return {
          primary: `${userName} cancelled invitation`,
          secondary: `For: ${details?.inviteeEmail}`
        };
      default:
        return {
          primary: `${userName} performed an action`,
          secondary: type
        };
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 168) { // 7 days
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          mb: 1
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ flexGrow: 1 }}>
          Recent Activity
        </Typography>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      <Collapse in={expanded}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : activities.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No recent activity
              </Typography>
            </Box>
          ) : (
            <>
              <List dense>
                {activities.map((activity, index) => {
                  const { primary, secondary } = formatActivityText(activity);
                  
                  return (
                    <React.Fragment key={activity.id || index}>
                      <ListItem sx={{ py: 1 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                {primary}
                              </Typography>
                              <Chip
                                label={activity.type.replace('_', ' ')}
                                size="small"
                                color={getActivityColor(activity.type)}
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              {secondary && (
                                <Typography variant="caption" color="text.secondary">
                                  {secondary}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {formatTimestamp(activity.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  );
                })}
              </List>
              
              {activities.length >= 10 && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                  <Button
                    size="small"
                    onClick={() => setShowAll(!showAll)}
                    disabled={loading}
                  >
                    {showAll ? 'Show Less' : 'Show More Activities'}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Collapse>
    </Box>
  );
};

export default GroupActivityFeed;
