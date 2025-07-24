// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';

// export default function EditApplicationPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [application, setApplication] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const defaultFields = {
//     clientName: '',
//     formType: '',
//     submittedDate: '',
//     approvalDate: '',
//     approvalReceivedDate: '',
//     hotelVoucherSubmitted: false,
//     flightBooked: false,
//     chequeRequisitionDate: '',
//     chequeRaisedDate: '',
//     chequeCollectedDate: '',
//     status: '',
//   };

//   const booleanFields = ['hotelVoucherSubmitted', 'flightBooked'];
//   const statusOptions = ['pending', 'in progress', 'approved', 'complete', 'rejected'];

//   useEffect(() => {
//     const fetchApp = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('applications')
//           .select('*')
//           .eq('id', id)
//           .single();

//         if (error) throw error;
//         setApplication({ ...defaultFields, ...data });
//       } catch (err) {
//         console.error('Error fetching application:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchApp();
//   }, [id]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setApplication({ ...application, [name]: value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const { error } = await supabase
//         .from('applications')
//         .update(application)
//         .eq('id', id);

//       if (error) throw error;

//       alert('✅ Application updated successfully!');
//       router.push('/client-applications');
//     } catch (error) {
//       console.error('Update error:', error);
//       alert('❌ Failed to update. Please try again.');
//     }
//   };

//   if (loading) return <p className="text-center mt-10 text-gray-700">Loading...</p>;
//   if (!application) return <p className="text-center mt-10 text-red-500">Application not found</p>;

//   const formatLabel = (str: string) =>
//     str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md">
//       <h2 className="text-3xl font-bold mb-6 text-purple-700 text-center">Edit Application</h2>

//       {application.status === 'complete' && (
//         <div className="mb-6 text-center">
//           <span className="inline-block bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full">
//             ✅ Application completed successfully
//           </span>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {Object.keys(defaultFields).map((field) => {
//           const value = application[field] ?? '';

//           if (booleanFields.includes(field)) {
//             return (
//               <div key={field}>
//                 <label className="block text-black font-medium mb-1">{formatLabel(field)}</label>
//                 <select
//                   name={field}
//                   value={value ? 'yes' : 'no'}
//                   onChange={(e) =>
//                     setApplication({ ...application, [field]: e.target.value === 'yes' })
//                   }
//                   className="w-full border border-gray-300 text-black rounded px-3 py-2"
//                 >
//                   <option value="yes">Yes</option>
//                   <option value="no">No</option>
//                 </select>
//               </div>
//             );
//           }

//           if (field === 'status') {
//             return (
//               <div key={field}>
//                 <label className="block text-black font-medium mb-1">Status</label>
//                 <select
//                   name="status"
//                   value={value}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 text-black rounded px-3 py-2"
//                 >
//                   <option value="">-- Select Status --</option>
//                   {statusOptions.map((option) => (
//                     <option key={option} value={option}>
//                       {option.charAt(0).toUpperCase() + option.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             );
//           }

//           if (field.toLowerCase().includes('date')) {
//             return (
//               <div key={field}>
//                 <label className="block text-black font-medium mb-1">{formatLabel(field)}</label>
//                 <input
//                   type="date"
//                   name={field}
//                   value={value}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 text-black rounded px-3 py-2"
//                 />
//               </div>
//             );
//           }

//           return (
//             <div key={field}>
//               <label className="block text-black font-medium mb-1">{formatLabel(field)}</label>
//               <input
//                 type="text"
//                 name={field}
//                 value={value}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 text-black rounded px-3 py-2"
//                 placeholder={formatLabel(field)}
//               />
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-8 text-center">
//         <button
//           onClick={handleSubmit}
//           className="bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-800 transition"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }
