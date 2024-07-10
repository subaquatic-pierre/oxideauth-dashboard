'use client';
// material-ui
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import useNotify from 'hooks/useNotify';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const notify = useNotify();
  return (
    <MainCard title="Sample Card">
      <Typography variant="body2">
        Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif ad
        minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
        reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa qui
        officiate descent molls anim id est labours.
      </Typography>
      <Button onClick={() => notify('CHANGE GHTE TTEXT HERER!!!', 'error')} variant="contained">
        CLICK
      </Button>
    </MainCard>
  );
}
