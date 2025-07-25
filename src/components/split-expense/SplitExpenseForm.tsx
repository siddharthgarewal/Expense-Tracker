import React, { useState } from 'react';
import ParticipantSelector from './ParticipantSelector';
import SplitMethodSelector from './SplitMethodSelector';
import PayerSelector from './PayerSelector';
import DebtSummary from './DebtSummary';
import { useUserAuth } from '../context/UserAuthContext';

interface SplitParticipant {
  name: string;
  email?: string;
  amount?: number;
  percentage?: number;
  id?: string; // for payer selector
}

interface SplitExpenseFormProps {
  totalAmount: number;
  onChange: (data: any) => void;
}

// Utility to generate debts array
function generateDebts(splitDetails: SplitParticipant[], payerId: string) {
  return splitDetails
    .filter(p => p.id !== payerId && p.amount && p.amount > 0)
    .map(p => ({ from: p.id || '', to: payerId, amount: p.amount || 0, settled: false }));
}

const SplitExpenseForm: React.FC<SplitExpenseFormProps> = ({ totalAmount, onChange }) => {
  const { user } = useUserAuth();
  const currentUser = {
    name: user?.displayName || (user?.email ? user.email.split('@')[0] : 'You'),
    email: user?.email || undefined,
    id: user?.uid || user?.email || 'current',
  };

  const [participants, setParticipants] = useState<SplitParticipant[]>([]);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'unequal' | 'percentage'>('equal');
  const [splitDetails, setSplitDetails] = useState<SplitParticipant[]>([currentUser]);
  const [payerId, setPayerId] = useState<string>(currentUser.id);

  // Ensure current user is always in participants
  const allParticipants = [currentUser, ...participants.filter(p => (p.email || p.name) !== (currentUser.email || currentUser.name))].map((p, idx) => ({ ...p, id: p.id || p.email || p.name || String(idx), email: p.email || undefined }));

  // Update split details when participants or split method changes
  const handleSplitMethodChange = (method: string, updatedSplits: SplitParticipant[]) => {
    setSplitMethod(method as 'equal' | 'unequal' | 'percentage');
    setSplitDetails(updatedSplits);
    const debts = generateDebts(updatedSplits, payerId);
    onChange({ participants: allParticipants, splitMethod: method, splitDetails: updatedSplits, payerId, debts });
  };

  // Update participants
  const handleParticipantsChange = (newParticipants: SplitParticipant[]) => {
    setParticipants(newParticipants);
    // Reset split details to match new participants
    const updated = [currentUser, ...newParticipants].map((p, idx) => ({ ...p, id: p.id || p.email || p.name || String(idx), email: p.email || undefined }));
    setSplitDetails(updated);
    const debts = generateDebts(updated, payerId);
    onChange({ participants: updated, splitMethod, splitDetails: updated, payerId, debts });
  };

  // Update payer
  const handlePayerChange = (id: string) => {
    setPayerId(id);
    const debts = generateDebts(splitDetails, id);
    onChange({ participants: allParticipants, splitMethod, splitDetails, payerId: id, debts });
  };

  const currency = 'INR'; // fallback or get from props if available

  return (
    <div style={{ padding: 16, background: 'rgba(102,126,234,0.05)', borderRadius: 12 }}>
      <ParticipantSelector
        participants={participants}
        onChange={handleParticipantsChange}
        currentUser={currentUser}
      />
      <SplitMethodSelector
        participants={allParticipants}
        totalAmount={totalAmount}
        splitMethod={splitMethod}
        onChange={handleSplitMethodChange}
      />
      <PayerSelector
        participants={allParticipants}
        payerId={payerId}
        setPayerId={handlePayerChange}
      />
      <DebtSummary
        participants={allParticipants.map(p => ({ ...p, id: p.id || '' }))}
        splitDetails={splitDetails.map(p => ({ ...p, id: p.id || '' }))}
        payerId={payerId}
        currency={currency}
      />
    </div>
  );
};

export default SplitExpenseForm; 