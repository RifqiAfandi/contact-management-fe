import React from "react";

const FormField = ({ 
  id, 
  name, 
  type = "text", 
  label, 
  value, 
  onChange, 
  required = false,
  accept,
  className = "form-input"
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        required={required}
        accept={accept}
      />
    </div>
  );
};

export default FormField;