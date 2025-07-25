import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';

interface Participant {
  id: string;
  name: string;
  email?: string;
}

interface SplitDetail extends Participant {
  amount?: number;
  percentage?: number;
}

interface Debt {
  from: string;
  to: string;
  amount: number;
  settled: boolean;
  settledAt?: string;
  settledBy?: string;
  note?: string;
}

interface DebtSummaryProps {
  participants: Participant[];
  splitDetails: SplitDetail[];
  payerId: string;
  currency: string;
  debtsFromBackend?: Debt[];
  onSettle?: (debt: Debt) => void;
  currentUserId?: string;
}

const getParticipant = (participants: Participant[], id: string) =>
  participants.find(p => p.id === id) || { id, name: id };

function calculateDebts(participants: Participant[], splitDetails: SplitDetail[], payerId: string, debtsFromBackend?: Debt[]): Debt[] {
  const payer = getParticipant(participants, payerId);
  const debts: Debt[] = [];
  splitDetails.forEach(p => {
    if (p.id !== payerId && p.amount && p.amount > 0) {
      const backendDebt = debtsFromBackend?.find(d => d.from === p.id && d.to === payerId);
      debts.push({
        from: p.id,
        to: payerId,
        amount: p.amount,
        settled: backendDebt ? backendDebt.settled : false,
        settledAt: backendDebt?.settledAt,
        settledBy: backendDebt?.settledBy,
        note: backendDebt?.note,
      });
    }
  });
  return debts;
}

// Utility to get initials for avatar
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const DebtSummary: React.FC<DebtSummaryProps> = ({ participants, splitDetails, payerId, currency, debtsFromBackend, onSettle, currentUserId }) => {
  const [settleDialog, setSettleDialog] = useState<{ open: boolean; debt: Debt | null }>({ open: false, debt: null });
  const [localDebts, setLocalDebts] = useState<Debt[]>(() => calculateDebts(participants, splitDetails, payerId, debtsFromBackend));
  const [settleNote, setSettleNote] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    setLocalDebts(calculateDebts(participants, splitDetails, payerId, debtsFromBackend));
  }, [participants, splitDetails, payerId, debtsFromBackend]);

  // Filter debts to only those involving the current user
  const relevantDebts = currentUserId
    ? localDebts.filter(d => d.from === currentUserId || d.to === currentUserId)
    : localDebts;

  // Calculate analytics for the current user
  let totalOwed = 0, totalLent = 0;
  if (currentUserId) {
    relevantDebts.forEach(debt => {
      if (!debt.settled) {
        if (debt.from === currentUserId) totalOwed += debt.amount;
        if (debt.to === currentUserId) totalLent += debt.amount;
      }
    });
  }
  const netBalance = totalLent - totalOwed;

  const handleSettleClick = (debt: Debt) => {
    setSettleDialog({ open: true, debt });
    setSettleNote('');
  };

  const handleSettleConfirm = () => {
    if (settleDialog.debt) {
      const updatedDebts = localDebts.map(d =>
        d.from === settleDialog.debt!.from && d.to === settleDialog.debt!.to
          ? { ...d, settled: true, note: settleNote, settledAt: new Date().toISOString(), settledBy: currentUserId }
          : d
      );
      setLocalDebts(updatedDebts);
      if (onSettle) onSettle({ ...settleDialog.debt, settled: true, note: settleNote, settledAt: new Date().toISOString(), settledBy: currentUserId });
      // Show notification for the current user
      if (currentUserId === settleDialog.debt.from) {
        enqueueSnackbar(`You have settled your debt to ${displayName(settleDialog.debt.to)}!`, { variant: 'success' });
      } else if (currentUserId === settleDialog.debt.to) {
        enqueueSnackbar(`${displayName(settleDialog.debt.from)} has settled their debt to you!`, { variant: 'info' });
      }
    }
    setSettleDialog({ open: false, debt: null });
    setSettleNote('');
  };

  const handleSettleCancel = () => {
    setSettleDialog({ open: false, debt: null });
    setSettleNote('');
  };

  const displayName = (id: string) => {
    if (!currentUserId) return getParticipant(participants, id).name;
    return id === currentUserId ? 'You' : getParticipant(participants, id).name;
  };

  return (
    <Box sx={{ mt: 3, mb: 2, p: 2, background: 'rgba(102,126,234,0.07)', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Debt Summary
      </Typography>
      {currentUserId && (
        <Box sx={{ mb: 2, p: 1, background: 'rgba(102,126,234,0.13)', borderRadius: 1, display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Total Owed:</strong> {currency} {totalOwed.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Total Lent:</strong> {currency} {totalLent.toFixed(2)}
          </Typography>
          <Typography variant="body2" color={netBalance >= 0 ? 'success.main' : 'error.main'}>
            <strong>Net Balance:</strong> {currency} {netBalance.toFixed(2)}
          </Typography>
        </Box>
      )}
      {relevantDebts.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No debts to show.</Typography>
      ) : (
        <List>
          {relevantDebts.map((debt, idx) => {
            const fromName = displayName(debt.from);
            const toName = displayName(debt.to);
            const fromColor = debt.from === currentUserId ? 'primary.main' : 'secondary.main';
            const toColor = debt.to === currentUserId ? 'primary.main' : 'secondary.main';
            const isOwed = debt.to === currentUserId;
            const isYouOwe = debt.from === currentUserId;
            return (
              <React.Fragment key={debt.from + '-' + debt.to}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    background: debt.settled
                      ? 'rgba(72,187,120,0.08)'
                      : isOwed
                        ? 'rgba(72,187,120,0.13)'
                        : isYouOwe
                          ? 'rgba(245,101,101,0.13)'
                          : 'transparent',
                    borderRadius: 2,
                    mb: 1,
                  }}
                  secondaryAction={
                    !debt.settled && (
                      <Button variant="outlined" color="success" size="small" onClick={() => handleSettleClick(debt)}>
                        Settle Up
                      </Button>
                    )
                  }
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 120 }}>
                    <Avatar sx={{ bgcolor: fromColor, width: 36, height: 36, fontWeight: 700 }}>
                      {getInitials(fromName)}
                    </Avatar>
                    <Avatar sx={{ bgcolor: toColor, width: 36, height: 36, fontWeight: 700 }}>
                      {getInitials(toName)}
                    </Avatar>
                  </Stack>
                  <ListItemText
                    sx={{ ml: 2 }}
                    primary={
                      debt.settled
                        ? (
                          <span style={{ color: '#48bb78', fontWeight: 600 }}>
                            {fromName} has settled up with {toName} ({currency} {debt.amount.toFixed(2)})
                          </span>
                        )
                        : isOwed
                          ? (
                            <span style={{ color: '#48bb78', fontWeight: 600 }}>
                              {fromName} owes <b>you</b> {currency} {debt.amount.toFixed(2)}
                            </span>
                          )
                          : isYouOwe
                            ? (
                              <span style={{ color: '#e53e3e', fontWeight: 600 }}>
                                You owe {toName} {currency} {debt.amount.toFixed(2)}
                              </span>
                            )
                            : `${fromName} owes ${toName} ${currency} ${debt.amount.toFixed(2)}`
                    }
                    secondary={
                      debt.settled && (debt.note || debt.settledAt)
                        ? [
                            debt.note ? `Note: ${debt.note}` : null,
                            debt.settledAt ? `Settled at: ${new Date(debt.settledAt).toLocaleString()}` : null
                          ].filter(Boolean).join(' | ')
                        : undefined
                    }
                  />
                </ListItem>
                {idx < relevantDebts.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      )}
      <Dialog open={settleDialog.open} onClose={handleSettleCancel}>
        <DialogTitle>Settle Up</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this debt as settled?
          </Typography>
          <TextField
            label="Add a note (optional)"
            value={settleNote}
            onChange={e => setSettleNote(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettleCancel}>Cancel</Button>
          <Button onClick={handleSettleConfirm} color="success" variant="contained">Settle</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DebtSummary; 