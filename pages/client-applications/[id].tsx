import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

interface Application {
  id: string;
  clientname: string;
  formtype: string;
  submitteddate: string | null;
  approvaldate: string | null;
  approvalreceiveddate: string | null;
  hotelvouchersubmitted: boolean;
  flightbooked: boolean;
  chequerequisitiondate: string | null;
  chequeraiseddate: string | null;
  chequecollecteddate: string | null;
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
    const target = e.target;
    const name = target.name;
    const type = target.type;
    const value =
      type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;

    if (!application) return;

    setApplication((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              value === "" && isDateField(name) ? null : value,
          }
        : prev
    );
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    const { id, ...updatePayload } = application;

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
    <div style={containerStyle}>
      <h1 style={titleStyle}>Edit {application.formtype} Application</h1>

      <form onSubmit={handleUpdate}>
        {formFields.map((field) => {
          const rawValue = application[field.name];
          const safeValue =
            typeof rawValue === "boolean" ? "" : rawValue || "";

          if (field.type === "checkbox") {
            return (
              <div style={fieldWrapperStyle} key={field.name}>
                <label>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={Boolean(rawValue)}
                    onChange={handleChange}
                  />{" "}
                  {field.label}
                </label>
              </div>
            );
          } else if (field.type === "select") {
            return (
              <div style={fieldWrapperStyle} key={field.name}>
                <label style={labelStyle}>{field.label}</label>
                <select
                  name={field.name}
                  value={String(rawValue)}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            );
          } else {
            return (
              <div style={fieldWrapperStyle} key={field.name}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={safeValue}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            );
          }
        })}

        <button type="submit" style={buttonStyle}>
          Update Application
        </button>
      </form>
    </div>
  );
}

const isDateField = (name: string) =>
  [
    "submitteddate",
    "approvaldate",
    "approvalreceiveddate",
    "chequerequisitiondate",
    "chequeraiseddate",
    "chequecollecteddate",
  ].includes(name);

// ---- Field Config ----
const formFields: {
  name: keyof Application;
  label: string;
  type: "text" | "date" | "checkbox" | "select";
  options?: string[];
}[] = [
  { name: "clientname", label: "Client Name", type: "text" },
  { name: "submitteddate", label: "Submitted Date", type: "date" },
  { name: "approvaldate", label: "Approval Date", type: "date" },
  {
    name: "approvalreceiveddate",
    label: "Approval Received Date",
    type: "date",
  },
  {
    name: "chequerequisitiondate",
    label: "Cheque Requisition Date",
    type: "date",
  },
  {
    name: "chequeraiseddate",
    label: "Cheque Raised Date",
    type: "date",
  },
  {
    name: "chequecollecteddate",
    label: "Cheque Collected Date",
    type: "date",
  },
  {
    name: "hotelvouchersubmitted",
    label: "Hotel Voucher Submitted",
    type: "checkbox",
  },
  {
    name: "flightbooked",
    label: "Flight Booked",
    type: "checkbox",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["pending", "incomplete", "complete"],
  },
];

// ---- Styles ----
const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "30px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  background: "#fff",
  boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
  fontFamily: `'Playfair Display', serif`,
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  marginBottom: "20px",
  color: "#4B0082",
};

const fieldWrapperStyle: React.CSSProperties = {
  marginBottom: "15px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "5px",
};

const inputStyle: React.CSSProperties = {
  width: "95%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#6b21a8",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
