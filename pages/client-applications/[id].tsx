import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

interface Application {
  id: string;
  clientname: string;
  formtype: string;
  submitteddate: string;
  approvaldate: string;
  approvalreceiveddate: string;
  hotelvouchersubmitted: boolean;
  flightbooked: boolean;
  chequerequisitiondate: string;
  chequeraiseddate: string;
  chequecollecteddate: string;
  status: string;
}

export default function EditApplicationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchApplication = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setApplication(data);
    };
    fetchApplication();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    if (!application) return;

    setApplication({
      ...application,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    const { id: _, ...updatePayload } = application;

    const { error } = await supabase
      .from("applications")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("❌ Supabase error:", error);
      alert("❌ Update failed: " + error.message);
    } else {
      alert("✅ Application updated!");
      router.push("/client-applications");
    }
  };

  if (!application) return <p>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#4B0082" }}>
        Edit {application.formtype} Application
      </h1>

      <form onSubmit={handleUpdate}>
        {[
          { label: "Client Name", name: "clientname", type: "text" },
          { label: "Submitted Date", name: "submitteddate", type: "date" },
          { label: "Approval Date", name: "approvaldate", type: "date" },
          {
            label: "Approval Received Date",
            name: "approvalreceiveddate",
            type: "date",
          },
          {
            label: "Cheque Requisition Date",
            name: "chequerequisitiondate",
            type: "date",
          },
          {
            label: "Cheque Raised Date",
            name: "chequeraiseddate",
            type: "date",
          },
          {
            label: "Cheque Collected Date",
            name: "chequecollecteddate",
            type: "date",
          },
        ].map((field) => (
          <div style={{ marginBottom: "15px" }} key={field.name}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={(application as any)[field.name] || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Checkboxes */}
        {[
          {
            label: "Hotel Voucher Submitted",
            name: "hotelvouchersubmitted",
            checked: application.hotelvouchersubmitted,
          },
          {
            label: "Flight Booked",
            name: "flightbooked",
            checked: application.flightbooked,
          },
        ].map((cb) => (
          <div style={{ marginBottom: "15px" }} key={cb.name}>
            <label>
              <input
                type="checkbox"
                name={cb.name}
                checked={cb.checked}
                onChange={handleChange}
              />{" "}
              {cb.label}
            </label>
          </div>
        ))}

        {/* Status Select */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Status
          </label>
          <select
            name="status"
            value={application.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b21a8",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Update Application
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "95%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "5px",
};
