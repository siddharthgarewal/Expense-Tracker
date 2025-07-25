import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import type { SelectChangeEvent } from "@mui/material/Select";

interface PayerSelectorProps {
  participants: { id: string; name: string; email?: string }[];
  payerId: string;
  setPayerId: (id: string) => void;
  error?: boolean;
  helperText?: string;
}

const PayerSelector: React.FC<PayerSelectorProps> = ({
  participants,
  payerId,
  setPayerId,
  error = false,
  helperText = "",
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    if (!value) {
      enqueueSnackbar("Please select who paid for the expense.", { variant: "warning" });
      setPayerId("");
      return;
    }
    setPayerId(value);
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
        Who paid?
      </Typography>
      <FormControl fullWidth error={error} sx={{
        '& .MuiInputLabel-root': {
          color: theme.palette.text.primary,
          background: 'transparent',
          fontWeight: 500,
          zIndex: 2,
          padding: '0 4px',
          transition: 'color 0.2s',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: theme.palette.primary.main,
          background: theme.palette.mode === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.9)',
          borderRadius: '4px',
          padding: '0 4px',
        },
        '& .MuiSelect-select': {
          color: theme.palette.text.primary,
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
          borderRadius: '12px',
          padding: '16.5px 14px',
          fontSize: '1rem',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(0,0,0,0.23)',
        },
      }}>
        <InputLabel id="payer-label">Payer</InputLabel>
        <Select
          labelId="payer-label"
          id="payer"
          value={payerId}
          onChange={handleChange}
          label="Payer"
          sx={{
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
            borderRadius: '12px',
            color: theme.palette.text.primary,
          }}
        >
          <MenuItem value="">
            <em>Select payer</em>
          </MenuItem>
          {participants.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name} {p.email ? `(${p.email})` : ""}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default PayerSelector; 