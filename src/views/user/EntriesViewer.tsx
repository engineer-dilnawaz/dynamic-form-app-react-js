import { useState } from 'react';
import { useEntryStore } from '../../stores/useEntryStore';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { CustomSelect, type Option } from '../../components/ui/CustomSelect';
import { X, Eye } from 'lucide-react';
import type { FormEntry } from '../../types';

export default function EntriesViewer() {
  const { entries } = useEntryStore();
  const { schemas, getSchema } = useSchemaStore();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<FormEntry | null>(null);

  const filteredEntries = entries.filter((entry) => {
      const matchCategory = filterCategory === 'all' || entry.categoryId === filterCategory;
      const matchDate = !filterDate || entry.submittedAt.startsWith(filterDate);
      return matchCategory && matchDate;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const filterOptions: Option[] = [
      { label: 'All Forms', value: 'all' },
      ...schemas.map(s => ({ label: s.name, value: s.id }))
  ];

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
           <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white tracking-tight">Entries</h1>
                <p className="text-brand-muted mt-1">View and filter form submissions.</p>
           </div>
      </div>

      {/* Filters */}
      <Card className="p-1 bg-brand-surface border-brand-border">
          <div className="flex flex-col md:flex-row gap-4 p-4 items-end">
              <div className="w-full md:w-1/3">
                  <CustomSelect
                    label="Form Type"
                    value={filterCategory}
                    onChange={(val) => setFilterCategory(val)}
                    options={filterOptions}
                  />
              </div>
              <div className="w-full md:w-1/3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1 mb-1 block">Date</label>
                  <input 
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-brand-border bg-brand-input px-3 py-2 text-brand-text text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all [color-scheme:dark]"
                  />
              </div>
              <div className="w-full md:w-auto pb-[1px]">
                  <Button variant="secondary" onClick={() => { setFilterCategory('all'); setFilterDate(''); }} className="w-full md:w-auto h-12">
                      <X className="w-4 h-4 mr-2" />
                      Clear Filter
                  </Button>
              </div>
          </div>
      </Card>

      {/* Results */}
        <div className="grid grid-cols-1 gap-4">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-16 bg-brand-surface/30 rounded-2xl border border-dashed border-brand-border">
                <p className="text-brand-muted">No entries found matching filters.</p>
            </div>
          ) : (
             <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="bg-brand-surface border-b border-brand-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Form Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider">Date Submitted</th>
                                <th className="px-6 py-4 text-xs font-bold text-brand-muted uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {sortedEntries.map((entry) => {
                                const schema = getSchema(entry.categoryId);
                                return (
                                    <tr key={entry.id} className="hover:bg-brand-border/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-[0_0_10px_rgba(43,238,121,0.1)]">
                                                Success
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{schema?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-sm text-brand-muted font-mono tracking-tight">{new Date(entry.submittedAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(entry)}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Data
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
             </div>
          )}
        </div>

        {/* View Data Modal */}
        <Modal 
            isOpen={!!selectedEntry} 
            onClose={() => setSelectedEntry(null)}
            title={selectedEntry ? (getSchema(selectedEntry.categoryId)?.name || 'Entry Details') : 'Details'}
        >
             {selectedEntry && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm text-brand-muted pb-4 border-b border-brand-border">
                        <span>ID: <span className="font-mono text-white">{selectedEntry.id}</span></span>
                        <span>{new Date(selectedEntry.submittedAt).toLocaleString()}</span>
                    </div>
                    
                    <div className="bg-brand-dark rounded-xl p-4 border border-brand-border font-mono text-sm overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody>
                                {Object.entries(selectedEntry.data).map(([key, value]) => (
                                    <tr key={key} className="border-b border-brand-border/50 last:border-0">
                                        <td className="py-2 pr-4 text-brand-primary font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                        <td className="py-2 text-white break-all">
                                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             )}
        </Modal>
    </div>
  );
}
