import { validateWBS } from 'shared';
import { HttpException } from '../../../../backend/src/utils/errors.utils';
import { useQuery } from '../../hooks/utils.hooks';
import WorkPackageForm from './WorkPackageForm';
import { useCreateSingleWorkPackage } from '../../hooks/work-packages.hooks';
import { useHistory } from 'react-router-dom';
import { routes } from '../../utils/routes';
import { projectWbsPipe } from '../../utils/pipes';

const CreateWorkPackageForm: React.FC = () => {
  const query = useQuery();
  const wbsNum = query.get('wbs');
  const history = useHistory();

  if (!wbsNum) throw new HttpException(400, 'WBS number not included in request.');

  console.log(true);

  return (
    <WorkPackageForm
      wbsNum={validateWBS(wbsNum)}
      operation={useCreateSingleWorkPackage}
      exitActiveMode={() => history.push(`${routes.PROJECTS}/${projectWbsPipe(validateWBS(wbsNum))}`)}
    />
  );
};

export default CreateWorkPackageForm;
