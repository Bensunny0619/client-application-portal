import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { getTargetInfo } from "../utils/formUtils";


interface ApplicationPayload {
  clientname: string;
  submitteddate: string;
  approvaldate?: string;
  approvalreceiveddate?: string;
  hotelvouchersubmitted?: boolean;
  flightbooked?: boolean;
  chequerequisitiondate?: string;
  chequeraiseddate?: string;
  chequecollecteddate?: string;
  formtype: string;
  status: string;
  updated_at: string;
}

export default function NewApplicationPage() {
  const router = useRouter();
  const formType = (router.query.type as string) || "Application";

  const [formData, setFormData] = useState({
    clientname: "",
    submitteddate: "",
    approvaldate: "",
    approvalreceiveddate: "",
    hotelvouchersubmitted: false,
    flightbooked: false,
    chequerequisitiondate: "",
    chequeraiseddate: "",
    chequecollecteddate: "",
    status: "incomplete",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = getTargetInfo(e);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    const payload: ApplicationPayload = {
      clientname: formData.clientname,
      submitteddate: formData.submitteddate,
      formtype: formType || "unspecified",
      status: isDraft ? "incomplete" : formData.status,
      updated_at: new Date().toISOString(),
    };

    if (formData.approvaldate) payload.approvaldate = formData.approvaldate;
    if (formData.approvalreceiveddate) payload.approvalreceiveddate = formData.approvalreceiveddate;
    if (formData.hotelvouchersubmitted !== undefined) payload.hotelvouchersubmitted = formData.hotelvouchersubmitted;
    if (formData.flightbooked !== undefined) payload.flightbooked = formData.flightbooked;
    if (formData.chequerequisitiondate) payload.chequerequisitiondate = formData.chequerequisitiondate;
    if (formData.chequeraiseddate) payload.chequeraiseddate = formData.chequeraiseddate;
    if (formData.chequecollecteddate) payload.chequecollecteddate = formData.chequecollecteddate;

    const { error: insertError } = await supabase.from("applications").insert([payload]);

    if (insertError) {
      alert("❌ Error: " + insertError.message);
      console.error("Insert error:", insertError);
    } else {
      if (!isDraft && formData.status === "complete") {
        const { error: notifError } = await supabase.from("notifications").insert([
          {
            message: `${formData.clientname}'s ${formType} application was marked complete.`,
            created_at: new Date().toISOString(),
          },
        ]);

        if (notifError) {
          console.error("❌ Notification error:", notifError.message);
        }
      }

      alert(isDraft ? "📝 Draft saved!" : "✅ Application submitted successfully!");
      router.push("/home");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "30px", border: "#ccc", borderRadius: "10px", background: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#4B0082" }}>
        New {formType} Application
      </h1>
      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            name="clientname"
            placeholder="Client Name"
            value={formData.clientname}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Submitted Date</label>
          <input
            type="date"
            name="submitteddate"
            value={formData.submitteddate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Approval Date</label>
          <input type="date" name="approvaldate" value={formData.approvaldate} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Approval Received Date</label>
          <input type="date" name="approvalreceiveddate" value={formData.approvalreceiveddate} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            <input type="checkbox" name="hotelvouchersubmitted" checked={formData.hotelvouchersubmitted} onChange={handleChange} /> Hotel Voucher Submitted
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            <input type="checkbox" name="flightbooked" checked={formData.flightbooked} onChange={handleChange} /> Flight Booked
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Cheque Requisition Date</label>
          <input type="date" name="chequerequisitiondate" value={formData.chequerequisitiondate} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Cheque Raised Date</label>
          <input type="date" name="chequeraiseddate" value={formData.chequeraiseddate} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Cheque Collected Date</label>
          <input type="date" name="chequecollecteddate" value={formData.chequecollecteddate} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
            <option value="incomplete">Incomplete</option>
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#6b21a8",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "95%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "5px"
};
