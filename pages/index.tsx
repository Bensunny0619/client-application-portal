import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import "../src/app/globals.css";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navigation */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-purple-800">BATCHEWANA HEALTH CARE</h1>
          <nav className="space-x-4 flex items-center">
            <Link href="/" className="hover:text-purple-900 font-medium">Home</Link>
            <Link href="/login" className="hover:text-purple-900 font-medium">Login</Link>
            <Link href="/signup" className="hover:text-purple-900 font-medium">Signup</Link>
            <Link href="/client-applications" className="hover:text-purple-900 font-medium">Client Applications</Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-800 mb-6">
          Select a Form to Begin Application
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <Link href="/new?type=methadone" className="block p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            Methadone Application Form
          </Link>
          <Link href="/new?type=reimbursement" className="block p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            NHIB Reimbursement
          </Link>
          <Link href="/new?type=traditional" className="block p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            Traditional Healer Application
          </Link>
          <Link href="/new?type=appointment" className="block p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            Confirmation of Appointment
          </Link>
          <Link href="/new?type=transport" className="block p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-gray-200 text-center font-medium text-lg">
            NHIB Medical Transportation and Specialist Referral
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 mt-4 text-center text-sm text-purple-400">
        &copy; {new Date().getFullYear()} Batchewana First Nation Health Care. All rights reserved.
      </footer>
    </div>
  );
}
