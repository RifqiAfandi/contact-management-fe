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

        <form onSubmit={onSubmit} className="modal-form">
          <FormField
            id="itemName"
            name="itemName"
            label="Nama Barang"
            value={formData.itemName}
            onChange={onInputChange}
            required
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
              required
            />
          </FormRow>

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