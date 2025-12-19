import { useEffect } from 'react';
import { useForm, useFieldArray, useWatch, type Control } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Trash2, Plus, Save } from 'lucide-react';
import type { CategorySchema, FieldType, UiType } from '../../types';

interface SchemaFormValues {
  name: string;
  fields: {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    ui: UiType;
    required: boolean;
    optionsString?: string;
  }[];
}

const TEMPLATES: Record<string, Partial<SchemaFormValues>> = {
  vehicles: {
    name: 'Vehicles',
    fields: [
      { id: uuidv4(), name: 'brand', label: 'Brand', type: 'string', ui: 'text', required: true },
      { id: uuidv4(), name: 'model', label: 'Model', type: 'string', ui: 'text', required: true },
      { id: uuidv4(), name: 'year', label: 'Year', type: 'number', ui: 'number', required: true, optionsString: '' },
      { id: uuidv4(), name: 'is_electric', label: 'Electric?', type: 'boolean', ui: 'switch', required: false, optionsString: '' },
    ]
  },
  clothes: {
    name: 'Clothing',
    fields: [
      { id: uuidv4(), name: 'type', label: 'Type', type: 'string', ui: 'select', required: true, optionsString: 'Shirt, Pants, Jacket, Shoes' },
      { id: uuidv4(), name: 'size', label: 'Size', type: 'string', ui: 'select', required: true, optionsString: 'S, M, L, XL' },
      { id: uuidv4(), name: 'material', label: 'Material', type: 'string', ui: 'text', required: false },
    ]
  },
  electronics: {
    name: 'Electronics',
    fields: [
      { id: uuidv4(), name: 'device_name', label: 'Device Name', type: 'string', ui: 'text', required: true },
      { id: uuidv4(), name: 'warranty_expiry', label: 'Warranty Expiry', type: 'date', ui: 'date', required: true },
      { id: uuidv4(), name: 'price', label: 'Price ($)', type: 'number', ui: 'number', required: true },
    ]
  }
};

const FieldRow = ({ index, control, remove, register }: { index: number, control: Control<SchemaFormValues>, remove: (index: number) => void, register: any }) => {
    const type = useWatch({ control, name: `fields.${index}.type` });

    return (
        <Card className="relative group border-brand-border/50 bg-brand-surface/50 hover:border-brand-border transition-colors">
            <CardContent className="pt-6 pl-6 pr-12 grid grid-cols-1 md:grid-cols-12 gap-4">
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
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1 mb-1 block">Type</label>
                    <select
                        {...register(`fields.${index}.type` as const)}
                        className="flex h-12 w-full rounded-xl border border-brand-border bg-brand-input px-3 py-2 text-brand-text text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all"
                    >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1 mb-1 block">Widget</label>
                    <select
                        {...register(`fields.${index}.ui` as const)}
                        className="flex h-12 w-full rounded-xl border border-brand-border bg-brand-input px-3 py-2 text-brand-text text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all"
                    >
                        {type === 'number' && <option value="number">Number Input</option>}
                        {type === 'boolean' && <option value="switch">Switch</option>}
                        {type === 'date' && <option value="date">Date Picker</option>}
                        {type === 'time' && <option value="time">Time Picker</option>}
                        {type === 'string' && (
                            <>
                                <option value="text">Single Line</option>
                                <option value="textarea">Multi Line</option>
                                <option value="select">Dropdown</option>
                            </>
                        )}
                         {!['number', 'boolean', 'date', 'time', 'string'].includes(type) && <option value="text">Text</option>}
                    </select>
                </div>
                <div className="md:col-span-2 flex items-center pt-6">
                    <label className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" {...register(`fields.${index}.required` as const)} className="rounded border-brand-border bg-brand-input text-brand-primary focus:ring-brand-primary" />
                        <span>Required</span>
                    </label>
                </div>

                <div className="md:col-span-12">
                     <Input
                        label="Options (comma separated)"
                        placeholder="Option 1, Option 2"
                        {...register(`fields.${index}.optionsString` as const)}
                    />
                </div>
            </CardContent>
            <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-4 top-4 p-2 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </Card>
    );
};


export default function SchemaBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addSchema, updateSchema, getSchema } = useSchemaStore();
  const isEditMode = !!id;

  const { control, register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SchemaFormValues>({
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

  const loadTemplate = (key: string) => {
      const template = TEMPLATES[key];
      if (template) {
          setValue('name', template.name || '');
          setValue('fields', template.fields || []);
      }
  };

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
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
         <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isEditMode ? 'Edit Schema' : 'New Schema'}
            </h1>
            <p className="text-gray-400 mt-1">Define the data structure and UI widgets.</p>
         </div>
         
         <div className="flex items-center space-x-4">
             <Button variant="secondary" onClick={() => navigate('/admin')}>
                Cancel
             </Button>
            <Button onClick={handleSubmit(onSubmit)}>
                <Save className="w-5 h-5 mr-2" />
                Save Schema
            </Button>
         </div>
      </div>

       <Card className="bg-brand-surface border-brand-border">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
             <Input
                label="Category Name"
                placeholder="e.g. Employee Profile"
                {...register('name', { required: 'Category name is required' })}
                error={errors.name?.message}
            />
            
             {!isEditMode && (
                 <div className="space-y-1">
                     <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">Template</label>
                     <select 
                        onChange={(e) => loadTemplate(e.target.value)} 
                        className="flex h-12 w-full rounded-xl border border-brand-border bg-brand-input px-4 py-2 text-brand-text text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all"
                        defaultValue=""
                     >
                         <option value="" disabled>Select a template...</option>
                         <option value="vehicles">Vehicles</option>
                         <option value="clothes">Clothing</option>
                         <option value="electronics">Electronics</option>
                     </select>
                 </div>
             )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Fields Configuration</h2>
             <Button type="button" variant="secondary" size="sm" onClick={() => append({ id: uuidv4(), name: '', label: '', type: 'string', ui: 'text', required: false, optionsString: '' })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
                <FieldRow key={field.id} index={index} control={control} remove={remove} register={register} />
            ))}
          </div>
          
           {fields.length === 0 && (
             <div className="text-center py-12 text-gray-500 rounded-xl border-2 border-dashed border-brand-border/50 bg-brand-surface/30">
                No fields added. Start by using a template or adding a custom field.
             </div>
           )}
        </div>
    </div>
  );
}
