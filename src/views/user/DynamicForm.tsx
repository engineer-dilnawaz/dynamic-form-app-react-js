import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { useEntryStore } from '../../stores/useEntryStore';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, Check } from 'lucide-react';
import { FieldFactory } from '../../features/renderer/FieldFactory';

export default function DynamicForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSchema } = useSchemaStore();
  const { addEntry } = useEntryStore();
  
  const schema = id ? getSchema(id) : undefined;
  
  const { control, handleSubmit, formState: { errors } } = useForm();
  
  if (!schema) {
    return <div className="text-center py-10 text-gray-400">Form not found</div>;
  }

  const onSubmit = (data: any) => {
    addEntry({
      id: uuidv4(),
      categoryId: schema.id,
      data,
      submittedAt: new Date().toISOString()
    });
    navigate('/user/entries');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/user')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
           Back
        </Button>
      </div>

      <Card className="bg-brand-surface border-brand-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-brand-border bg-brand-surface/50">
            <h1 className="text-2xl font-bold text-white tracking-tight">{schema.name}</h1>
            <p className="text-brand-muted text-sm mt-1">Please fill in the details below.</p>
        </div>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {schema.fields.map((field) => (
                <FieldFactory 
                    key={field.id} 
                    field={field} 
                    control={control} 
                    error={errors[field.name]?.message as string} 
                />
            ))}
            
            <div className="pt-6 border-t border-brand-border mt-8">
              <Button type="submit" className="w-full h-12 text-lg" size="lg">
                <Check className="w-5 h-5 mr-2" />
                Submit Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

