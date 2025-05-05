import React from "react";

const TextAreaField = ({ label, name, value, onChange, readOnly }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <textarea
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </div>
);

export default TextAreaField;
