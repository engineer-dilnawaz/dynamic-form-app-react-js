import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { useEntryStore } from '../../stores/useEntryStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, Check } from 'lucide-react';
import type { FieldSchema } from '../../types';

export default function DynamicForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSchema } = useSchemaStore();
  const { addEntry } = useEntryStore();
  
  const schema = id ? getSchema(id) : undefined;
  
  const { control, handleSubmit, formState: { errors } } = useForm();
  
  if (!schema) {
    return <div className="text-center py-10">Form not found</div>;
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

  const renderField = (field: FieldSchema) => {
    return (
      <div key={field.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        
        <Controller
          name={field.name}
          control={control}
          rules={{ required: field.required ? 'This field is required' : false }}
          render={({ field: { onChange, value } }) => {
            switch (field.ui) {
              case 'switch':
                return (
                   <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => onChange(!value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`${
                          value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <span className="ml-3 text-sm text-gray-500">{value ? 'Yes' : 'No'}</span>
                  </div>
                );
              case 'select':
                return (
                  <select
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    onChange={onChange}
                    value={value || ''}
                  >
                    <option value="">Select an option</option>
                    {field.options?.map((opt, i) => (
                      <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                );
               case 'textarea':
                return (
                   <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    onChange={onChange}
                    value={value || ''}
                   />
                );
              default: // text, number, date, time
                return (
                  <Input
                    type={field.ui === 'number' ? 'number' : field.ui === 'date' ? 'date' : field.ui === 'time' ? 'time' : 'text'}
                    onChange={onChange}
                    value={value || ''}
                    error={errors[field.name]?.message as string}
                  />
                );
            }
          }}
        />
        {errors[field.name] && <p className="text-sm text-red-500">{errors[field.name]?.message as string}</p>}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/user')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
           Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{schema.name}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {schema.fields.map(renderField)}
            
            <div className="pt-4">
              <Button type="submit" className="w-full" size="lg">
                <Check className="w-4 h-4 mr-2" />
                Submit Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
