import * as React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

import { paths } from '@/paths';

export interface Props {
  sx?: SxProps;
  value: string;
  heading: string;
  icon: React.ReactElement;
  color: string;
  link: string;
}

export default function InfoCard({ value, heading, icon, color, link, sx }: Props): React.JSX.Element {
  return (
    <Card sx={{ minHeight: 150, ...sx }}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {heading}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar sx={{ backgroundColor: color, height: '56px', width: '56px', fontSize: '1.5rem' }}>{icon}</Avatar>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRight />} size="small" variant="text" LinkComponent={Link} href={link}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
