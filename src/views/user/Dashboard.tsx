import { Link } from 'react-router-dom';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { useEntryStore } from '../../stores/useEntryStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, List } from 'lucide-react';

export default function UserDashboard() {
  const { schemas } = useSchemaStore();
  const { entries } = useEntryStore();

  const getEntryCount = (schemaId: string) => {
    return entries.filter(e => e.categoryId === schemaId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Available Forms</h1>
         <Link to="/user/entries">
          <Button variant="secondary">
            <List className="w-4 h-4 mr-2" />
            View My Entries
          </Button>
        </Link>
      </div>

      {schemas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900">No forms available</h3>
          <p className="text-gray-500 mt-1">Please ask an admin to create a category first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemas.map((schema) => (
            <Card key={schema.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{schema.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                   <span>{schema.fields.length} fields</span>
                   <span>{getEntryCount(schema.id)} submissions</span>
                </div>
                <Link to={`/user/form/${schema.id}`}>
                  <Button className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Fill Form
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
