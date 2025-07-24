// pages/client-applications/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Application } from "../../types/application"; // Make sure path is correct

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading application:", error.message);
      } else {
        setApplication(data);
      }

      setLoading(false);
    };

    fetchApplication();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setApplication((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : null
    );
  };

  const handleSave = async () => {
    if (!application) return;
    setSaving(true);
    const { error } = await supabase
      .from("applications")
      .update({ ...application, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Error updating application: " + error.message);
    } else {
      alert("✅ Application updated successfully.");
    }
    setSaving(false);
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "40px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#6B21A8",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        📝 Edit Application Details
      </h1>

      {loading ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>Loading...</p>
      ) : !application ? (
        <p style={{ textAlign: "center", color: "#b91c1c" }}>
          ❌ Application not found.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {[
            { label: "Client Name", name: "clientname" },
            { label: "Form Type", name: "formtype" },
            { label: "Submitted Date", name: "submitteddate", type: "date" },
            { label: "Approval Date", name: "approvaldate", type: "date" },
            { label: "Approval Received Date", name: "approvalreceiveddate", type: "date" },
            { label: "Cheque Requisition Date", name: "chequerequisitiondate", type: "date" },
            { label: "Cheque Raised Date", name: "chequeraiseddate", type: "date" },
            { label: "Cheque Collected Date", name: "chequecollecteddate", type: "date" },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: "16px" }}>
              <label style={{ color: "#6B7280", display: "block", fontWeight: "bold" }}>
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type || "text"}
                value={(application as any)[field.name] || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  marginTop: "4px",
                  fontSize: "16px",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ color: "#6B7280", fontWeight: "bold", display: "block" }}>
              Status
            </label>
            <select
              name="status"
              value={application.status || ""}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                marginTop: "4px",
                fontSize: "16px",
              }}
            >
              <option value="">-- Select status --</option>
              <option value="incomplete">⏳ In Progress</option>
              <option value="complete">✅ Complete</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              background: "#6B21A8",
              color: "#fff",
              padding: "12px 24px",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%",
              marginTop: "20px",
            }}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
