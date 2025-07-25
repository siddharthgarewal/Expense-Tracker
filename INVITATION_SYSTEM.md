# Group Member Invitation System

This document describes the email-based member invitation system that has been added to the expense tracker application.

## Overview

The invitation system allows group administrators to invite new members to their groups via email. Invited users can accept or decline invitations through the application interface.

## Components

### 1. Backend Service (`GroupService`)

**New Methods Added:**
- `sendInvitation()` - Send an invitation to a user by email
- `getInvitationsForUser()` - Get pending invitations for a user
- `getInvitationsForGroup()` - Get all invitations for a group
- `acceptInvitation()` - Accept a pending invitation
- `declineInvitation()` - Decline a pending invitation
- `cancelInvitation()` - Cancel a pending invitation (admin only)

**Data Structure:**
```typescript
interface GroupInvitation {
  id?: string;
  groupId: string;
  groupName: string;
  inviterName: string;
  inviterEmail: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Timestamp;
  expiresAt: Timestamp; // 7 days from creation
  role: string; // 'member' or 'admin'
}
```

### 2. UI Components

#### InviteMemberForm
- **Location:** `src/components/groups/InviteMemberForm.tsx`
- **Purpose:** Allows group admins to send invitations
- **Features:**
  - Email validation
  - Role selection (member/admin)
  - Duplicate invitation prevention
  - User feedback via snackbars

#### PendingInvitations
- **Location:** `src/components/groups/PendingInvitations.tsx`
- **Purpose:** Displays pending invitations for group admins
- **Features:**
  - Collapsible list of pending invitations
  - Shows invitation details (email, role, expiration)
  - Allows cancellation of pending invitations

#### InvitationNotifications
- **Location:** `src/components/groups/InvitationNotifications.tsx`
- **Purpose:** Shows invitation notifications in the header
- **Features:**
  - Badge notification with count
  - Dropdown showing all pending invitations
  - Accept/decline functionality
  - Confirmation dialogs

### 3. Integration Points

#### GroupDetails Page
- Added invite button for admins
- Shows pending invitations section
- Refreshes group data after invitation actions

#### Header Component
- Added InvitationNotifications component
- Shows badge with invitation count
- Accessible from all pages when logged in

## Features

### For Group Administrators:
1. **Send Invitations:**
   - Click the "+" button on the group details page
   - Enter email address and select role
   - System validates email and prevents duplicates

2. **Manage Pending Invitations:**
   - View all pending invitations in collapsible section
   - See invitation details and expiration time
   - Cancel invitations if needed

### For Invited Users:
1. **View Invitations:**
   - Notification badge appears in header
   - Click to see all pending invitations
   - Shows group name, inviter, role, and expiration

2. **Respond to Invitations:**
   - Accept invitation to join group
   - Decline invitation (can be re-invited later)
   - Automatic handling of expired invitations

### Security Features:
- Email validation on frontend
- Duplicate invitation prevention
- Invitation expiration (7 days)
- Role-based permissions (only admins can invite)
- Automatic cleanup of expired invitations

## Database Structure

### Collections:
1. **invitations** (new collection)
   - Stores all invitation documents
   - Indexed by groupId and inviteeEmail
   - Automatic expiration after 7 days

2. **groups/{groupId}/activityFeed** (enhanced)
   - Tracks invitation-related activities
   - Types: 'member_invited', 'member_joined', 'invitation_cancelled'

## Usage Flow

### Sending an Invitation:
1. Admin navigates to group details page
2. Clicks the invite member button
3. Enters email and selects role
4. System creates invitation document
5. Adds activity to group feed
6. Shows success/error message

### Accepting an Invitation:
1. User sees notification badge in header
2. Clicks to view pending invitations
3. Clicks "Accept" on desired invitation
4. Confirms action in dialog
5. System adds user to group
6. Updates invitation status
7. Adds activity to group feed

### Technical Implementation:

**Firestore Rules Required:**
```javascript
// Allow users to read their own invitations
match /invitations/{invitationId} {
  allow read: if request.auth != null && 
    resource.data.inviteeEmail == request.auth.token.email;
  allow write: if request.auth != null;
}
```

**Email Integration (Future Enhancement):**
- Consider adding email notifications for invitations
- Could use Firebase Functions to send emails
- Include invitation links for direct access

## Error Handling

The system handles various error conditions:
- Invalid email addresses
- Duplicate invitations
- Expired invitations
- Network errors
- Permission errors

All errors are displayed to users via snackbar notifications with appropriate messages.

## Future Enhancements

1. **Email Notifications:**
   - Send actual emails to invited users
   - Include direct links to accept/decline

2. **Invitation Links:**
   - Generate unique invitation URLs
   - Allow joining without login if email matches

3. **Bulk Invitations:**
   - Support inviting multiple users at once
   - CSV import functionality

4. **Advanced Permissions:**
   - More granular role definitions
   - Custom permission settings per group

5. **Invitation Templates:**
   - Customizable invitation messages
   - Group-specific branding
