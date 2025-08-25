// lib/utils/applicationStatus.ts
import { Application, ApplicationStatus, ApplicationStatusInfo } from '../types/application';

/**
 * Determines the completion status of an application based on its fields
 */
export function getApplicationStatus(application: Application): ApplicationStatusInfo {
  const requiredFields = getRequiredFieldsByFormType(application.formtype);
  const missingFields: string[] = [];
  let filledFields = 0;

  // Check each required field
  requiredFields.forEach(field => {
    const value = application[field.key as keyof Application];
    if (field.type === 'boolean') {
      if (value === true) {
        filledFields++;
      } else {
        missingFields.push(field.label);
      }
    } else {
      if (value && value !== '' && value !== null) {
        filledFields++;
      } else {
        missingFields.push(field.label);
      }
    }
  });

  const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);
  
  // Determine status based on completion and explicit status
  let status: ApplicationStatus;
  
  if (application.status === 'complete' && missingFields.length === 0) {
    status = 'complete';
  } else if (application.status === 'incomplete' || missingFields.length > 0) {
    status = 'incomplete';
  } else {
    status = 'pending';
  }

  return {
    status,
    ...getStatusColors(status),
    completionPercentage,
    missingFields
  };
}

/**
 * Returns color scheme for different status types
 */
export function getStatusColors(status: ApplicationStatus) {
  switch (status) {
    case 'complete':
      return {
        color: '#10B981', // green-500
        bgColor: '#D1FAE5', // green-100
        textColor: '#065F46' // green-800
      };
    case 'incomplete':
      return {
        color: '#EF4444', // red-500
        bgColor: '#FEE2E2', // red-100
        textColor: '#991B1B' // red-800
      };
    case 'pending':
      return {
        color: '#F59E0B', // amber-500
        bgColor: '#FEF3C7', // amber-100
        textColor: '#92400E' // amber-800
      };
    default:
      return {
        color: '#6B7280', // gray-500
        bgColor: '#F3F4F6', // gray-100
        textColor: '#374151' // gray-700
      };
  }
}

/**
 * Returns required fields based on form type
 */
function getRequiredFieldsByFormType(formtype: string) {
  const baseFields = [
    { key: 'clientname', label: 'Client Name', type: 'text' },
    { key: 'submitteddate', label: 'Submitted Date', type: 'date' }
  ];

  const commonProcessFields = [
    { key: 'approvaldate', label: 'Approval Date', type: 'date' },
    { key: 'approvalreceiveddate', label: 'Approval Received Date', type: 'date' }
  ];

  const financialFields = [
    { key: 'chequerequisitiondate', label: 'Cheque Requisition Date', type: 'date' },
    { key: 'chequeraiseddate', label: 'Cheque Raised Date', type: 'date' },
    { key: 'chequecollecteddate', label: 'Cheque Collected Date', type: 'date' }
  ];

  const travelFields = [
    { key: 'hotelvouchersubmitted', label: 'Hotel Voucher Submitted', type: 'boolean' },
    { key: 'flightbooked', label: 'Flight Booked', type: 'boolean' }
  ];

  switch (formtype.toLowerCase()) {
    case 'methadone':
      return [...baseFields, ...commonProcessFields, ...financialFields];
    
    case 'reimbursement':
      return [...baseFields, ...commonProcessFields, ...financialFields];
    
    case 'traditional':
      return [...baseFields, ...commonProcessFields, ...financialFields];
    
    case 'appointment':
      return [...baseFields, ...commonProcessFields];
    
    case 'transport':
      return [...baseFields, ...commonProcessFields, ...travelFields, ...financialFields];
    
    default:
      return [...baseFields, ...commonProcessFields];
  }
}

/**
 * Groups applications by their status
 */
export function groupApplicationsByStatus(applications: Application[]) {
  const groups = {
    complete: [] as Application[],
    incomplete: [] as Application[],
    pending: [] as Application[]
  };

  applications.forEach(app => {
    const statusInfo = getApplicationStatus(app);
    groups[statusInfo.status].push(app);
  });

  return groups;
}

/**
 * Gets summary statistics for applications
 */
export function getApplicationSummary(applications: Application[]) {
  const groups = groupApplicationsByStatus(applications);
  const total = applications.length;

  return {
    total,
    complete: groups.complete.length,
    incomplete: groups.incomplete.length,
    pending: groups.pending.length,
    completePercentage: total > 0 ? Math.round((groups.complete.length / total) * 100) : 0,
    incompletePercentage: total > 0 ? Math.round((groups.incomplete.length / total) * 100) : 0,
    pendingPercentage: total > 0 ? Math.round((groups.pending.length / total) * 100) : 0
  };
}

/**
 * Filters applications by date range
 */
export function filterApplicationsByDateRange(
  applications: Application[],
  startDate?: string,
  endDate?: string
) {
  if (!startDate && !endDate) return applications;

  return applications.filter(app => {
    if (!app.submitteddate) return false;

    const submittedDate = new Date(app.submitteddate);

    if (startDate && submittedDate < new Date(startDate)) {
      return false;
    }

    if (endDate && submittedDate > new Date(endDate)) {
      return false;
    }

    return true;
  });
}

/**
 * Exports applications data to CSV format
 */
export function exportApplicationsToCSV(applications: Application[]): string {
  const headers = [
    'ID',
    'Client Name',
    'Form Type',
    'Status',
    'Completion %',
    'Submitted Date',
    'Approval Date',
    'Approval Received Date',
    'Hotel Voucher Submitted',
    'Flight Booked',
    'Cheque Requisition Date',
    'Cheque Raised Date',
    'Cheque Collected Date',
    'Updated At'
  ];

  const rows = applications.map(app => {
    const statusInfo = getApplicationStatus(app);
    return [
      app.id,
      app.clientname,
      app.formtype,
      statusInfo.status,
      `${statusInfo.completionPercentage}%`,
      app.submitteddate || '',
      app.approvaldate || '',
      app.approvalreceiveddate || '',
      app.hotelvouchersubmitted ? 'Yes' : 'No',
      app.flightbooked ? 'Yes' : 'No',
      app.chequerequisitiondate || '',
      app.chequeraiseddate || '',
      app.chequecollecteddate || '',
      app.updated_at || ''
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

/**
 * Downloads CSV file
 */
export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Exports applications data to Excel format
 */
export function exportApplicationsToExcel(applications: Application[]): void {
  // Dynamic import to avoid SSR issues
  import('xlsx').then((XLSX) => {
    const data = applications.map(app => {
      const statusInfo = getApplicationStatus(app);
      return {
        'ID': app.id,
        'Client Name': app.clientname,
        'Form Type': app.formtype,
        'Status': statusInfo.status,
        'Completion %': `${statusInfo.completionPercentage}%`,
        'Submitted Date': app.submitteddate || '',
        'Approval Date': app.approvaldate || '',
        'Approval Received Date': app.approvalreceiveddate || '',
        'Hotel Voucher Submitted': app.hotelvouchersubmitted ? 'Yes' : 'No',
        'Flight Booked': app.flightbooked ? 'Yes' : 'No',
        'Cheque Requisition Date': app.chequerequisitiondate || '',
        'Cheque Raised Date': app.chequeraiseddate || '',
        'Cheque Collected Date': app.chequecollecteddate || '',
        'Updated At': app.updated_at || ''
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');

    const filename = `applications-report-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, filename);
  });
}

/**
 * Gets monthly report data
 */
export function getMonthlyReportData(applications: Application[], year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const monthlyApps = applications.filter(app => {
    if (!app.submitteddate) return false;
    const submittedDate = new Date(app.submitteddate);
    return submittedDate >= startDate && submittedDate <= endDate;
  });

  const summary = getApplicationSummary(monthlyApps);
  const groupedByType = monthlyApps.reduce((acc, app) => {
    acc[app.formtype] = (acc[app.formtype] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    month: startDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
    summary,
    applications: monthlyApps,
    formTypeBreakdown: groupedByType,
    totalSubmissions: monthlyApps.length
  };
}
