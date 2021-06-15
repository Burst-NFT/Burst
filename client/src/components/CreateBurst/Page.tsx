import Grid from '@material-ui/core/Grid';
import { SLayout, SHeading } from '../styles';
import { CreateBurstForm } from './CreateBurstForm';

function PageComponent() {
  return (
    <SLayout maxWidth='800px'>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <SHeading>CREATE A BURST</SHeading>
        </Grid>
        <Grid item xs={12}>
          <CreateBurstForm />
        </Grid>
      </Grid>
    </SLayout>
  );
}

export const Page = PageComponent;
