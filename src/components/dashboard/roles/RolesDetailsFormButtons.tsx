'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { paths } from 'paths';

interface Props {
  handleSubmit: () => void;
}
const RolesDetailsFormButtons: React.FC<Props> = ({ handleSubmit }) => {
  const { role: roleId } = useParams();

  const isExisting = roleId !== 'new';
  return (
    <Card>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={() => handleSubmit()} variant="contained">
          {isExisting ? 'Save details' : 'Create new'}
        </Button>
        <Button LinkComponent={Link} href={paths.dashboard.roles} color="warning" variant="contained">
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
};

export default RolesDetailsFormButtons;
