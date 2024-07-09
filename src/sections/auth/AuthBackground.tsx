'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// project import
import { ThemeDirection, ThemeMode } from 'config';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(8px)',
        zIndex: -1,
        bottom: '10%',
        right: '10%',
        transform: theme.direction === ThemeDirection.RTL ? 'rotate(180deg)' : 'inherit'
      }}
    >
      <img src="/assets/brand/logoNoText.svg" />
    </Box>
  );
}
