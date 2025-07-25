import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ValidationState {
  errors: ValidationErrors;
  isValid: boolean;
  touched: { [key: string]: boolean };
}

export const useFormValidation = (rules: ValidationRules) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: {},
    isValid: true,
    touched: {},
  });

  const validateField = useCallback((name: string, value: any): string => {
    const rule = rules[name];
    if (!rule) return '';

    // Required validation
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
      return '';
    }

    // String length validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return `Must be at least ${rule.minLength} characters`;
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return `Must be no more than ${rule.maxLength} characters`;
      }
    }

    // Number validations
    if (typeof value === 'number' || !isNaN(Number(value))) {
      const numValue = Number(value);
      if (rule.min !== undefined && numValue < rule.min) {
        return `Must be at least ${rule.min}`;
      }
      if (rule.max !== undefined && numValue > rule.max) {
        return `Must be no more than ${rule.max}`;
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value.toString())) {
      return 'Invalid format';
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) return customError;
    }

    return '';
  }, [rules]);

  const validateAllFields = useCallback((values: { [key: string]: any }): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });

    return errors;
  }, [rules, validateField]);

  const validateSingleField = useCallback((name: string, value: any) => {
    const error = validateField(name, value);
    
    setValidationState(prev => {
      const newErrors = { ...prev.errors };
      const newTouched = { ...prev.touched, [name]: true };
      
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }

      return {
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
        touched: newTouched,
      };
    });

    return error;
  }, [validateField]);

  const validateForm = useCallback((values: { [key: string]: any }) => {
    const errors = validateAllFields(values);
    const touchedFields = Object.keys(rules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    setValidationState({
      errors,
      isValid: Object.keys(errors).length === 0,
      touched: touchedFields,
    });

    return Object.keys(errors).length === 0;
  }, [validateAllFields, rules]);

  const clearValidation = useCallback(() => {
    setValidationState({
      errors: {},
      isValid: true,
      touched: {},
    });
  }, []);

  const setFieldTouched = useCallback((name: string, touched: boolean = true) => {
    setValidationState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched },
    }));
  }, []);

  return {
    errors: validationState.errors,
    isValid: validationState.isValid,
    touched: validationState.touched,
    validateField: validateSingleField,
    validateForm,
    clearValidation,
    setFieldTouched,
  };
};
