import { useState, useCallback, useMemo } from 'react';

/**
 * Reusable form validation hook
 * Tracks form state, validates fields, and determines if form is valid
 * 
 * Usage:
 * const { values, errors, isValid, handleChange, setFieldValue } = useFormValidation(
 *   initialValues,
 *   validationRules
 * );
 */
export const useFormValidation = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  // Validate a single field
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Check required
    if (rules.required) {
      if (typeof value === 'string' && !value.trim()) {
        return rules.required;
      }
      if (Array.isArray(value) && value.length === 0) {
        return rules.required;
      }
      if (value === null || value === undefined) {
        return rules.required;
      }
    }

    // If empty and not required, skip other validations
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null;
    }

    // Email validation
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return rules.email;
      }
    }

    // Min length
    if (rules.minLength) {
      if (typeof value === 'string' && value.length < rules.minLength) {
        return rules.minLength;
      }
    }

    // Max length
    if (rules.maxLength) {
      if (typeof value === 'string' && value.length > rules.maxLength) {
        return rules.maxLength;
      }
    }

    // Min value (for numbers)
    if (rules.minValue !== undefined) {
      if (Number(value) < rules.minValue) {
        return rules.minValue;
      }
    }

    // Max value (for numbers)
    if (rules.maxValue !== undefined) {
      if (Number(value) > rules.maxValue) {
        return rules.maxValue;
      }
    }

    // Custom validator
    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  // Validate all fields
  const validateAllFields = useCallback(() => {
    const newErrors = {};
    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });
    return newErrors;
  }, [validateField, validationRules, values]);

  // Calculate errors for all touched fields
  const errors = useMemo(() => {
    const fieldErrors = {};
    Object.keys(validationRules).forEach((fieldName) => {
      if (touched[fieldName] || Object.keys(touched).length > 0) {
        const error = validateField(fieldName, values[fieldName]);
        if (error) {
          fieldErrors[fieldName] = error;
        }
      }
    });
    return fieldErrors;
  }, [validateField, validationRules, values, touched]);

  // Check if form is valid
  const isValid = useMemo(() => {
    // If no fields have been touched, consider it invalid
    if (Object.keys(touched).length === 0) {
      return false;
    }

    // Check all validation rules
    const allErrors = validateAllFields();
    return Object.keys(allErrors).length === 0;
  }, [touched, validateAllFields]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  // Manually set field value
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  // Mark all fields as touched
  const setAllTouched = useCallback(() => {
    const allTouched = {};
    Object.keys(validationRules).forEach((fieldName) => {
      allTouched[fieldName] = true;
    });
    setTouched(allTouched);
  }, [validationRules]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setTouched({});
  }, [initialValues]);

  return {
    values,
    setValues,
    errors,
    isValid,
    touched,
    setTouched,
    handleChange,
    setFieldValue,
    setAllTouched,
    resetForm,
    validateField,
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  email: {
    required: 'Email is required',
    email: 'Please enter a valid email address',
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters',
  },
  passwordConfirm: {
    required: 'Please confirm your password',
  },
  name: {
    required: 'Name is required',
  },
  text: {
    required: 'This field is required',
  },
  number: {
    required: 'This field is required',
  },
};
