import { useEffect, useState, type KeyboardEvent } from 'react';
import { useForm, useFieldArray, useWatch, type Control, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useSchemaStore } from '../../stores/useSchemaStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { Card, CardContent } from '../../components/ui/Card';
import { Trash2, Plus, Save, X } from 'lucide-react';
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

const FIELD_TYPES = [
    { label: 'String', value: 'string' },
    { label: 'Number', value: 'number' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Date', value: 'date' },
    { label: 'Time', value: 'time' },
];

const WIDGET_OPTIONS: Record<string, { label: string; value: string }[]> = {
    number: [{ label: 'Number Input', value: 'number' }],
    boolean: [{ label: 'Switch', value: 'switch' }],
    date: [{ label: 'Date Picker', value: 'date' }],
    time: [{ label: 'Time Picker', value: 'time' }],
    string: [
        { label: 'Single Line', value: 'text' },
        { label: 'Multi Line', value: 'textarea' },
        { label: 'Dropdown', value: 'select' },
    ],
    default: [{ label: 'Text', value: 'text' }]
};

// --- Helper Component for Options Tag Input ---
const OptionsEditor = ({ 
    value = '', 
    onChange 
}: { 
    value?: string, 
    onChange: (val: string) => void 
}) => {
    const [inputValue, setInputValue] = useState('');
    
    // Parse the comma-separated string into an array of tags, removing empty ones
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                const newTags = [...tags, newTag];
                onChange(newTags.join(', '));
                setInputValue('');
            }
        }
    };

    const removeTag = (indexToRemove: number) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        onChange(newTags.join(', '));
    };

    return (
        <div className="space-y-2">
             <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">
                Dropdown Options
            </label>
            <div className="flex flex-wrap gap-2 p-3 min-h-[48px] rounded-xl border border-brand-border bg-brand-input focus-within:ring-2 focus-within:ring-brand-primary/50 focus-within:border-brand-primary transition-all">
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(i)}
                            className="ml-1.5 hover:text-white focus:outline-none"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? "Type option and press Enter..." : "Add..."}
                    className="flex-1 bg-transparent border-none text-sm text-brand-text placeholder:text-gray-500 focus:outline-none min-w-[120px]"
                />
            </div>
            <p className="text-xs text-brand-muted ml-1">Example: "Red", press Enter, "Blue", press Enter.</p>
        </div>
    );
};

const FieldRow = ({ index, control, remove, register, setValue }: { index: number, control: Control<SchemaFormValues>, remove: (index: number) => void, register: any, setValue: any }) => {
    const type = useWatch({ control, name: `fields.${index}.type` });
    const ui = useWatch({ control, name: `fields.${index}.ui` });
    
    // Auto-select UI when Type changes
    useEffect(() => {
        const defaultUi: Record<string, UiType> = {
            string: 'text',
            number: 'number',
            boolean: 'switch',
            date: 'date',
            time: 'time'
        };
         if (type) {
             const newUi = defaultUi[type] || 'text';
             // Only update if the current UI is not compatible with the new type to avoid overwriting user choice unnecessarily,
             // but here we force reset on type change to ensure validity.
             // Actually currently logic was overwriting it always. Let's keep it simple.
             setValue(`fields.${index}.ui`, newUi);
         }
    }, [type, index, setValue]);

    const currentWidgetOptions = WIDGET_OPTIONS[type] || WIDGET_OPTIONS.default;

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
                    <Controller
                        control={control}
                        name={`fields.${index}.type`}
                        render={({ field }) => (
                            <CustomSelect
                                label="Type"
                                options={FIELD_TYPES}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <div className="md:col-span-2">
                     <Controller
                        control={control}
                        name={`fields.${index}.ui`}
                        render={({ field }) => (
                            <CustomSelect
                                label="Widget"
                                options={currentWidgetOptions}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <div className="md:col-span-2 flex flex-col justify-end pb-3">
                    <label className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" {...register(`fields.${index}.required` as const)} className="rounded border-brand-border bg-brand-input text-brand-primary focus:ring-brand-primary w-5 h-5" />
                        <span>Required</span>
                    </label>
                </div>

                {ui === 'select' && (
                    <div className="md:col-span-12 animation-fade-in">
                        <Controller
                            control={control}
                            name={`fields.${index}.optionsString`}
                            render={({ field }) => (
                                <OptionsEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                )}
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
  const { addSchema, updateSchema, getSchema, schemas } = useSchemaStore();
  const isEditMode = !!id;
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { control, register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm<SchemaFormValues>({
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
      type: f.type,
      ui: f.ui,
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
