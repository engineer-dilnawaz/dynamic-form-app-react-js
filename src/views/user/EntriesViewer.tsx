import { Link, useNavigate } from 'react-router-dom';
import { useEntryStore } from '../../stores/useEntryStore';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function EntriesViewer() {
  const { entries } = useEntryStore();
  const { getSchema } = useSchemaStore();
  const navigate = useNavigate();

  // Simple sorting by date desc
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/user')}>
             {/* Note: navigate needs hook, realized I missed it, fixing below */}
             <Link to="/user" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
             </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
      </div>

      {sortedEntries.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No entries submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEntries.map((entry) => {
            const schema = getSchema(entry.categoryId);
            return (
              <div key={entry.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-blue-600">{schema?.name || 'Unknown Form'}</h3>
                    <p className="text-sm text-gray-400">{new Date(entry.submittedAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    ID: {entry.id.slice(0, 8)}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(entry.data, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
