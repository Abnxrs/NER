import { yupResolver } from '@hookform/resolvers/yup';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { FormControl, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import LoadingIndicator from '../../../components/LoadingIndicator';
import NERFormModal from '../../../components/NERFormModal';
import ReactHookTextField from '../../../components/ReactHookTextField';
import { useReportRefund } from '../../../hooks/finance.hooks';
import { useToast } from '../../../hooks/toasts.hooks';

const schema = yup.object().shape({
  refundAmount: yup
    .number()
    .required()
    .test('two decimals', 'Refund must be formatted as a dollar amount with at most two decimals', (value) => {
      if (!value) return false;
      return Math.floor(value * 100) === value * 100;
    })
    .typeError('The refund amount should be a valid number'),
  dateReceived: yup.date().required()
});

interface ReportRefundProps {
  modalShow: boolean;
  handleClose: () => void;
}

export interface ReportRefundInputs {
  newAccountCreditAmount: number;
}

const ReportRefundModal: React.FC<ReportRefundProps> = ({ modalShow, handleClose }: ReportRefundProps) => {
  const toast = useToast();
  const { isLoading, mutateAsync } = useReportRefund();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      refundAmount: '',
      dateReceived: new Date()
    },
    mode: 'onChange'
  });

  const handleConfirm = async (data: { refundAmount: number; dateReceived: Date }) => {
    handleClose();
    try {
      await mutateAsync({ refundAmount: data.refundAmount * 100, dateReceived: data.dateReceived.toISOString() });
      toast.success(`New Account Credit Amount #${data.refundAmount} Reported Successfully`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <NERFormModal
      open={modalShow}
      onHide={handleClose}
      title={'Report New Account Credit'}
      reset={reset}
      handleUseFormSubmit={handleSubmit}
      onFormSubmit={handleConfirm}
      formId="reimbursement-form"
    >
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <FormControl>
          <ReactHookTextField
            name="refundAmount"
            control={control}
            sx={{ width: 1 }}
            startAdornment={<AttachMoneyIcon />}
            errorMessage={errors.refundAmount}
          />
          {/* <DatePicker
            inputFormat="yyyy-MM-dd"
            onChange={datePickerOnChange}
            value={dateReceived}
            renderInput={(params) => <TextField autoComplete="off" {...params} />}
          /> */}
          <Controller
            name="dateReceived"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                inputFormat="yyyy-MM-dd"
                onChange={(e) => onChange(e ?? new Date())}
                className={'padding: 10'}
                value={value}
                renderInput={(params) => <TextField autoComplete="off" {...params} />}
              />
            )}
          />
        </FormControl>
      )}
    </NERFormModal>
  );
};

export default ReportRefundModal;
