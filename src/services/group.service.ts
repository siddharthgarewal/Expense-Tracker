import { db } from '../firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  where,
  Timestamp
} from '@firebase/firestore';

export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  role: string;
}

export interface GroupActivity {
  type: string;
  user: { id: string; name: string };
  timestamp?: any;
  details?: any;
}

export interface GroupInvitation {
  id?: string;
  groupId: string;
  groupName: string;
  inviterName: string;
  inviterEmail: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: any;
  expiresAt: any;
  role: string;
}

export class GroupService {
  groupRef = collection(db, 'groups');

  async createGroup(data: any): Promise<string> {
    const memberIds = (data.members || []).map((m: GroupMember) => m.id);
    const groupData = {
      ...data,
      createdAt: Timestamp.now(),
      members: data.members || [],
      memberIds,
    };
    const docRef = await addDoc(this.groupRef, groupData);
    return docRef.id;
  }

  async joinGroup(groupId: string, user: GroupMember): Promise<void> {
    const groupDoc = doc(this.groupRef, groupId);
    await updateDoc(groupDoc, {
      members: arrayUnion(user),
      memberIds: arrayUnion(user.id),
    });
  }

  async updateGroup(groupId: string, data: Partial<any>): Promise<void> {
    const groupDoc = doc(this.groupRef, groupId);
    await updateDoc(groupDoc, data);
  }

  async addMember(groupId: string, user: GroupMember, role: string): Promise<void> {
    const groupDoc = doc(this.groupRef, groupId);
    const member = { ...user, role };
    await updateDoc(groupDoc, {
      members: arrayUnion(member),
      memberIds: arrayUnion(user.id),
    });
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    const groupDoc = doc(this.groupRef, groupId);
    const groupSnap = await getDoc(groupDoc);
    if (!groupSnap.exists()) throw new Error('Group not found');
    const group = groupSnap.data();
    const updatedMembers = (group.members || []).filter((m: GroupMember) => m.id !== userId);
    const updatedMemberIds = (group.memberIds || []).filter((id: string) => id !== userId);
    await updateDoc(groupDoc, { members: updatedMembers, memberIds: updatedMemberIds });
  }

  async changeRole(groupId: string, userId: string, newRole: string): Promise<void> {
    const groupDoc = doc(this.groupRef, groupId);
    const groupSnap = await getDoc(groupDoc);
    if (!groupSnap.exists()) throw new Error('Group not found');
    const group = groupSnap.data();
    const updatedMembers = (group.members || []).map((m: GroupMember) => m.id === userId ? { ...m, role: newRole } : m);
    await updateDoc(groupDoc, { members: updatedMembers });
  }

  async getGroupsForUser(userId: string): Promise<any[]> {
    const q = query(this.groupRef, where('memberIds', 'array-contains', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  async getGroupById(groupId: string): Promise<any> {
    const groupDoc = doc(this.groupRef, groupId);
    const groupSnap = await getDoc(groupDoc);
    if (!groupSnap.exists()) throw new Error('Group not found');
    return { ...groupSnap.data(), id: groupId };
  }

  async addActivity(groupId: string, activity: GroupActivity): Promise<void> {
    const activityRef = collection(db, 'groups', groupId, 'activityFeed');
    await addDoc(activityRef, {
      ...activity,
      timestamp: Timestamp.now(),
    });
  }

  // Invitation methods
  async sendInvitation(
    groupId: string,
    inviteeEmail: string,
    inviterName: string,
    inviterEmail: string,
    role: string = 'member'
  ): Promise<string> {
    const group = await this.getGroupById(groupId);
    if (!group) throw new Error('Group not found');

    // Check if user is already a member
    const existingMember = group.members?.find((m: GroupMember) => m.email === inviteeEmail);
    if (existingMember) {
      throw new Error('User is already a member of this group');
    }

    // Check if there's already a pending invitation
    const invitationsRef = collection(db, 'invitations');
    const existingInvitationQuery = query(
      invitationsRef,
      where('groupId', '==', groupId),
      where('inviteeEmail', '==', inviteeEmail),
      where('status', '==', 'pending')
    );
    const existingInvitations = await getDocs(existingInvitationQuery);
    if (!existingInvitations.empty) {
      throw new Error('An invitation is already pending for this email');
    }

    const invitation: GroupInvitation = {
      groupId,
      groupName: group.name,
      inviterName,
      inviterEmail,
      inviteeEmail,
      status: 'pending',
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days
      role,
    };

    const docRef = await addDoc(invitationsRef, invitation);
    
    // Add activity to group
    await this.addActivity(groupId, {
      type: 'member_invited',
      user: { id: inviterEmail, name: inviterName },
      details: { inviteeEmail, role }
    });

    return docRef.id;
  }

  async getInvitationsForUser(userEmail: string): Promise<GroupInvitation[]> {
    const invitationsRef = collection(db, 'invitations');
    const q = query(
      invitationsRef,
      where('inviteeEmail', '==', userEmail),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as GroupInvitation));
  }

  async getInvitationsForGroup(groupId: string): Promise<GroupInvitation[]> {
    const invitationsRef = collection(db, 'invitations');
    const q = query(
      invitationsRef,
      where('groupId', '==', groupId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as GroupInvitation));
  }

  async acceptInvitation(invitationId: string, user: { id: string; name: string; email: string }): Promise<void> {
    const invitationDoc = doc(db, 'invitations', invitationId);
    const invitationSnap = await getDoc(invitationDoc);
    
    if (!invitationSnap.exists()) {
      throw new Error('Invitation not found');
    }

    const invitation = invitationSnap.data() as GroupInvitation;
    
    if (invitation.status !== 'pending') {
      throw new Error('Invitation is no longer valid');
    }

    if (invitation.expiresAt.toDate() < new Date()) {
      await updateDoc(invitationDoc, { status: 'expired' });
      throw new Error('Invitation has expired');
    }

    // Add user to group
    await this.addMember(invitation.groupId, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: invitation.role
    }, invitation.role);

    // Update invitation status
    await updateDoc(invitationDoc, { status: 'accepted' });

    // Add activity to group
    await this.addActivity(invitation.groupId, {
      type: 'member_joined',
      user: { id: user.id, name: user.name },
      details: { email: user.email, role: invitation.role }
    });
  }

  async declineInvitation(invitationId: string): Promise<void> {
    const invitationDoc = doc(db, 'invitations', invitationId);
    await updateDoc(invitationDoc, { status: 'declined' });
  }

  async cancelInvitation(invitationId: string): Promise<void> {
    const invitationDoc = doc(db, 'invitations', invitationId);
    const invitationSnap = await getDoc(invitationDoc);
    
    if (!invitationSnap.exists()) {
      throw new Error('Invitation not found');
    }

    const invitation = invitationSnap.data() as GroupInvitation;
    await updateDoc(invitationDoc, { status: 'declined' });

    // Add activity to group
    await this.addActivity(invitation.groupId, {
      type: 'invitation_cancelled',
      user: { id: invitation.inviterEmail, name: invitation.inviterName },
      details: { inviteeEmail: invitation.inviteeEmail }
    });
  }
}
