import React from "react";
import { renderIcon } from "../utils/iconUtils";

const FormActions = ({ 
  onCancel, 
  isLoading, 
  isEditing, 
  loadingText = "Menyimpan...",
  editText = "Update",
  createText = "Simpan"
}) => {
  return (
    <div className="form-actions">
      <button type="button" className="cancel-btn" onClick={onCancel}>
        Batal
      </button>
      <button type="submit" className="submit-btn" disabled={isLoading}>
        {renderIcon("save")}
        {isLoading ? loadingText : isEditing ? editText : createText}
      </button>
    </div>
  );
};

export default FormActions;