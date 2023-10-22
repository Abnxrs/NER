import { Box, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { isWithinInterval, subDays } from 'date-fns';
import { Control, Controller } from 'react-hook-form';
import { AuthenticatedUser, ChangeRequest, wbsPipe } from 'shared';
import { useAllChangeRequests } from '../hooks/change-requests.hooks';
import { useCurrentUser } from '../hooks/users.hooks';
import LoadingIndicator from './LoadingIndicator';

// Filter and sort change requests to display in the dropdown
const getFilteredChangeRequests = (changeRequests: ChangeRequest[], user: AuthenticatedUser): ChangeRequest[] => {
  const today = new Date();
  const fiveDaysAgo = subDays(today, 5);

  const filteredRequests = changeRequests.filter(
    (cr) => cr.dateImplemented && cr.accepted && isWithinInterval(cr.dateImplemented, { start: fiveDaysAgo, end: today })
  );

  // The current user's CRs should be at the top
  filteredRequests.sort((a, b) => {
    const isSubmitterAUser = a.submitter.userId === user.userId;
    const isSubmitterBUser = b.submitter.userId === user.userId;

    if (isSubmitterAUser && isSubmitterBUser) return 0;
    if (isSubmitterAUser) return -1;
    if (isSubmitterBUser) return 1;

    return a.crId - b.crId;
  });

  return filteredRequests;
};

interface ChangeRequestDropdownProps {
  control: Control<any, any>;
  name: string;
}

const ChangeRequestDropdown = ({ control, name }: ChangeRequestDropdownProps) => {
  const user = useCurrentUser();
  const { isLoading, data: changeRequests } = useAllChangeRequests();
  if (isLoading || !changeRequests) return <LoadingIndicator />;

  const filteredRequests = getFilteredChangeRequests(changeRequests, user);

  const approvedChangeRequestOptions = filteredRequests.map((cr) => ({
    label: `${cr.crId} - ${wbsPipe(cr.wbsNum)} - ${cr.submitter.firstName} ${cr.submitter.lastName} - ${cr.type}`,
    value: cr.crId
  }));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
      <FormControl>
        <FormLabel sx={{ alignSelf: 'start' }}>Change Request ID</FormLabel>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <Select
              id="cr-autocomplete"
              displayEmpty
              renderValue={(value) => value}
              value={value}
              onChange={(event: SelectChangeEvent<number>) => onChange(event.target.value)}
              size={'small'}
              placeholder={'Change Request Id'}
              sx={{ width: 200, textAlign: 'left' }}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right'
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'right'
                }
              }}
            >
              {approvedChangeRequestOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
};

export default ChangeRequestDropdown;
