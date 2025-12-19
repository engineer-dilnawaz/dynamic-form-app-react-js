import { Link } from 'react-router-dom';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { useEntryStore } from '../../stores/useEntryStore';
import { Button } from '../../components/ui/Button';
import { FileText, ArrowRight, Play } from 'lucide-react';

export default function UserDashboard() {
  const { schemas } = useSchemaStore();
  const { entries } = useEntryStore();

  const getEntryCount = (schemaId: string) => {
    return entries.filter(e => e.categoryId === schemaId).length;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white tracking-tight">User Portal</h1>
            <p className="text-gray-400 mt-1">Select a form to submit a new entry.</p>
        </div>
         <Link to="/user/entries">
          <Button variant="secondary">
            View My History
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {schemas.length === 0 ? (
         <div className="text-center py-16 bg-brand-surface/30 rounded-2xl border border-dashed border-brand-border">
          <h3 className="text-lg font-medium text-white">No forms available</h3>
          <p className="text-gray-500 mt-1">Please ask an admin to publish a schema first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemas.map((schema) => (
            <div key={schema.id} className="group relative p-6 bg-brand-surface border border-brand-border rounded-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
                
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-brand-dark rounded-xl border border-brand-border text-brand-primary">
                        <FileText className="w-6 h-6" />
                    </div>
                     <span className="text-xs font-mono text-gray-500 bg-brand-dark px-2 py-1 rounded border border-brand-border">
                        ID: {schema.id.slice(0,4)}
                    </span>
                </div>
                
              <h3 className="text-xl font-bold text-white mb-2">{schema.name}</h3>
              <div className="flex justify-between text-sm text-gray-500 mb-6">
                  <span>{schema.fields.length} Fields</span>
                  <span>{getEntryCount(schema.id)} Submissions</span>
              </div>
              
                <Link to={`/user/form/${schema.id}`}>
                  <Button className="w-full justify-between group-hover:bg-brand-hover">
                    Start Entry
                    <Play className="w-4 h-4 fill-current" />
                  </Button>
                </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
