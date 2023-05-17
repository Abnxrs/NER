export enum Club_Account {
  CASH = 'CASH',
  BUDGET = 'BUDGET'
}

export enum ReimbursementStatusType {
  PENDING_FINANCE = 'PENDING FINANCE',
  SABO_SUBMITTED = 'SABO SUBMITTED',
  ADVISOR_APPROVED = 'ADVISOR_APPROVED',
  REIMBURSED = 'REIMBURSED'
}

export interface ReimbursementRequest {
  reimbursementRequestId: string;
  saboId?: number;
  dateCreated: Date;
  dateDeleted?: Date;
  dateOfExpense: Date;
  reimbursementsStatuses: Reimbursement_Status[]; // ReimbursementStatus
  //recepientId: number; // get rid of
  recepient: User; // RecipientPreview
  //vendorId: string; // get rid of
  vendor: Vendor; // VendorPreview
  account: Club_Account;
  totalCost: number;
  receiptPictures: string[];
  reimbursementProducts: Reimbursement_Product[]; // ReimbursementProduct
  dateDelivered?: Date;
  //expenseTypeId: string; // get rid of
  expenseType: Expense_Type; // ExpenseTypePreview
}

export interface ReimbursementStatus {
  reimbursementStatusId: number;
  type: ReimbursementStatusType;
  user: UserPreview;
  dateCreated: DateTime;
  reimbursementRequest: ReimbursementRequest;
}
