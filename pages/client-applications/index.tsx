import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { getApplicationStatus, getApplicationSummary } from "@/lib/utils/applicationStatus";

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
  reportsButton: {
    backgroundColor: '#9333ea',
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
  homeButton: {
    backgroundColor: '#2563eb',
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
  navButtonContainer: {
    display: 'flex',
    gap: '1rem',
  },
  mainContent: {
    maxWidth: '72rem',
    margin: '0 auto',
    padding: '1.5rem 1rem',
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
  filtersCard: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    marginBottom: '1.5rem',
  },
  filtersGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    outline: 'none',
    color: '#374151',
    backgroundColor: '#ffffff',
  },
  selectInput: {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#374151',
  },
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '2rem 0',
  },
  loadingText: {
    color: '#7c3aed',
    fontSize: '1.25rem',
  },
  noResultsContainer: {
    textAlign: 'center' as const,
    padding: '2rem 0',
  },
  noResultsText: {
    color: '#6b7280',
  },
  applicationsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  applicationItem: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  },
  applicationFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  applicationContent: {
    flex: 1,
  },
  applicationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  applicationName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  formTypeBadge: {
    fontSize: '0.875rem',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
  },
  submittedDate: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '0.75rem',
  },
  statusBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '4rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '0.5rem',
  },
  progressBar: {
    height: '0.5rem',
    borderRadius: '9999px',
  },
  progressText: {
    fontSize: '0.75rem',
    color: '#4b5563',
  },
  viewButton: {
    backgroundColor: '#9333ea',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    textDecoration: 'none',
    display: 'inline-block',
    marginLeft: '1rem',
  },
};

// Media query styles for responsive design
const mediaQueries = `
  @media (min-width: 768px) {
    .summary-grid {
      grid-template-columns: repeat(4, 1fr);
    }
    .filters-grid {
      flex-direction: row;
    }
    .select-width {
      width: 12rem;
    }
  }
  
  .reports-button:hover {
    background-color: #7c3aed;
  }
  
  .view-button:hover {
    background-color: #7c3aed;
  }
  
  .application-item:hover {
    background-color: #f9fafb;
  }
  
  .search-input:focus {
    ring: 2px solid #9333ea;
    border-color: transparent;
  }
  
  .select-input:focus {
    ring: 2px solid #9333ea;
    border-color: transparent;
  }
`;

export default function ApplicationListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApps, setFilteredApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
    let results = applications.filter((app) =>
      app.clientname?.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "all") {
      results = results.filter((app) => {
        const statusInfo = getApplicationStatus(app);
        return statusInfo.status === statusFilter;
      });
    }

    setFilteredApps(results);
  }, [search, applications, statusFilter]);

  const summary = getApplicationSummary(applications);

  const StatusBadge = ({ application }: { application: Application }) => {
    const statusInfo = getApplicationStatus(application);
    return (
      <div style={styles.statusBadgeContainer}>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.textColor,
            border: `1px solid ${statusInfo.color}`,
          }}
        >
          {statusInfo.status.charAt(0).toUpperCase() + statusInfo.status.slice(1)}
        </span>
        <div style={styles.progressBarContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${statusInfo.completionPercentage}%`,
              backgroundColor: statusInfo.color,
            }}
          />
        </div>
        <span style={styles.progressText}>{statusInfo.completionPercentage}%</span>
      </div>
    );
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
                All Applications
              </h1>
              <div style={styles.navButtonContainer}>
                <Link href="/reports">
                  <button style={styles.reportsButton} className="reports-button">
                    View Reports
                  </button>
                </Link>
                <Link href="/home">
                  <button style={styles.homeButton} className="home-button">
                    Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.mainContent}>
          {/* Summary Cards */}
          <div style={{...styles.summaryGrid, display: 'flex', flexWrap: 'wrap'}} className="summary-grid">
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>{summary.total}</div>
              <div style={styles.summaryLabel}>Total Applications</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumberGreen}>{summary.complete}</div>
              <div style={styles.summaryLabel}>Complete ({summary.completePercentage}%)</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumberRed}>{summary.incomplete}</div>
              <div style={styles.summaryLabel}>Incomplete ({summary.incompletePercentage}%)</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumberYellow}>{summary.pending}</div>
              <div style={styles.summaryLabel}>Pending ({summary.pendingPercentage}%)</div>
            </div>
          </div>

          {/* Filters */}
          <div style={styles.filtersCard}>
            <div style={{...styles.filtersGrid, flexDirection: 'column'}} className="filters-grid">
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Search by client name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                  className="search-input"
                />
              </div>
              <div className="select-width">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.selectInput}
                  className="select-input"
                >
                  <option value="all">All Status</option>
                  <option value="complete">Complete</option>
                  <option value="incomplete">Incomplete</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingText}>Loading...</div>
            </div>
          ) : filteredApps.length === 0 ? (
            <div style={styles.noResultsContainer}>
              <div style={styles.noResultsText}>No matching applications found.</div>
            </div>
          ) : (
            <div style={styles.applicationsCard}>
              {filteredApps.map((app, index) => (
                <div 
                  key={app.id} 
                  style={{
                    ...styles.applicationItem,
                    borderBottom: index === filteredApps.length - 1 ? 'none' : '1px solid #e5e7eb'
                  }}
                  className="application-item"
                >
                  <div style={styles.applicationFlex}>
                    <div style={styles.applicationContent}>
                      <div style={styles.applicationHeader}>
                        <h3 style={styles.applicationName}>{app.clientname}</h3>
                        <span style={styles.formTypeBadge}>
                          {app.formtype}
                        </span>
                      </div>
                      <div style={styles.submittedDate}>
                        Submitted: {app.submitteddate || "N/A"}
                      </div>
                      <StatusBadge application={app} />
                    </div>
                    <div>
                      <Link href={`/client-applications/${app.id}`}>
                        <button style={styles.viewButton} className="view-button">
                          View / Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
