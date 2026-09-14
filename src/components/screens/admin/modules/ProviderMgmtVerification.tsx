import React, { ReactNode, useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, FileText, Search, Eye, X, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { supabase } from "../../../../supabase";
import { useNotifications } from '../NotificationContext';
type Status = 'Pending' | 'Approved' | 'Rejected';

interface ProviderRow {
    id: string;
    providerId: string;

    name: string;
    email: string;
    phone: string;
    city: string;

    avatar: string;

    services: string[];

    status: Status;

    submitted: string;

    documentType: string;
    documentStatus: Status;
}
interface ProviderDetails {
  id: string;

  name: string;
  email: string;
  phone: string;
  city: string;

  avatar: string;

  services: string[];

  bio: string;

  document: {
    type: string;
    status: Status;
    uploaded: string;
    signedUrl: string;
  };
}


function statusBadge(s: Status) {
  if (s === 'Pending')  return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
  if (s === 'Approved') return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
  if (s === 'Rejected') return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
  return '';
}


// Skeleton row for loading state
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${50 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}




export function ProviderMgmtVerification() {
    const { push } = useNotifications();
  const [providers, setProviders] = useState<ProviderRow[]>([]);
const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | Status>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ProviderDetails | null>(null);
  const [noteInput, setNoteInput] = useState('');
  
  const loadProviders = async () => {
  try {
    setLoading(true);

    const { data, error } =
      await supabase.functions.invoke(
        "admin_get_provider_verifications"
      );

    if (error) throw error;

    if (data?.success) {
      setProviders(data.providers);
      console.log(data.providers);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadProviders();
}, []);

  const pending  = providers.filter(p => p.status === 'Pending').length;
  const approved = providers.filter(p => p.status === 'Approved').length;
  const rejected = providers.filter(p => p.status === 'Rejected').length;
  const totalDocs = providers.length;

  const filtered = providers.filter(p =>
    (activeTab === 'All' || p.status === activeTab) &&
    (!search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.city.toLowerCase().includes(search.toLowerCase()))
  );

const openDrawer = async (providerId: string) => {
  try {
    const { data, error } =
      await supabase.functions.invoke(
        "admin_get_provider_document",
        {
          body: {
            providerId,
          },
        }
      );

    if (error) throw error;

    if (data?.success) {
      setSelected(data.provider);
      setNoteInput("");
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Page title */}
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-1">Provider Verification</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Review identity documents submitted by Rent-a-Friend providers before allowing them to go online.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Pending Verification',   value: pending,  icon: Clock,        color: 'amber', desc: 'Providers waiting for approval'    },
          { title: 'Approved Providers',     value: approved, icon: CheckCircle,  color: 'green', desc: 'Identity verified providers'       },
          { title: 'Rejected Applications',  value: rejected, icon: XCircle,      color: 'red',   desc: 'Rejected identity verification'    },
          { title: 'Total Documents',        value: totalDocs,icon: FileText,     color: 'blue',  desc: 'Documents uploaded'                },
        ].map(k => {
          const Icon = k.icon;
          const bg = { amber: 'bg-amber-50 dark:bg-amber-500/10', green: 'bg-green-50 dark:bg-green-500/10', red: 'bg-red-50 dark:bg-red-500/10', blue: 'bg-blue-50 dark:bg-blue-500/10' }[k.color];
          const ic = { amber: 'text-amber-600 dark:text-amber-400', green: 'text-green-600 dark:text-green-400', red: 'text-red-600 dark:text-red-400', blue: 'text-blue-600 dark:text-blue-400' }[k.color];
          return (
            <div key={k.title} className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${ic}`} />
              </div>
              <p className="text-2xl text-gray-900 dark:text-white mb-1">{k.value}</p>
              <p className="text-sm text-gray-900 dark:text-white mb-0.5">{k.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{k.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status tabs */}
        <div className="flex gap-2">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-[#1A1F2E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-1.5 text-xs opacity-75">
                  {tab === 'Pending' ? pending : tab === 'Approved' ? approved : rejected}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-56 flex items-center gap-2 bg-white dark:bg-[#1A1F2E] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by provider name, phone or city..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Profile', 'Provider', 'Phone', 'City', 'Document', 'Submitted', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading
                ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                : filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                    {/* Profile */}
                    <td className="px-5 py-3.5">
                      <img
    src={p.avatar}
    alt={p.name}
    className="w-10 h-10 rounded-full object-cover"
/>
                    </td>
                    {/* Provider */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-gray-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">{p.id}</p>
                    </td>
                    {/* Phone */}
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.phone}</td>
                    {/* City */}
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.city}</td>
                    {/* Document */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                       p.documentType === "Aadhaar"
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                          : 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                      }`}>
                        {<FileText className="w-3 h-3" />} {p.documentType}
                      </span>
                    </td>
                    {/* Submitted */}
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.submitted}</td>
                    {/* Status */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${statusBadge(p.documentStatus)}`}>{p.documentStatus}</span>
                    </td>
                    {/* Action */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => openDrawer(p.providerId)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-amber-600 dark:border-amber-500/40 text-amber-600 dark:text-amber-600 rounded-lg hover:bg-amber-300 dark:hover:bg-amber-500/10 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="py-20 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-sm">No provider applications found.</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Try adjusting your filters or search term.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Drawer */}
      {selected && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-white dark:bg-[#1A1F2E] border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col">

            {/* Drawer Header */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-start gap-4">
                <img
                  src={selected.avatar}
                  alt={selected.name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg text-gray-900 dark:text-white">{selected.name}</h2>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">{selected.id}</p>
                  <span className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full ${statusBadge(selected.document.status)}`}>{selected.document.status}</span>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Section 1 — Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 space-y-3">
                <h3 className="text-sm text-gray-900 dark:text-white mb-3">Basic Information</h3>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">Email</span>
                  <span className="text-xs text-gray-900 dark:text-white truncate">{selected.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">Phone</span>
                  <span className="text-xs text-gray-900 dark:text-white">{selected.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">City</span>
                  <span className="text-xs text-gray-900 dark:text-white">{selected.city}</span>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">Services</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.services.map(s => (
                      <span key={s} className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2 — Identity Verification */}
              <div className="space-y-3">
                <h3 className="text-sm text-gray-900 dark:text-white">Identity Verification</h3>

                {/* Doc meta row */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{<FileText className="w-6 h-6 text-blue-500" />}</span>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{selected.document.type === 'Aadhaar' ? 'Aadhaar Card' : 'PAN Card'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Uploaded {selected.document.uploaded}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusBadge(selected.document.status)}`}>{selected.document.status}</span>
                </div>

                {/* Document preview */}
               <img
  src={selected.document.signedUrl}
  alt="Identity Document"
  className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
/>

                {/* Open full size / Download */}
                <div className="flex gap-3">
                 <button
onClick={()=>{
window.open(
selected.document.signedUrl,
"_blank"
)
}}
className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
>
                    <Eye className="w-4 h-4" /> Open Full Size
                  </button>
                  <button
onClick={()=>{
window.open(
selected.document.signedUrl,
"_blank"
)
}}
className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
>
                    <FileText className="w-4 h-4" /> Download
                  </button>
                </div>
              </div>

              {/* Section 3 — Admin Notes */}
              <div className="space-y-2">
                <h3 className="text-sm text-gray-900 dark:text-white">Admin Notes</h3>
                <textarea
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  rows={3}
                  placeholder="Enter rejection reason or internal notes..."
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

            </div>

            {/* Sticky bottom action bar */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1F2E] flex gap-3">
              <button
               onClick={async () => {
  const { error } =
    await supabase.functions.invoke(
      "admin_reject_provider",
      {
        body: {
          providerId: selected.id,
          reason: noteInput,
        },
      }
    );

  if (!error) {
    setSelected(null);
    loadProviders();
  }
}}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white text-sm rounded-xl transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject Provider
              </button>
              <button
                onClick={async () => {
  const { error } =
    await supabase.functions.invoke(
      "admin_approve_provider",
      {
        body: {
          providerId: selected.id,
        },
      }
    );

  if (!error) {
    setSelected(null);
    loadProviders();
  }
}}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white text-sm rounded-xl transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Approve Provider
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
