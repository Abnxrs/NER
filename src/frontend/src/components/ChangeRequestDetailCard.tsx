/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Card, CardContent, Grid, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { green, blue, red, grey, orange } from '@mui/material/colors';
import { Box, Stack } from '@mui/system';
import { Link } from '@mui/material';
import {
  ActivationChangeRequest,
  ChangeRequest,
  ChangeRequestType,
  StageGateChangeRequest,
  StandardChangeRequest,
  wbsPipe
} from 'shared';
import { routes } from '../utils/routes';
import { Link as RouterLink } from 'react-router-dom';
import { datePipe, fullNamePipe } from '../utils/pipes';
import { Cancel, Construction, DateRange, Description, DoneAll, Person, Start, Work } from '@mui/icons-material';
import { ChangeRequestTypeTextPipe } from '../utils/enum-pipes';

const determineChangeRequestTypeView = (cr: ChangeRequest) => {
  switch (cr.type) {
    case 'STAGE_GATE':
      return <StageGateCardDetails cr={cr as StageGateChangeRequest} />;
    case 'ACTIVATION':
      return <ActivationCardDetails cr={cr as ActivationChangeRequest} />;
    default:
      return <StandardCardDetails cr={cr as StandardChangeRequest} />;
  }
};

const determineChangeRequestPillColor = (type: ChangeRequestType) => {
  switch (type) {
    case 'STAGE_GATE':
      return orange[900];
    case 'ACTIVATION':
      return green[600];
    case 'DEFINITION_CHANGE':
      return blue[600];
    case 'ISSUE':
      return red[400];
    default:
      return grey[500];
  }
};

const StandardCardDetails = ({ cr }: { cr: StandardChangeRequest }) => {
  return (
    <Grid container mt={1} ml={'2px'}>
      <Grid item>
        <Description sx={{ ml: '-4px' }} display={'inline'} />
      </Grid>
      <Grid item xs>
        <Typography ml={'4px'} display={'inline'}>
          {cr.what}
        </Typography>
      </Grid>
    </Grid>
  );
};

const StageGateCardDetails = ({ cr }: { cr: StageGateChangeRequest }) => {
  return (
    <Box ml={-1}>
      {cr.confirmDone ? (
        <Chip icon={<DoneAll />} label={'Done'} sx={{ backgroundColor: 'transparent' }} />
      ) : (
        <Chip icon={<Cancel />} label={'Not Done'} sx={{ backgroundColor: 'transparent' }} />
      )}
    </Box>
  );
};

const ActivationCardDetails = ({ cr }: { cr: ActivationChangeRequest }) => {
  return (
    <Box>
      <Stack direction="row">
        <Chip
          icon={<Construction />}
          label={fullNamePipe(cr.projectLead)}
          sx={{ backgroundColor: 'transparent', mr: 2, ml: -1, maxWidth: '150' }}
        />
        <Chip
          icon={<Work />}
          label={fullNamePipe(cr.projectManager)}
          sx={{ backgroundColor: 'transparent', maxWidth: '150' }}
        />
      </Stack>
      <Stack direction="row" justifyContent={'space-between'}>
        <Chip icon={<Start />} label={datePipe(cr.startDate)} sx={{ backgroundColor: 'transparent', ml: -1 }} />
      </Stack>
    </Box>
  );
};

interface ChangeRequestDetailCardProps {
  changeRequest: ChangeRequest;
}

// Convert work package stage into badge for display
const ChangeRequestDetailCard: React.FC<ChangeRequestDetailCardProps> = ({ changeRequest }) => {
  const ChangeRequestTypeView = () => determineChangeRequestTypeView(changeRequest);
  const pillColor = determineChangeRequestPillColor(changeRequest.type);
  return (
    <Card sx={{ width: 300, mr: 1, mb: 1, borderRadius: 5 }}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Link component={RouterLink} to={`${routes.CHANGE_REQUESTS}/${changeRequest.crId}`} noWrap>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                {'CR #' + changeRequest.crId}
              </Typography>
            </Link>
          </Grid>
          <Grid item display="flex" justifyContent="flex-end">
            <Chip
              size="small"
              label={ChangeRequestTypeTextPipe(changeRequest.type)}
              variant="outlined"
              sx={{
                fontSize: 12,
                color: pillColor,
                borderColor: pillColor,
                mb: 0.5
              }}
            />
          </Grid>
        </Grid>
        <Stack direction="row">
          <Chip
            icon={<Person />}
            label={fullNamePipe(changeRequest.submitter)}
            sx={{ mr: 2, ml: -1, backgroundColor: 'transparent', maxWidth: '150' }}
          />
          <Chip icon={<DateRange />} label={datePipe(changeRequest.dateSubmitted)} sx={{ backgroundColor: 'transparent' }} />
        </Stack>
        <Typography fontWeight={'regular'} variant="h6" fontSize={16} noWrap>
          <Link component={RouterLink} to={`${routes.PROJECTS}/${wbsPipe(changeRequest.wbsNum)}`}>
            {wbsPipe(changeRequest.wbsNum)} - {changeRequest.wbsName}
          </Link>
        </Typography>
        <ChangeRequestTypeView />
      </CardContent>
    </Card>
  );
};

export default ChangeRequestDetailCard;
