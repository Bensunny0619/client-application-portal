// types/application.ts
export interface Application {
  id: string;
  clientname: string;
  formtype: string;
  submitteddate?: string;
  approvaldate?: string;
  approvalreceiveddate?: string;
  hotelvouchersubmitted?: boolean;
  flightbooked?: boolean;
  chequerequisitiondate?: string;
  chequeraiseddate?: string;
  chequecollecteddate?: string;
  status: string;
  updated_at?: string;
  voucher_received?: boolean;
  flight_booked?: boolean;
  check_requisition_made?: string;
  check_raised?: string;
  check_collected?: string;
}

export type ApplicationStatus = 'complete' | 'incomplete' | 'pending';

export interface ApplicationStatusInfo {
  status: ApplicationStatus;
  color: string;
  bgColor: string;
  textColor: string;
  completionPercentage: number;
  missingFields: string[];
}
