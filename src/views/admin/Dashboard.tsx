import { Link } from 'react-router-dom';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { schemas, deleteSchema } = useSchemaStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Form Categories</h1>
        <Link to="/admin/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </Button>
        </Link>
      </div>

      {schemas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900">No categories yet</h3>
          <p className="text-gray-500 mt-1">Get started by creating a new form category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemas.map((schema) => (
            <Card key={schema.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{schema.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  {schema.fields.length} fields defined
                </div>
                <div className="flex space-x-2">
                   <Link to={`/admin/edit/${schema.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => deleteSchema(schema.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
