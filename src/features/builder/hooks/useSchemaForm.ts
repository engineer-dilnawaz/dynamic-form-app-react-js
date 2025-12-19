import { useForm, useFieldArray } from 'react-hook-form';
import type { FieldType, UiType } from '../../../types';

export interface SchemaFormValues {
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

export const useSchemaForm = (defaultValues?: Partial<SchemaFormValues>) => {
  const { control, register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm<SchemaFormValues>({
    defaultValues: {
      name: '',
      fields: [],
      ...defaultValues
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields"
  });

  return {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    errors,
    fields,
    append,
    remove
  };
};
