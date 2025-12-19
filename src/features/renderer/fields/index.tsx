import { Controller } from 'react-hook-form';
import { Input } from '../../../components/ui/Input';
import type { FieldProps } from '../types';

export const TextField = ({ field, control, error }: FieldProps) => {
  return (
    <Controller
      name={field.name}
      control={control}
      rules={{ required: field.required ? 'This field is required' : false }}
      render={({ field: { onChange, value } }) => (
        <Input
            label={field.label}
            type="text"
            onChange={onChange}
            value={value || ''}
            error={error}
        />
      )}
    />
  );
};

export const NumberField = ({ field, control, error }: FieldProps) => {
  return (
    <Controller
      name={field.name}
      control={control}
      rules={{ required: field.required ? 'This field is required' : false }}
      render={({ field: { onChange, value } }) => (
        <Input
            label={field.label}
            type="number"
            onChange={onChange}
            value={value || ''}
            error={error}
        />
      )}
    />
  );
};

export const TextAreaField = ({ field, control, error }: FieldProps) => {
    return (
        <div className="w-full space-y-1">
             <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">
                {field.label}
            </label>
            <Controller
                name={field.name}
                control={control}
                rules={{ required: field.required ? 'This field is required' : false }}
                render={({ field: { onChange, value } }) => (
                     <textarea
                     className="flex min-h-[120px] w-full rounded-xl border border-brand-border bg-brand-input px-4 py-3 text-brand-text placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all duration-200"
                     onChange={onChange}
                     value={value || ''}
                   />
                )}
            />
            {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
        </div>
    );
};

export const SwitchField = ({ field, control }: FieldProps) => {
  return (
    <div className="space-y-2">
         <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">
            {field.label}
        </label>
        <Controller
        name={field.name}
        control={control}
        render={({ field: { onChange, value } }) => (
            <div className="flex items-center h-12 px-4 rounded-xl border border-brand-border bg-brand-input w-max">
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
        )}
        />
    </div>
  );
};

import { Select } from '../../../components/ui/Select';

export const SelectField = ({ field, control, error }: FieldProps) => {
    return (
        <div className="space-y-2">
             <label className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80 ml-1">
                {field.label}
            </label>
            <Controller
                name={field.name}
                control={control}
                rules={{ required: field.required ? 'This field is required' : false }}
                render={({ field: { onChange, value } }) => (
                    <Select
                        onChange={onChange}
                        value={value || ''}
                        error={error}
                    >
                        <option value="">Select an option...</option>
                        {field.options?.map((opt: {value: string; label: string}, i: number) => (
                        <option key={i} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>
                )}
            />
        </div>
    );
};

export const DateField = ({ field, control, error }: FieldProps) => {
    return (
      <Controller
        name={field.name}
        control={control}
        rules={{ required: field.required ? 'This field is required' : false }}
        render={({ field: { onChange, value } }) => (
          <Input
              label={field.label}
              type="date"
              onChange={onChange}
              value={value || ''}
              error={error}
          />
        )}
      />
    );
  };

  export const TimeField = ({ field, control, error }: FieldProps) => {
    return (
      <Controller
        name={field.name}
        control={control}
        rules={{ required: field.required ? 'This field is required' : false }}
        render={({ field: { onChange, value } }) => (
          <Input
              label={field.label}
              type="time"
              onChange={onChange}
              value={value || ''}
              error={error}
          />
        )}
      />
    );
  };
