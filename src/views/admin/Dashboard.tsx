import { Link } from 'react-router-dom';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';

export default function AdminDashboard() {
  const { schemas, deleteSchema } = useSchemaStore();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your form schemas and monitoring.</p>
         </div>
        <Link to="/admin/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Schema
          </Button>
        </Link>
      </div>

       {/* Stats Row (Mockup) */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-brand-surface border-brand-border">
                <CardContent className="p-6">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Schemas</div>
                    <div className="text-3xl font-bold text-white">{schemas.length}</div>
                </CardContent>
            </Card>
            <Card className="bg-brand-surface border-brand-border">
                <CardContent className="p-6">
                     <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Active Fields</div>
                    <div className="text-3xl font-bold text-white">{schemas.reduce((acc, s) => acc + s.fields.length, 0)}</div>
                </CardContent>
            </Card>
            <Card className="bg-brand-surface border-brand-border">
                <CardContent className="p-6">
                     <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">System Status</div>
                    <div className="text-3xl font-bold text-brand-primary">Online</div>
                </CardContent>
            </Card>
       </div>

      <div className="pt-4">
        <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Your Schemas</h2>
        {schemas.length === 0 ? (
            <div className="text-center py-16 bg-brand-surface/30 rounded-2xl border border-dashed border-brand-border">
            <h3 className="text-lg font-medium text-white">No schemas created</h3>
            <p className="text-gray-500 mt-1">Get started by defining a new data structure.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
            {schemas.map((schema) => (
                <div key={schema.id} className="group flex items-center justify-between p-6 bg-brand-surface border border-brand-border rounded-2xl hover:border-brand-primary/50 transition-all">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-brand-dark rounded-xl border border-brand-border group-hover:border-brand-primary/30 transition-colors">
                            <Layers className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{schema.name}</h3>
                            <p className="text-sm text-gray-500">{schema.fields.length} predefined fields</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/edit/${schema.id}`}>
                            <Button variant="secondary" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => deleteSchema(schema.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
