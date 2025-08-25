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
      <div className="flex items-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.textColor,
            border: `1px solid ${statusInfo.color}`,
          }}
        >
          {statusInfo.status.charAt(0).toUpperCase() + statusInfo.status.slice(1)}
        </span>
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${statusInfo.completionPercentage}%`,
              backgroundColor: statusInfo.color,
            }}
          />
        </div>
        <span className="text-xs text-gray-600">{statusInfo.completionPercentage}%</span>
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
              All Applications
            </h1>
            <Link
              href="/reports"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition"
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{summary.complete}</div>
            <div className="text-sm text-gray-600">Complete ({summary.completePercentage}%)</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{summary.incomplete}</div>
            <div className="text-sm text-gray-600">Incomplete ({summary.incompletePercentage}%)</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
            <div className="text-sm text-gray-600">Pending ({summary.pendingPercentage}%)</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by client name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 text-purple-950 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 text-purple-950 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-950 focus:border-transparent"
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
          <div className="text-center py-8">
            <div className="text-purple-700 text-xl">Loading...</div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">No matching applications found.</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredApps.map((app) => (
                <div key={app.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{app.clientname}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {app.formtype}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        Submitted: {app.submitteddate || "N/A"}
                      </div>
                      <StatusBadge application={app} />
                    </div>
                    <div className="ml-4">
                      <Link href={`/client-applications/${app.id}`}>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition">
                          View / Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
