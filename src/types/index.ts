export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'time';
export type UiType = 'text' | 'textarea' | 'number' | 'switch' | 'date' | 'time' | 'select' | 'radio';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldSchema {
  id: string; // Unique ID for the field (for Drag n Drop / key)
  name: string; // The property key in the data object
  label: string;
  type: FieldType;
  ui: UiType;
  options?: FieldOption[]; // For select/radio
  required?: boolean;
}

export interface CategorySchema {
  id: string;
  name: string;
  fields: FieldSchema[];
  createdAt: string;
}

export interface FormEntry {
  id: string;
  categoryId: string;
  data: Record<string, any>; // The actual submitted data
  submittedAt: string;
}
