/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import React, { useState } from 'react';
import { Box, useTheme, Collapse, Tabs, Tab, Typography } from '@mui/material';
import { ChangeRequest } from 'shared';
import ChangeRequestDetailCard from '../../components/ChangeRequestDetailCard';
import { useAllChangeRequests } from '../../hooks/change-requests.hooks';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorPage from '../ErrorPage';

interface OtherChangeRequestsPopupTabsProps {
  changeRequest: ChangeRequest;
}

const OtherChangeRequestsPopupTabs: React.FC<OtherChangeRequestsPopupTabsProps> = ({
  changeRequest
}: OtherChangeRequestsPopupTabsProps) => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const { data: changeRequests, isError, isLoading, error } = useAllChangeRequests();

  if (isLoading) return <LoadingIndicator />;
  if (isError) return <ErrorPage error={error} message={error.message} />;

  // the CRs submitted or reviewed by the submitter of this CR
  const crFromSameUser = changeRequests?.filter(
    (cr) =>
      (cr.submitter.userId === changeRequest.submitter.userId || cr.reviewer?.userId === changeRequest.submitter.userId) &&
      cr.crId !== changeRequest.crId
  );

  const displayTab = (value: number, title: string) => (
    <Tab
      value={value}
      label={
        <Typography sx={{ display: 'flex' }}>
          {title}
          {tab === value ? <ExpandMore sx={{ pl: 0.5 }} /> : <ExpandLess sx={{ pl: 0.5 }} />}
        </Typography>
      }
      onClick={() => {
        tab === value && setTab(0);
      }}
    />
  );

  const displayCRCards = (crList: ChangeRequest[]) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '20px',
        background: theme.palette.background.paper,
        borderTop: `solid 1px ${theme.palette.divider}`,
        borderLeft: `solid 1px ${theme.palette.divider}`,
        '&::-webkit-scrollbar': {
          height: '20px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.divider,
          borderRadius: '20px',
          border: '6px solid transparent',
          backgroundClip: 'content-box'
        },
        overflowX: 'scroll'
      }}
    >
      {crList.length !== 0 ? (
        crList.map((cr: ChangeRequest) => <ChangeRequestDetailCard changeRequest={cr} />)
      ) : (
        <Typography>No related change requests.</Typography>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '0px',
        left: '65px',
        width: 'calc(100% - 65px)'
      }}
    >
      <Tabs
        value={tab}
        onChange={(e, newValue: number) => setTab(newValue)}
        sx={{
          '.MuiTabs-indicator': {
            background: 'transparent'
          },
          '& button': {
            background: theme.palette.background.paper,
            border: `solid 1px ${theme.palette.divider}`,
            color: theme.palette.text.primary,
            textTransform: 'none'
          },
          '& button.Mui-selected': {
            color: theme.palette.text.primary,
            borderBottom: 'transparent'
          },
          mb: '-1px'
        }}
      >
        {displayTab(1, `Other CR's from ${changeRequest.submitter.firstName} ${changeRequest.submitter.lastName}`)}
      </Tabs>
      <Collapse in={tab !== 0}>{tab === 1 && displayCRCards(crFromSameUser || [])}</Collapse>
    </Box>
  );
};

export default OtherChangeRequestsPopupTabs;
