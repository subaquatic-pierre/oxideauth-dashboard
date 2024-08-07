'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { paths } from 'paths';
import { accountClient } from 'lib/api/account';

interface Props {
  handleSubmit: () => void;
  openDeleteDialog: () => void;
}
const SettingsFormButtons: React.FC<Props> = ({ handleSubmit, openDeleteDialog }) => {
  const { user: accountId } = useParams();

  const isExisting = accountId !== 'new';
  return (
    <Card>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => openDeleteDialog()} color="error" variant="contained">
          Delete Account
        </Button>
        <Button onClick={() => handleSubmit()} variant="contained">
          {isExisting ? 'Save details' : 'Create new'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default SettingsFormButtons;
