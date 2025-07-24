// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';

// export default function NewApplicationPage() {
//   const router = useRouter();

//   const [application, setApplication] = useState({
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
//   });

//   const booleanFields = ['hotelVoucherSubmitted', 'flightBooked'];
//   const statusOptions = ['pending', 'in progress', 'approved', 'complete', 'rejected'];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setApplication((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     const { error } = await supabase.from('applications').insert([application]);

//     if (error) {
//       alert('Error creating application: ' + error.message);
//     } else {
//       alert('Application submitted!');
//       router.push('/client-applications');
//     }
//   };

//   const formatLabel = (str: string) =>
//     str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md">
//       <h2 className="text-3xl font-bold mb-6 text-purple-700 text-center">New Application</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {Object.entries(application).map(([field, value]) => {
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
//                   <option value="no">No</option>
//                   <option value="yes">Yes</option>
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
//           Submit Application
//         </button>
//       </div>
//     </div>
//   );
// }
