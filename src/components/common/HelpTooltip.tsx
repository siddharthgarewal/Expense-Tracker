import React from 'react';
import { Tooltip, IconButton, useTheme } from '@mui/material';
import { Help as HelpIcon, Info as InfoIcon } from '@mui/icons-material';

interface HelpTooltipProps {
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  icon?: 'help' | 'info';
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  placement = 'top',
  icon = 'help',
  size = 'small',
  ariaLabel,
}) => {
  const theme = useTheme();

  const IconComponent = icon === 'help' ? HelpIcon : InfoIcon;

  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(55, 65, 81, 0.95)' 
            : 'rgba(17, 24, 39, 0.95)',
          color: '#ffffff',
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: '12px 16px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          maxWidth: '300px',
          lineHeight: 1.5,
        },
        '& .MuiTooltip-arrow': {
          color: theme.palette.mode === 'dark' 
            ? 'rgba(55, 65, 81, 0.95)' 
            : 'rgba(17, 24, 39, 0.95)',
        },
      }}
    >
      <IconButton
        size={size}
        aria-label={ariaLabel || `Help: ${title}`}
        sx={{
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.6)' 
            : 'rgba(0, 0, 0, 0.6)',
          '&:hover': {
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.04)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.2s ease',
          ml: 0.5,
        }}
      >
        <IconComponent fontSize={size} />
      </IconButton>
    </Tooltip>
  );
};

export default HelpTooltip;
