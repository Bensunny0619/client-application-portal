import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  getApplicationStatus,
  getApplicationSummary,
  filterApplicationsByDateRange,
  exportApplicationsToCSV,
  downloadCSV,
  exportApplicationsToExcel
} from "@/lib/utils/applicationStatus";

interface Application {
  id: string;
  clientname: string;
  formtype: string;
  status: string;
  submitteddate?: string;
  updated_at?: string;
  approvaldate?: string;
  approvalreceiveddate?: string;
  hotelvouchersubmitted?: boolean;
  flightbooked?: boolean;
  chequerequisitiondate?: string;
  chequeraiseddate?: string;
  chequecollecteddate?: string;
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    borderBottom: '1px solid #e5e7eb',
  },
  headerContent: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '1.5rem 1rem',
  },
  headerFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#581c87',
    fontFamily: "'Playfair Display', serif",
    margin: 0,
  },
  backButton: {
    backgroundColor: '#4b5563',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    textDecoration: 'none',
    display: 'inline-block',
  },
  mainContent: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '1.5rem 1rem',
  },
  filtersCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    marginBottom: '1.5rem',
  },
  filtersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  filtersTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: 0,
    color: '#374151',
  },
  clearButton: {
    color: 'purple',
    fontWeight: '600',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    width: '100%',
  },
  filtersRow1: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
    width: '100%',
  },
  filtersRow2: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
    width: '100%',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: '1',
    minWidth: '200px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.25rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  summaryGrid: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    flex: '1',
    minWidth: '200px',
  },
  summaryNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
  },
  summaryNumberGreen: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#059669',
  },
  summaryNumberRed: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#dc2626',
  },
  summaryNumberYellow: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#d97706',
  },
  summaryLabel: {
    fontSize: '0.875rem',
    color: '#4b5563',
  },
  chartsGrid: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    flex: '1',
    minWidth: '300px',
    color: '#111827',
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
    margin: 0,
  },
  chartItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  chartItemLast: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  chartLegend: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  chartColor: {
    width: '1rem',
    height: '1rem',
    borderRadius: '0.25rem',
  },
  chartValues: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  chartValue: {
    fontWeight: '500',
  },
  chartPercentage: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  progressBarContainer: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '0.5rem',
    marginTop: '0.25rem',
  },
  progressBar: {
    height: '0.5rem',
    borderRadius: '9999px',
  },
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '2rem 0',
  },
  loadingText: {
    color: '#7c3aed',
    fontSize: '1.25rem',
  },
  exportButtonsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  exportButton: {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '0.875rem',
  },
  csvButton: {
    backgroundColor: '#059669',
    color: '#ffffff',
  },
  excelButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    color: '#ffffff',
    cursor: 'not-allowed',
  },
  recordCount: {
    fontSize: '0.75rem',
    color: '#6b7280',
    textAlign: 'center' as const,
  },
};

const mediaQueries = `
  @media (min-width: 768px) {
    .summary-grid {
      grid-template-columns: repeat(4, 1fr);
    }
    .filters-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .charts-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .filters-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  .back-button:hover {
    background-color: #374151;
  }
  
  .clear-button:hover {
    color: #7c3aed;
  }
  
  .csv-button:hover:not(:disabled) {
    background-color: #047857;
  }
  
  .excel-button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
  
  .input:focus {
    ring: 2px solid #9333ea;
    border-color: transparent;
  }
`;

export default function ReportsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formTypeFilter, setFormTypeFilter] = useState("all");
  const [clientNameFilter, setClientNameFilter] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!error && data) {
        setApplications(data);
        setFilteredApps(data);
      }
      setLoading(false);
    };

    fetchApps();
  }, []);

  useEffect(() => {
    let results = [...applications];

    // Filter by date range
    if (startDate || endDate) {
      results = filterApplicationsByDateRange(results, startDate, endDate);
    }

    // Filter by client name
    if (clientNameFilter) {
      results = results.filter((app) =>
        app.clientname?.toLowerCase().includes(clientNameFilter.toLowerCase())
      );
    }

    // Filter by form type
    if (formTypeFilter !== "all") {
      results = results.filter((app) => app.formtype === formTypeFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      results = results.filter((app) => {
        const statusInfo = getApplicationStatus(app);
        return statusInfo.status === statusFilter;
      });
    }

    setFilteredApps(results);
  }, [applications, startDate, endDate, statusFilter, formTypeFilter, clientNameFilter]);

  const summary = getApplicationSummary(filteredApps);
  const formTypes = [...new Set(applications.map(app => app.formtype))];

  const handleExportCSV = () => {
    const csvContent = exportApplicationsToCSV(filteredApps);
    const filename = `applications-report-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleExportExcel = () => {
    exportApplicationsToExcel(filteredApps);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setFormTypeFilter("all");
    setClientNameFilter("");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: mediaQueries }} />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerFlex}>
              <h1 style={styles.title}>
                Reports & Analytics
              </h1>
              <Link href="/client-applications">
                <button style={styles.backButton} className="back-button">
                  Back to Applications
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          {/* Filters */}
          <div style={styles.filtersCard}>
            <div style={styles.filtersHeader}>
              <h2 style={styles.filtersTitle}>Filters</h2>
              <button
                type="button"
                onClick={clearFilters}
                style={styles.clearButton}
                className="clear-button"
              >
                Clear All Filters
              </button>
            </div>
            
            <div style={styles.filtersContainer}>
              {/* Row 1: Start Date, End Date, Status */}
              <div style={styles.filtersRow1}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.input}
                    className="input"
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={styles.input}
                    className="input"
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={styles.input}
                    className="input"
                  >
                    <option value="all">All Status</option>
                    <option value="complete">Complete</option>
                    <option value="incomplete">Incomplete</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Form Type, Client Name, Export */}
              <div style={styles.filtersRow2}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Form Type</label>
                  <select
                    value={formTypeFilter}
                    onChange={(e) => setFormTypeFilter(e.target.value)}
                    style={styles.input}
                    className="input"
                  >
                    <option value="all">All Types</option>
                    {formTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Client Name</label>
                  <input
                    type="text"
                    placeholder="Search by client name..."
                    value={clientNameFilter}
                    onChange={(e) => setClientNameFilter(e.target.value)}
                    style={styles.input}
                    className="input"
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Export Data</label>
                  <div style={styles.exportButtonsContainer}>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      disabled={filteredApps.length === 0}
                      style={{
                        ...styles.exportButton,
                        ...(filteredApps.length === 0 ? styles.disabledButton : styles.csvButton)
                      }}
                      className="csv-button"
                    >
                      Export to CSV
                    </button>
                    <button
                      type="button"
                      onClick={handleExportExcel}
                      disabled={filteredApps.length === 0}
                      style={{
                        ...styles.exportButton,
                        ...(filteredApps.length === 0 ? styles.disabledButton : styles.excelButton)
                      }}
                      className="excel-button"
                    >
                      Export to Excel
                    </button>
                    <div style={styles.recordCount}>
                      {filteredApps.length} records
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingText}>Loading...</div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div style={styles.summaryGrid} className="summary-grid">
                <div style={styles.summaryCard}>
                  <div style={styles.summaryNumber}>{summary.total}</div>
                  <div style={styles.summaryLabel}>Total Applications</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryNumberGreen}>{summary.complete}</div>
                  <div style={styles.summaryLabel}>Complete</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryNumberRed}>{summary.incomplete}</div>
                  <div style={styles.summaryLabel}>Incomplete</div>
                </div>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryNumberYellow}>{summary.pending}</div>
                  <div style={styles.summaryLabel}>Pending</div>
                </div>
              </div>

              {/* Charts and Analytics */}
              <div style={styles.chartsGrid} className="charts-grid">
                <div style={styles.chartCard}>
                  <h3 style={styles.chartTitle}>Status Distribution</h3>
                  <div>
                    <div style={styles.chartItem}>
                      <div style={styles.chartLegend}>
                        <div style={{...styles.chartColor, backgroundColor: '#10b981'}}></div>
                        <span>Complete</span>
                      </div>
                      <div style={styles.chartValues}>
                        <span style={styles.chartValue}>{summary.complete}</span>
                        <span style={styles.chartPercentage}>({summary.completePercentage}%)</span>
                      </div>
                    </div>
                    <div style={styles.progressBarContainer}>
                      <div
                        style={{
                          ...styles.progressBar,
                          backgroundColor: '#10b981',
                          width: `${summary.completePercentage}%`
                        }}
                      />
                    </div>

                    <div style={{...styles.chartItem, marginTop: '0.75rem'}}>
                      <div style={styles.chartLegend}>
                        <div style={{...styles.chartColor, backgroundColor: '#ef4444'}}></div>
                        <span>Incomplete</span>
                      </div>
                      <div style={styles.chartValues}>
                        <span style={styles.chartValue}>{summary.incomplete}</span>
                        <span style={styles.chartPercentage}>({summary.incompletePercentage}%)</span>
                      </div>
                    </div>
                    <div style={styles.progressBarContainer}>
                      <div
                        style={{
                          ...styles.progressBar,
                          backgroundColor: '#ef4444',
                          width: `${summary.incompletePercentage}%`
                        }}
                      />
                    </div>

                    <div style={{...styles.chartItemLast, marginTop: '0.75rem'}}>
                      <div style={styles.chartLegend}>
                        <div style={{...styles.chartColor, backgroundColor: '#f59e0b'}}></div>
                        <span>Pending</span>
                      </div>
                      <div style={styles.chartValues}>
                        <span style={styles.chartValue}>{summary.pending}</span>
                        <span style={styles.chartPercentage}>({summary.pendingPercentage}%)</span>
                      </div>
                    </div>
                    <div style={styles.progressBarContainer}>
                      <div
                        style={{
                          ...styles.progressBar,
                          backgroundColor: '#f59e0b',
                          width: `${summary.pendingPercentage}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div style={styles.chartCard}>
                  <h3 style={styles.chartTitle}>Form Type Distribution</h3>
                  <div>
                    {formTypes.map((type, index) => {
                      const count = filteredApps.filter(app => app.formtype === type).length;
                      const percentage = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
                      return (
                        <div key={type} style={index === formTypes.length - 1 ? styles.chartItemLast : styles.chartItem}>
                          <span style={{textTransform: 'capitalize'}}>{type}</span>
                          <div style={styles.chartValues}>
                            <span style={styles.chartValue}>{count}</span>
                            <span style={styles.chartPercentage}>({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
