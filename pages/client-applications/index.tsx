// pages/new.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { Application } from "../types/application";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

 
export default function NewApplicationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Application>>({
    clientname: "",
    formtype: "",
    submitteddate: "",
    status: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("applications").insert([
      {
        ...formData,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert("❌ Error creating application: " + error.message);
    } else {
      alert("✅ Application created successfully.");
      router.push("/");
    }

    setSubmitting(false);
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
        🆕 Create New Application
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Client Name</label>
          <input
            name="clientname"
            value={formData.clientname || ""}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Form Type</label>
          <input
            name="formtype"
            value={formData.formtype || ""}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Submitted Date</label>
          <input
            type="date"
            name="submitteddate"
            value={formData.submitteddate || ""}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Status</label>
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "4px",
            }}
          >
            <option value="">-- Select Status --</option>
            <option value="incomplete">⏳ In Progress</option>
            <option value="complete">✅ Complete</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
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
          {submitting ? "Submitting..." : "🚀 Submit"}
        </button>
      </form>
    </div>
  );
}
 // ...