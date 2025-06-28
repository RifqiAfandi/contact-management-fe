import { useState } from "react";
import { validateProductForm } from "../utils/validationUtils";

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (formData, isEditing = false) => {
    const validation = validateProductForm(formData, isEditing);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const setFieldError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  return {
    errors,
    validate,
    clearErrors,
    setFieldError
  };
};
