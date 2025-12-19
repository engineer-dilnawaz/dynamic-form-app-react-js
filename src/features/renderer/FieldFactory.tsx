import type { Control } from 'react-hook-form';
import type { FieldSchema } from '../../types';
import { 
    TextField, 
    NumberField, 
    TextAreaField, 
    SwitchField, 
    SelectField, 
    DateField, 
    TimeField 
} from './fields';

interface FieldFactoryProps {
    field: FieldSchema;
    control: Control<any>;
    error?: string;
}

export const FieldFactory = ({ field, control, error }: FieldFactoryProps) => {
    switch (field.ui) {
        case 'text':
            return <TextField field={field} control={control} error={error} />;
        case 'number':
            return <NumberField field={field} control={control} error={error} />;
        case 'textarea':
            return <TextAreaField field={field} control={control} error={error} />;
        case 'switch':
            return <SwitchField field={field} control={control} error={error} />;
        case 'select':
        case 'radio': // fallback for now
            return <SelectField field={field} control={control} error={error} />;
        case 'date':
            return <DateField field={field} control={control} error={error} />;
        case 'time':
            return <TimeField field={field} control={control} error={error} />;
        default:
            return <TextField field={field} control={control} error={error} />;
    }
};
