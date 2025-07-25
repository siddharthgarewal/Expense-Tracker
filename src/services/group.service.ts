import { db } from '../firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  setDoc,
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
} 