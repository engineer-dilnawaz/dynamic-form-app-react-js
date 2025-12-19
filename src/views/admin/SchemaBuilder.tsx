import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { Card, CardContent } from '../../components/ui/Card';
import { Plus, Save, X } from 'lucide-react';
import type { CategorySchema, FieldType, UiType } from '../../types';
import { useSchemaForm, type SchemaFormValues } from '../../features/builder/hooks/useSchemaForm';
import { FieldRow } from '../../features/builder/components/FieldRow';

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

export default function SchemaBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addSchema, updateSchema, getSchema, schemas } = useSchemaStore();
  const isEditMode = !!id;
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { control, register, handleSubmit, reset, setValue, setError, errors, fields, append, remove } = useSchemaForm();

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
      // Handle Clear or Empty
      if (!key || key === '__clear__') {
          setSelectedTemplate('');
          setValue('name', ''); // Clear category name as requested
          setValue('fields', []);
          return;
      }
      
      setSelectedTemplate(key);
      const template = TEMPLATES[key];
      if (template) {
          if (!isEditMode) setValue('name', template.name || '');
          setValue('fields', template.fields || []);
      }
  };

  const onSubmit = (data: SchemaFormValues) => {
    setGlobalError(null);

    // Duplicate Name Validation
    if (!isEditMode) {
        const isDuplicate = schemas.some(s => s.name.trim().toLowerCase() === data.name.trim().toLowerCase());
        if (isDuplicate) {
            setError('name', { type: 'manual', message: 'A schema with this name already exists' });
            return;
        }
    }

    // Min 1 Field Validation
    if (data.fields.length === 0) {
        setGlobalError('Please add at least one field to the schema.');
        return;
    }

    const finalFields = data.fields.map(f => ({
      id: f.id || uuidv4(),
      name: f.name,
      label: f.label,
      type: f.type as FieldType,
      ui: f.ui as UiType,
      required: f.required,
      options: f.optionsString ? f.optionsString.split(',').map(s => ({ label: s.trim(), value: s.trim() })).filter(o => o.value) : undefined
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

  const templateOptions = [
        { label: 'Vehicles', value: 'vehicles' },
        { label: 'Clothing', value: 'clothes' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clear Selection', value: '__clear__' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
         <div className="flex flex-col">
             <h1 className="text-3xl font-extrabold text-white tracking-tight">
             {isEditMode ? 'Edit Schema' : 'New Schema'}
             </h1>
             <p className="text-gray-400 mt-1">Define the data structure and UI widgets.</p>
         </div>
         
         <div className="flex items-center space-x-4 flex-shrink-0">
             <Button variant="secondary" onClick={() => navigate('/admin')}>
                Cancel
             </Button>
            <Button onClick={handleSubmit(onSubmit)} className="min-w-[150px]">
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
                 <div className="pt-0">
                     <CustomSelect
                        label="Template"
                        onChange={(val) => loadTemplate(val)}
                        options={templateOptions}
                        value={selectedTemplate}
                        placeholder="Select a template..."
                     />
                 </div>
             )}
          </CardContent>
        </Card>

        {globalError && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl flex items-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                 <X className="w-5 h-5 mr-2" />
                 <span className="text-sm font-medium">{globalError}</span>
             </div>
        )}

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
                <FieldRow key={field.id} index={index} control={control} remove={remove} register={register} setValue={setValue} />
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

