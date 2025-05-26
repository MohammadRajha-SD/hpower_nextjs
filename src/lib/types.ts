export interface FormData {
  name: string;
  phone_number: string;
  email: string;
  password: string;
  category_id?: string | number;
  provider_type_id?: string | number;
  language: string;
}

export interface ApiFormData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  language: string;
  category_id?: string | number;
  provider_type_id?: string | number;
}

export interface RegisterFormProps {
  header: string;
  description: string;
  fromProvider: boolean;
}

export interface RegisterResponse {
  success: boolean;
  errors?: Record<string, string[]>;
}
