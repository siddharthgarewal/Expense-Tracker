import React, { useState, useEffect } from 'react';
import { Box, ToggleButtonGroup, ToggleButton, TextField, Typography, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';

interface SplitParticipant {
  name: string;
  email?: string;
  amount?: number;
  percentage?: number;
}

interface SplitMethodSelectorProps {
  participants: SplitParticipant[];
  totalAmount: number;
  splitMethod: 'equal' | 'unequal' | 'percentage';
  onChange: (splitMethod: string, updatedParticipants: SplitParticipant[]) => void;
}

const SplitMethodSelector: React.FC<SplitMethodSelectorProps> = ({ participants, totalAmount, splitMethod, onChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [localMethod, setLocalMethod] = useState(splitMethod);
  const [splits, setSplits] = useState<SplitParticipant[]>(participants.map(p => ({ ...p })));

  useEffect(() => {
    setSplits(prev =>
      participants.length !== prev.length
        ? participants.map(p => ({ ...p }))
        : prev
    );
  }, [participants]);

  useEffect(() => {
    setLocalMethod(splitMethod);
  }, [splitMethod]);

  // Handle split method change
  const handleMethodChange = (_: any, newMethod: 'equal' | 'unequal' | 'percentage' | null) => {
    if (!newMethod) return;
    setLocalMethod(newMethod);
    let updatedSplits = splits.map(p => ({ ...p }));
    if (newMethod === 'equal') {
      const perPerson = Number((totalAmount / splits.length).toFixed(2));
      updatedSplits = splits.map(p => ({ ...p, amount: perPerson, percentage: undefined }));
    } else if (newMethod === 'percentage') {
      updatedSplits = splits.map(p => ({ ...p, percentage: 100 / splits.length, amount: Number((totalAmount / splits.length).toFixed(2)) }));
    } else {
      updatedSplits = splits.map(p => ({ ...p, amount: undefined, percentage: undefined }));
    }
    setSplits(updatedSplits);
    onChange(newMethod, updatedSplits);
  };

  // Handle custom amount/percentage change
  const handleSplitChange = (idx: number, field: 'amount' | 'percentage', value: number) => {
    const updated = splits.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    setSplits(updated);
    onChange(localMethod, updated);
  };

  // Validation for unequal/percentage splits
  useEffect(() => {
    if (localMethod === 'unequal') {
      const allFilled = splits.every(p => typeof p.amount === 'number' && !isNaN(p.amount));
      if (allFilled) {
        const sum = splits.reduce((acc, p) => acc + (p.amount || 0), 0);
        if (splits.length > 0 && Math.abs(sum - totalAmount) > 0.01) {
          enqueueSnackbar('Custom amounts must add up to total', { variant: 'warning' });
        }
      }
    } else if (localMethod === 'percentage') {
      const allFilled = splits.every(p => typeof p.percentage === 'number' && !isNaN(p.percentage));
      if (allFilled) {
        const sum = splits.reduce((acc, p) => acc + (p.percentage || 0), 0);
        if (splits.length > 0 && Math.abs(sum - 100) > 0.01) {
          enqueueSnackbar('Percentages must add up to 100%', { variant: 'warning' });
        }
      }
    }
  }, [splits, localMethod, totalAmount, enqueueSnackbar]);

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Split Method</Typography>
      <ToggleButtonGroup
        value={localMethod}
        exclusive
        onChange={handleMethodChange}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="equal">Equal</ToggleButton>
        <ToggleButton value="unequal">Unequal</ToggleButton>
        <ToggleButton value="percentage">Percentage</ToggleButton>
      </ToggleButtonGroup>
      <Grid container spacing={1}>
        {splits.map((p, idx) => (
          <Grid item xs={12} sm={6} md={4} key={p.name + p.email}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ minWidth: 80 }}>{p.name}</Typography>
              {localMethod === 'equal' && (
                <TextField
                  label="Amount"
                  value={p.amount?.toFixed(2) || ''}
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              )}
              {localMethod === 'unequal' && (
                <TextField
                  label="Amount"
                  type="number"
                  value={p.amount ?? ''}
                  onChange={e => handleSplitChange(idx, 'amount', Number(e.target.value))}
                  size="small"
                />
              )}
              {localMethod === 'percentage' && (
                <>
                  <TextField
                    label="%"
                    type="number"
                    value={p.percentage ?? ''}
                    onChange={e => handleSplitChange(idx, 'percentage', Number(e.target.value))}
                    size="small"
                  />
                  <TextField
                    label="Amount"
                    value={((p.percentage || 0) * totalAmount / 100).toFixed(2)}
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SplitMethodSelector; 