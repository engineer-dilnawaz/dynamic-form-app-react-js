import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Trash2, Plus, GripVertical, ArrowLeft, Save } from 'lucide-react';
import type { CategorySchema, FieldType, UiType } from '../../types';

interface SchemaFormValues {
  name: string;
  fields: {
    id: string; // internal id for useFieldArray
    name: string;
    label: string;
    type: FieldType;
    ui: UiType;
    required: boolean;
    optionsString?: string; // helper for editing options
  }[];
}

export default function SchemaBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addSchema, updateSchema, getSchema } = useSchemaStore();
  const isEditMode = !!id;

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<SchemaFormValues>({
    defaultValues: {
      name: '',
      fields: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields"
  });

  useEffect(() => {
    if (isEditMode && id) {
      const existing = getSchema(id);
      if (existing) {
        reset({
          name: existing.name,
          fields: existing.fields.map(f => ({
            ...f,
            optionsString: f.options?.map(o => o.value).join(',')
          }))
        });
      }
    }
  }, [isEditMode, id, getSchema, reset]);

  const onSubmit = (data: SchemaFormValues) => {
    const finalFields = data.fields.map(f => ({
      id: f.id || uuidv4(),
      name: f.name,
      label: f.label,
      type: f.type,
      ui: f.ui,
      required: f.required,
      options: f.optionsString ? f.optionsString.split(',').map(s => ({ label: s.trim(), value: s.trim() })) : undefined
    }));

    const schemaData: CategorySchema = {
      id: id || uuidv4(),
      name: data.name,
      fields: finalFields,
      createdAt: new Date().toISOString()
    };

    if (isEditMode && id) {
      updateSchema(id, schemaData);
    } else {
      addSchema(schemaData);
    }
    navigate('/admin');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/admin')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
           Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Category' : 'Create New Category'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <Input
              label="Category Name"
              placeholder="e.g. Employee Onboarding"
              {...register('name', { required: 'Category name is required' })}
              error={errors.name?.message}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-semibold text-gray-800">Form Fields</h2>
             <Button type="button" onClick={() => append({ id: uuidv4(), name: '', label: '', type: 'string', ui: 'text', required: false, optionsString: '' })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="relative group">
               <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5" />
              </div>
              <CardContent className="pt-6 pl-10 pr-12 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                   <Input 
                    label="Label" 
                    placeholder="Display Label"
                    {...register(`fields.${index}.label` as const, { required: true })} 
                   />
                </div>
                 <div className="md:col-span-3">
                   <Input 
                    label="Property Name" 
                    placeholder="database_key"
                    {...register(`fields.${index}.name` as const, { required: true })} 
                   />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    {...register(`fields.${index}.type` as const)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                  </select>
                </div>
                 <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">UI</label>
                   <select 
                    {...register(`fields.${index}.ui` as const)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Input</option>
                    <option value="textarea">Textarea</option>
                    <option value="number">Number Input</option>
                    <option value="switch">Switch</option>
                    <option value="date">Date Picker</option>
                    <option value="select">Dropdown</option>
                  </select>
                </div>
                 <div className="md:col-span-2 flex items-center pt-6">
                    <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" {...register(`fields.${index}.required` as const)} className="rounded text-blue-600 focus:ring-blue-500" />
                      <span>Required</span>
                    </label>
                </div>
                
                 {/* Options input if type is select */}
                 <div className="md:col-span-12">
                   <Input 
                    label="Options (comma separated, for Dropdown)" 
                    placeholder="Option 1, Option 2"
                    {...register(`fields.${index}.optionsString` as const)} 
                   />
                 </div>
              </CardContent>
              <button 
                type="button"
                onClick={() => remove(index)}
                className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </Card>
          ))}
          
           {fields.length === 0 && (
             <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed text-sm">
                No fields added yet. Click "Add Field" to start.
             </div>
           )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg">
            <Save className="w-5 h-5 mr-2" />
            Save Category
          </Button>
        </div>
      </form>
    </div>
  );
}
