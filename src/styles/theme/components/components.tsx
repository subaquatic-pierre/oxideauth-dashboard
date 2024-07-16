import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';
import { MuiAvatar } from './avatar';
import { MuiButton } from './button';
import { MuiCard } from './card';
import { MuiCardContent } from './cardContent';
import { MuiCardHeader } from './cardHeader';
import { MuiLink } from './link';
import { MuiStack } from './stack';
import { MuiTab } from './tab';
import { MuiTableBody } from './tableBody';
import { MuiTableCell } from './tableCell';
import { MuiTableHead } from './tableHead';

export const components = {
  MuiAvatar,
  MuiButton,
  MuiCard,
  MuiCardContent,
  MuiCardHeader,
  MuiLink,
  MuiStack,
  MuiTab,
  MuiTableBody,
  MuiTableCell,
  MuiTableHead,
} satisfies Components<Theme>;
