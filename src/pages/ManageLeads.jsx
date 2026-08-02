import { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

function ManageLeads() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const fetchLeads = (pageNum = 1) => {
    apiFetch(`/project-cost/leads?page=${pageNum}&limit=20`)
      .then((res) => {
        setLeads(res.data || []);
        setMeta(res.meta || null);
        setPage(pageNum);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await apiFetch(`/project-cost/leads/${id}`, { method: 'DELETE' });
      setLeads((current) => current.filter((lead) => lead.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } catch {
      // handled by apiFetch
    }
  };

  const viewDetail = async (id) => {
    try {
      const lead = await apiFetch(`/project-cost/leads/${id}`, { suppressToast: true });
      setSelectedLead(lead);
    } catch {
      // handled by apiFetch
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Project Cost Leads</h2>
      <p className="mt-1 text-sm text-gray-500">
        All leads generated from the AI Project Cost Planner
      </p>

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Lead Details — {selectedLead.name || 'Anonymous'}
              </h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Contact Info */}
              <Section title="Contact Information">
                <KV label="Name" value={selectedLead.name} />
                <KV label="Email" value={selectedLead.email} />
                <KV label="Phone" value={selectedLead.phone} />
                <KV label="Company" value={selectedLead.company} />
              </Section>

              {/* Project Details */}
              <Section title="Project Details">
                <KV label="Complexity" value={selectedLead.complexity} />
                <KV label="Developer Cost" value={`₹${selectedLead.developerCost?.toLocaleString('en-IN')}`} />
                <KV label="Third Party Cost" value={`₹${selectedLead.thirdPartyCost?.toLocaleString('en-IN')}`} />
                <KV label="Recurring Cost" value={`₹${selectedLead.recurringCost?.toLocaleString('en-IN')}/month`} />
                <KV label="Total Cost" value={`₹${selectedLead.totalCost?.toLocaleString('en-IN')}`} bold />
              </Section>

              {/* Services */}
              <Section title="Services Selected">
                <div className="flex flex-wrap gap-1">
                  {(selectedLead.servicesSelected || []).map((s) => (
                    <span key={s} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>

              {/* Timeline */}
              {selectedLead.estimatedTimeline && (
                <Section title="Timeline">
                  {Object.entries(selectedLead.estimatedTimeline).map(([phase, days]) => (
                    <KV key={phase} label={phase} value={`${days} days`} />
                  ))}
                </Section>
              )}

              {/* Deliverables */}
              {selectedLead.deliverables?.length > 0 && (
                <Section title="Deliverables">
                  <div className="flex flex-wrap gap-1">
                    {selectedLead.deliverables.map((d) => (
                      <span key={d} className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {/* AI Summary */}
              {selectedLead.aiSummary && (
                <Section title="AI Summary">
                  <p className="text-gray-700">{selectedLead.aiSummary}</p>
                </Section>
              )}

              {/* Q&A */}
              {selectedLead.aiAnswers && Object.keys(selectedLead.aiAnswers).length > 0 && (
                <Section title="Questionnaire Answers">
                  {Object.entries(selectedLead.aiAnswers).map(([key, val]) => (
                    <KV key={key} label={key} value={typeof val === 'object' ? JSON.stringify(val) : String(val)} />
                  ))}
                </Section>
              )}

              {/* Tracking */}
              <Section title="Tracking">
                <KV label="WhatsApp Clicked" value={selectedLead.whatsappClicked ? '✅ Yes' : '❌ No'} />
                <KV label="PDF Downloaded" value={selectedLead.pdfDownloaded ? '✅ Yes' : '❌ No'} />
                <KV label="Created" value={new Date(selectedLead.createdAt).toLocaleString('en-IN')} />
              </Section>
            </div>
          </div>
        </div>
      )}

      {/* Leads table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Name</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Email</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Services</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Complexity</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Total Cost</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">WA</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">PDF</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Date</th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  No leads yet. They will appear here when visitors use the AI Project Cost Planner.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.name || '—'}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{lead.email || '—'}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(lead.servicesSelected || []).slice(0, 2).map((s) => (
                      <span key={s} className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs text-indigo-600">
                        {s}
                      </span>
                    ))}
                    {(lead.servicesSelected || []).length > 2 && (
                      <span className="text-xs text-gray-400">+{lead.servicesSelected.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    lead.complexity === 'enterprise' ? 'bg-red-100 text-red-700' :
                    lead.complexity === 'advanced' ? 'bg-orange-100 text-orange-700' :
                    lead.complexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {lead.complexity}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">₹{lead.totalCost?.toLocaleString('en-IN')}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {lead.whatsappClicked ? '✅' : '—'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {lead.pdfDownloaded ? '✅' : '—'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </td>
                <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => viewDetail(lead.id)}
                    className="px-2 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="px-2 py-1 text-xs font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages} ({meta.total} total leads)
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => fetchLeads(page - 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => fetchLeads(page + 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helper components ──
function Section({ title, children }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function KV({ label, value, bold }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className={`text-right ${bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}

export default ManageLeads;
