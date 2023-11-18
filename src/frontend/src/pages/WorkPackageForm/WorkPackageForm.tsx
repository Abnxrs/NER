import { UseMutationResult } from 'react-query';
import { WbsNumber, WorkPackage, isGuest, isProject, wbsPipe } from 'shared';
import WorkPackageFormView, { WorkPackageFormViewPayload } from './WorkPackageFormView';
import { bulletsToObject } from '../../utils/form';
import { useAllWorkPackages, useSingleWorkPackage } from '../../hooks/work-packages.hooks';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorPage from '../ErrorPage';
import { useAllUsers } from '../../hooks/users.hooks';
import { useSingleProject } from '../../hooks/projects.hooks';

interface WorkPackageFormProps {
  wbsNum: WbsNumber;
  operation: (wbsNum: WbsNumber) => UseMutationResult;
  exitActiveMode: () => void;
}

const WorkPackageForm: React.FC<WorkPackageFormProps> = ({ wbsNum, operation, exitActiveMode }) => {
  console.log(true);
  const { data: users, isLoading: usersIsLoading, isError: usersIsError, error: usersError } = useAllUsers();
  const {
    data: project,
    isLoading: projectIsLoading,
    isError: projectIsError,
    error: projectError
  } = useSingleProject({ ...wbsNum, workPackageNumber: 0 });
  const { data: workPackages, isLoading: wpIsLoading, isError: wpIsError, error: wpError } = useAllWorkPackages();
  const { mutateAsync } = operation(wbsNum);

  if (wpIsLoading || !workPackages || usersIsLoading || !users || projectIsLoading || !project) return <LoadingIndicator />;
  if (usersIsError) return <ErrorPage message={usersError.message} />;
  if (projectIsError) return <ErrorPage message={projectError.message} />;
  if (wpIsError) return <ErrorPage message={wpError.message} />;

  const workPackage = workPackages.find((wp) => wp.wbsNum === wbsNum);

  const defaultValues: WorkPackageFormViewPayload | undefined = isProject(wbsNum)
    ? undefined
    : {
        ...workPackage!,
        workPackageId: workPackage!.id,
        crId: workPackage!.changes[0].changeRequestId.toString(),
        stage: workPackage!.stage,
        blockedBy: workPackage!.blockedBy.map(wbsPipe),
        expectedActivities: bulletsToObject(workPackage!.expectedActivities),
        deliverables: bulletsToObject(workPackage!.deliverables)
      };

  const blockedByToAutocompleteOption = (workPackage: WorkPackage) => {
    return { id: wbsPipe(workPackage.wbsNum), label: `${wbsPipe(workPackage.wbsNum)} - ${workPackage.name}` };
  };

  const wbsElement = workPackage ?? project;

  const leadOrManagerOptions = users.filter((user) => !isGuest(user.role));
  const blockedByOptions =
    project.workPackages.filter((wp) => wp.id !== wbsElement.id).map(blockedByToAutocompleteOption) || [];

  return (
    <WorkPackageFormView
      exitActiveMode={exitActiveMode}
      mutateAsync={mutateAsync}
      defaultValues={defaultValues}
      wbsElement={wbsElement}
      leadOrManagerOptions={leadOrManagerOptions}
      blockedByOptions={blockedByOptions}
    />
  );
};

export default WorkPackageForm;
