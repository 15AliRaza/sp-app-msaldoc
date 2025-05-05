import React from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

const Form = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleTextAreaChange,
  isReadOnly,
  user,
  condRendering,
  siteUrl,
}) => {
  return (
    <>
      <InputField
        label="Initiator Name:"
        value={formData.InitiatorName}
        readOnly
      />
      <InputField
        label="Initiator Email:"
        type="email"
        value={formData.InitiatorEmail}
        readOnly
      />
      <hr />
      <InputField
        label="Program:"
        name="Program"
        value={formData.Program}
        onChange={handleInputChange}
        readOnly={isReadOnly}
        required
      />

      <div className="row mb-2">
        <div className="form-group col-md-6">
          <InputField
            label="Element (Number/Float):"
            name="Element"
            value={formData.Element}
            onChange={handleInputChange}
            readOnly={isReadOnly}
            pattern="^\d+(\.\d+)?$"
            required
          />
        </div>
        <div className="form-group col-md-6">
          <InputField
            label="Target Date:"
            type="date"
            name="TargetDate"
            value={formData.TargetDate}
            onChange={handleInputChange}
            readOnly={isReadOnly}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <TextAreaField
          label="Comments:"
          name="Comments"
          value={formData.Comments}
          onChange={handleTextAreaChange}
          readOnly={isReadOnly}
        />
      </div>

      {!isReadOnly && (
        <div className="mb-2">
          <label className="form-label">Upload File:</label>
          <input
            type="file"
            name="Attachments"
            onChange={handleFileChange}
            accept=".doc,.docx"
            required
            // disabled={isReadonly}
          />
        </div>
      )}

      {!user && !formData.ID && (
        <button type="submit" className="btn btn-primary submit-button">
          Submit
        </button>
      )}

      {condRendering ? (
        <a
          href={`${siteUrl}/Lists/EHS_initiator/Attachments/${formData.ID}/${formData.FileName}?web=1`}
          target="_blank"
          rel="noreferrer"
        >
          <button type="button" className="btn btn-primary submit-button">
            Open Document
          </button>
        </a>
      ) : (
        ""
      )}
    </>
  );
};

export default Form;
