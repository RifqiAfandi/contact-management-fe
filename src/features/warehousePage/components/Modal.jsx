import React from "react";
import ModalHeader from "./ModalHeader";
import CurrentImage from "./CurrentImage";
import FormField from "./FormField";
import FormRow from "./FormRow";
import FormActions from "./FormActions";

const Modal = ({
  editingItem,
  formData,
  isLoading,
  onSubmit,
  onClose,
  onInputChange,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <ModalHeader 
          title={editingItem ? "Edit Barang" : "Tambah Barang Baru"}
          onClose={onClose}
        />

        <CurrentImage imageUrl={formData.currentImageUrl} />

        <form onSubmit={onSubmit} className="modal-form">          <FormField
            id="itemName"
            name="itemName"
            label="Nama Barang"
            value={formData.itemName}
            onChange={onInputChange}
            required
          />

          <FormField
            id="supplierName"
            name="supplierName"
            label="Nama Supplier"
            value={formData.supplierName}
            onChange={onInputChange}
          />

          <FormField
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            label="Harga Beli (Rp)"
            value={formData.purchasePrice}
            onChange={onInputChange}
            required
          />

          <FormRow>
            <FormField
              id="entryDate"
              name="entryDate"
              type="date"
              label="Tanggal Masuk"
              value={formData.entryDate}
              onChange={onInputChange}
              required
            />

            <FormField
              id="expiredDate"
              name="expiredDate"
              type="date"
              label="Tanggal Expired"
              value={formData.expiredDate}
              onChange={onInputChange}
            />
          </FormRow>

          <FormField
            id="useDate"
            name="useDate"
            type="date"
            label="Tanggal Terpakai"
            value={formData.useDate}
            onChange={onInputChange}
          />
          
          {/* Status indicator when useDate is filled */}
          {formData.useDate && (
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#666',
              marginBottom: '16px'
            }}>
              ℹ️ <strong>Status akan berubah menjadi "Terpakai"</strong> karena tanggal terpakai telah diisi
            </div>
          )}

          <FormField
            id="imageFile"
            name="imageFile"
            type="file"
            label="Gambar Barang"
            onChange={onInputChange}
            accept="image/*"
            className="form-input file-input"
          />

          <FormActions
            onCancel={onClose}
            isLoading={isLoading}
            isEditing={!!editingItem}
          />
        </form>
      </div>
    </div>
  );
};

export default Modal;