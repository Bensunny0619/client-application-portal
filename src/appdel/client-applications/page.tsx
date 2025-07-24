// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase'; // Adjust the path as needed

// export default function ClientApplications() {
//   const [clientName, setClientName] = useState('');
//   const [applications, setApplications] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const fetchApplications = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('applications')
//         .select('*')
//         .order('updated_at', { ascending: false });

//       if (error) {
//         console.error('Supabase fetch error:', error.message);
//         setApplications([]);
//         return;
//       }

//       let filtered = data;

//       if (clientName.trim() !== '') {
//         filtered = data.filter((app: any) =>
//           app.clientName?.toLowerCase().includes(clientName.toLowerCase())
//         );
//       }

//       setApplications(filtered);
//     } catch (err) {
//       console.error('Unexpected error fetching from Supabase:', err);
//       setApplications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this application?');
//     if (!confirmDelete) return;

//     const { error } = await supabase.from('applications').delete().eq('id', id);

//     if (error) {
//       console.error('Failed to delete application:', error.message);
//     } else {
//       fetchApplications(); // Refresh list
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-purple-700">📋 Client Applications</h1>

//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Search by client name"
//           value={clientName}
//           onChange={(e) => setClientName(e.target.value)}
//           className="border border-gray-300 p-2 rounded-md flex-1 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />
//         <button
//           onClick={fetchApplications}
//           className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
//         >
//           Search
//         </button>
//         {clientName && (
//           <button
//             onClick={() => {
//               setClientName('');
//               fetchApplications();
//             }}
//             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
//           >
//             Reset
//           </button>
//         )}
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-600">Loading...</p>
//       ) : applications.length === 0 ? (
//         <p className="text-center text-gray-500">No applications found.</p>
//       ) : (
//         <div className="space-y-4">
//           {applications.map((app) => (
//             <div
//               key={app.id}
//               className="border border-gray-200 p-5 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
//             >
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
//                 <p><strong>👤 Client:</strong> {app.clientName || '—'}</p>
//                 <p><strong>📅 Submitted:</strong> {app.submittedDate || '—'}</p>
//                 <p><strong>✅ Approval:</strong> {app.approvalDate || 'Pending'}</p>
//                 <p><strong>📥 Approval Received:</strong> {app.approvalReceivedDate || '—'}</p>
//                 <p><strong>🏨 Hotel Voucher:</strong> {app.hotelVoucherSubmitted ? 'Yes' : 'No'}</p>
//                 <p><strong>✈️ Flight Booked:</strong> {app.flightBooked ? 'Yes' : 'No'}</p>
//                 <p><strong>💸 Cheque Requisition:</strong> {app.chequeRequisitionDate || '—'}</p>
//                 <p><strong>📝 Cheque Raised:</strong> {app.chequeRaisedDate || '—'}</p>
//                 <p><strong>📦 Cheque Collected:</strong> {app.chequeCollectedDate || '—'}</p>

//                 <div className="sm:col-span-2 mt-2">
//                   {app.status === 'complete' ? (
//                     <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
//                       ✅ Application completed successfully
//                     </span>
//                   ) : (
//                     <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
//                       ⏳ In progress
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-3">
//                 <button
//                   onClick={() => router.push(`/client-applications/${app.id}`)}
//                   className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(app.id)}
//                   className="text-sm text-red-600 hover:text-red-800 font-medium"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
