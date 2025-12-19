import { useEffect } from 'react';
import { useWatch, type Control, Controller, type UseFormRegister, type UseFormSetValue } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { OptionsEditor } from './OptionsEditor'; // Import the new component
import type { UiType } from '../../../types';

import { type SchemaFormValues } from '../hooks/useSchemaForm';


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

interface FieldRowProps {
    index: number;
    control: Control<SchemaFormValues>;
    remove: (index: number) => void;
    register: UseFormRegister<SchemaFormValues>;
    setValue: UseFormSetValue<SchemaFormValues>;
}

export const FieldRow = ({ index, control, remove, register, setValue }: FieldRowProps) => {
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
                <div className="md:col-span-2 flex flex-col justify-end h-[88px] pb-3">
                    <Controller
                        control={control}
                        name={`fields.${index}.required`}
                        render={({ field: { onChange, value } }) => (
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={value} 
                                        onChange={onChange}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${value ? 'bg-brand-primary' : 'bg-gray-700 group-hover:bg-gray-600'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${value ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                                <span className={`text-sm font-medium transition-colors ${value ? 'text-brand-primary' : 'text-gray-400 group-hover:text-white'}`}>
                                    Required
                                </span>
                            </label>
                        )}
                    />
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
