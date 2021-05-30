export type TouchedFields = { [key: string]: boolean };
export type FieldValidations = { [key: string]: string | null }

export interface ValidationResult {
  valid: boolean;
  fieldValidations: FieldValidations;
}