/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */
import { useState } from 'react';
import { Box, Grid, ListItemIcon, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { NERButton } from '../../components/NERButton';
import { useCurrentUser } from '../../hooks/users.hooks';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Refunds from './RefundsSection';
import ReimbursementRequestTable from './ReimbursementRequestsSection';
import { useAllReimbursementRequests, useCurrentUserReimbursementRequests } from '../../hooks/finance.hooks';
import ErrorPage from '../ErrorPage';
import LoadingIndicator from '../../components/LoadingIndicator';
import PageLayout from '../../components/PageLayout';
import { useHistory } from 'react-router-dom';
import { routes } from '../../utils/routes';

const FinancePage = () => {
  const user = useCurrentUser();
  const history = useHistory();

  const {
    data: userReimbursementRequests,
    isLoading: userReimbursementRequestIsLoading,
    isError: userReimbursementRequestIsError,
    error: userReimbursementRequestError
  } = useCurrentUserReimbursementRequests();
  const {
    data: allReimbursementRequests,
    isLoading: allReimbursementRequestsIsLoading,
    isError: allReimbursementRequestsIsError,
    error: allReimbursementRequestsError
  } = useAllReimbursementRequests();

  const isFinance = user.isFinance;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (isFinance && allReimbursementRequestsIsError) return <ErrorPage message={allReimbursementRequestsError?.message} />;
  if (userReimbursementRequestIsError) return <ErrorPage message={userReimbursementRequestError?.message} />;
  if (
    (isFinance && (allReimbursementRequestsIsLoading || !allReimbursementRequests)) ||
    userReimbursementRequestIsLoading ||
    !userReimbursementRequests
  )
    return <LoadingIndicator />;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const financeActionsDropdown = (
    <>
      <NERButton
        endIcon={<ArrowDropDownIcon style={{ fontSize: 28 }} />}
        variant="contained"
        id="project-actions-dropdown"
        onClick={handleClick}
      >
        Actions
      </NERButton>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleDropdownClose}>
        <MenuItem onClick={() => history.push(routes.NEW_REIMBURSEMENT_REQUEST)}>
          <ListItemIcon>
            <NoteAddIcon fontSize="small" />
          </ListItemIcon>
          Create Reimbursement Request
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <ListItemIcon>
            <AttachMoneyIcon fontSize="small" />
          </ListItemIcon>
          Report Refund
        </MenuItem>
        <MenuItem onClick={() => {}} disabled={!isFinance}>
          <ListItemIcon>
            <ListAltIcon fontSize="small" />
          </ListItemIcon>
          Pending Advisor List
        </MenuItem>
        <MenuItem onClick={() => {}} disabled={!isFinance}>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          Generate All Receipts
        </MenuItem>
      </Menu>
    </>
  );
  return (
    <PageLayout title="Finance" headerRight={financeActionsDropdown}>
      <Grid container>
        <Grid item xs={12} sm={12} md={4}>
          <Refunds
            userReimbursementRequests={userReimbursementRequests}
            allReimbursementRequests={allReimbursementRequests}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Box sx={{ marginTop: { xs: '10px', sm: '10px', md: '0' }, marginLeft: { xs: '0', sm: '0', md: '10px' } }}>
            <ReimbursementRequestTable
              userReimbursementRequests={userReimbursementRequests}
              allReimbursementRequests={allReimbursementRequests}
            />
          </Box>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default FinancePage;