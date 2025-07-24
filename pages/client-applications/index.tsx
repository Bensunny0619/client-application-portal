import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ApplicationListPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApps, setFilteredApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("updated_at", { ascending: false });

      if (!error) {
        setApplications(data || []);
        setFilteredApps(data || []);
      }
      setLoading(false);
    };

    fetchApps();
  }, []);

  useEffect(() => {
    const results = applications.filter((app) =>
      app.clientname?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredApps(results);
  }, [search, applications]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f8fc",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            color: "#6b21a8",
          }}
        >
          All Applications
        </h1>

        <input
          type="text"
          placeholder="Search by client name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredApps.length === 0 ? (
          <p>No matching applications.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredApps.map((app) => (
              <li
                key={app.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "10px",
                  textAlign: "left",
                }}
              >
                <strong>{app.clientname}</strong> – {app.formtype} –{" "}
                <em>{app.status}</em>
                <br />
                <small>Submitted: {app.submitteddate || "N/A"}</small>
                <br />
                <Link href={`/client-applications/${app.id}`}>
                  <button
                    style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      background: "#4B0082",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    View / Edit
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
