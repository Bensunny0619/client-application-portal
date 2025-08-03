// pages/client-applications/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

interface Application {
  id: string;
  clientname: string;
  formtype: string;
  submitted_date: string;
  approved_date: string;
  approval_received: boolean;
  hotel_submitted: boolean;
  virtual_submitted: boolean;
  flight_booked: boolean;
  check_requisition_date: string;
  check_raised_date: string;
  check_collected_date: string;
  status: string;
}

export default function EditApplicationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchApplication = async () => {
      const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
      if (error) {
        console.error(error);
      } else {
        setApplication(data);
      }
    };
    fetchApplication();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;

    if (!application) return;
    setApplication({
      ...application,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;
    const { error } = await supabase.from('applications').update(application).eq('id', id);
    if (error) {
      alert('Update failed.');
      console.error(error);
    } else {
      alert('Application updated!');
      router.push('/client-applications');
    }
  };

  if (!application) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Edit Application</h1>
      <form onSubmit={handleUpdate} className="form">
        <label>
          Client Name:
          <input name="clientname" value={application.clientname} onChange={handleChange} required />
        </label>
        <label>
          Form Type:
          <input name="formtype" value={application.formtype} onChange={handleChange} required />
        </label>
        <label>
          Submitted Date:
          <input name="submitted_date" type="date" value={application.submitted_date} onChange={handleChange} />
        </label>
        <label>
          Approved Date:
          <input name="approved_date" type="date" value={application.approved_date} onChange={handleChange} />
        </label>
        <label>
          Approval Received:
          <input name="approval_received" type="checkbox" checked={application.approval_received} onChange={handleChange} />
        </label>
        <label>
          Hotel Submitted:
          <input name="hotel_submitted" type="checkbox" checked={application.hotel_submitted} onChange={handleChange} />
        </label>
        <label>
          Virtual Submitted:
          <input name="virtual_submitted" type="checkbox" checked={application.virtual_submitted} onChange={handleChange} />
        </label>
        <label>
          Flight Booked:
          <input name="flight_booked" type="checkbox" checked={application.flight_booked} onChange={handleChange} />
        </label>
        <label>
          Check Requisition Date:
          <input name="check_requisition_date" type="date" value={application.check_requisition_date} onChange={handleChange} />
        </label>
        <label>
          Check Raised Date:
          <input name="check_raised_date" type="date" value={application.check_raised_date} onChange={handleChange} />
        </label>
        <label>
          Check Collected Date:
          <input name="check_collected_date" type="date" value={application.check_collected_date} onChange={handleChange} />
        </label>
        <label>
          Status:
          <select name="status" value={application.status} onChange={handleChange}>
            <option value="">Select status</option>
            <option value="in progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
