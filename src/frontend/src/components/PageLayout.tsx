/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Helmet } from 'react-helmet';
import React, { ReactNode, ReactElement } from 'react';
import PageTitle from '../layouts/PageTitle/PageTitle';
import { LinkItem } from '../utils/types';
import { Box } from '@mui/system';

interface PageLayoutProps {
  title?: string;
  hidePageTitle?: boolean;
  previousPages?: LinkItem[];
  headerRight?: ReactNode;
  tabs?: ReactElement;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  hidePageTitle = false,
  previousPages = [],
  headerRight,
  tabs
}) => {
  return (
    <Box>
      <Helmet>
        <title>{`FinishLine ${title && `| ${title}`}`}</title>
        <meta name="description" content="FinishLine Project Management Dashboard" />
      </Helmet>
      {!hidePageTitle && title && <PageTitle {...{ title, previousPages, headerRight, tabs }} />}
      {children}
    </Box>
  );
};

export default PageLayout;
