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

  const StatusChart = () => {
    const total = summary.total;
    if (total === 0) return null;

    return (
      <div className="bg-white text-black p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-purple-950 mb-4">Status Distribution</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{summary.complete}</span>
              <span className="text-sm text-gray-500">({summary.completePercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${summary.completePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Incomplete</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{summary.incomplete}</span>
              <span className="text-sm text-gray-500">({summary.incompletePercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${summary.incompletePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{summary.pending}</span>
              <span className="text-sm text-gray-500">({summary.pendingPercentage}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${summary.pendingPercentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Reports & Analytics
            </h1>
            <Link
              href="/client-applications"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-purple-950 font-semibold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-purple-950 hover:text-purple-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 text-gray-950 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-950 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 text-gray-950 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-950 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 text-gray-950 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-950 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="complete">Complete</option>
                <option value="incomplete">Incomplete</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Type</label>
              <select
                value={formTypeFilter}
                onChange={(e) => setFormTypeFilter(e.target.value)}
                className="w-full px-3 text-gray-950 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-950 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {formTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
              <input
                type="text"
                placeholder="Search by client name..."
                value={clientNameFilter}
                onChange={(e) => setClientNameFilter(e.target.value)}
                className="w-full px-3 text-gray-950 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-950 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={filteredApps.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition"
              >
                Export to CSV
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={filteredApps.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition"
              >
                Export to Excel
              </button>
              <div className="text-sm text-gray-950 text-center">
                {filteredApps.length} records
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-purple-700 text-xl">Loading...</div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-green-600">{summary.complete}</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-red-600">{summary.incomplete}</div>
                <div className="text-sm text-gray-600">Incomplete</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <StatusChart />
              
              <div className="bg-white text-black p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-purple-950 mb-4">Form Type Distribution</h3>
                <div className="space-y-3">
                  {formTypes.map(type => {
                    const count = filteredApps.filter(app => app.formtype === type).length;
                    const percentage = summary.total > 0 ? Math.round((count / summary.total) * 100) : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="capitalize">{type}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{count}</span>
                          <span className="text-sm text-gray-500">({percentage}%)</span>
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
  );
}
