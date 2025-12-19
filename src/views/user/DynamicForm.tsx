import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { useEntryStore } from '../../stores/useEntryStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
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

  const renderField = (field: FieldSchema) => {
    return (
      <div key={field.id} className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">
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
                   <div className="flex items-center h-12 px-4 rounded-xl border border-brand-border bg-brand-input">
                    <button
                      type="button"
                      onClick={() => onChange(!value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${
                        value ? 'bg-brand-primary' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`${
                          value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                    <span className="ml-3 text-sm text-brand-muted">{value ? 'Yes' : 'No'}</span>
                  </div>
                );
              case 'select':
                return (
                  <Select
                    onChange={onChange}
                    value={value || ''}
                    error={errors[field.name]?.message as string}
                  >
                    <option value="">Select an option...</option>
                    {field.options?.map((opt, i) => (
                      <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                );
               case 'textarea':
                return (
                   <textarea
                    className="flex min-h-[120px] w-full rounded-xl border border-brand-border bg-brand-input px-4 py-3 text-brand-text placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all duration-200"
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
        {errors[field.name] && <p className="text-xs text-red-500 ml-1">{errors[field.name]?.message as string}</p>}
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
      </div>

      <Card className="bg-brand-surface border-brand-border overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-brand-border bg-brand-surface/50">
            <h1 className="text-2xl font-bold text-white tracking-tight">{schema.name}</h1>
            <p className="text-brand-muted text-sm mt-1">Please fill in the details below.</p>
        </div>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {schema.fields.map(renderField)}
            
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
