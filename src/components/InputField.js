import React from "react";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  readOnly = false,
  required = false,
  pattern,
  className = "form-control",
}) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}:</label>
      <input
        type={type}
        name={name}
        className={className}
        value={value}
        pattern={pattern}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
      />
    </div>
  );
};

export default InputField;
