import { type Control, type FieldValues } from 'react-hook-form';
import type { FieldSchema } from '../../types';


export interface FieldProps<T extends FieldValues = any> {
  field: FieldSchema;
  control: Control<T>;
  error?: string;
}
