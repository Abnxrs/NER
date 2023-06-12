/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import AdminToolsUserManagement from './AdminToolsUserManagement';
import AdminToolsSlackUpcomingDeadlines from './AdminToolsSlackUpcomingDeadlines';
import PageLayout from '../../components/PageLayout';

const AdminToolsPage: React.FC = () => {
  return (
    <PageLayout title="Admin Tools">
      <AdminToolsUserManagement />
      <AdminToolsSlackUpcomingDeadlines />
    </PageLayout>
  );
};

export default AdminToolsPage;
