import { VALIDATION_RULES } from "../constants/config";

export const validateProductForm = (formData, isEditing = false) => {
  const errors = {};

  // Product name validation
  if (!formData.productName || formData.productName.trim() === "") {
    errors.productName = "Nama produk harus diisi";
  } else if (formData.productName.length < VALIDATION_RULES.PRODUCT_NAME.MIN_LENGTH) {
    errors.productName = `Nama produk minimal ${VALIDATION_RULES.PRODUCT_NAME.MIN_LENGTH} karakter`;
  } else if (formData.productName.length > VALIDATION_RULES.PRODUCT_NAME.MAX_LENGTH) {
    errors.productName = `Nama produk maksimal ${VALIDATION_RULES.PRODUCT_NAME.MAX_LENGTH} karakter`;
  }

  // Category validation
  if (!formData.category) {
    errors.category = "Kategori harus dipilih";
  }

  // Selling price validation
  if (!formData.sellingPrice) {
    errors.sellingPrice = "Harga jual harus diisi";
  } else {
    const price = parseFloat(formData.sellingPrice);
    if (isNaN(price) || price <= VALIDATION_RULES.PRICE.MIN) {
      errors.sellingPrice = "Harga jual harus berupa angka yang valid dan lebih dari 0";
    } else if (price > VALIDATION_RULES.PRICE.MAX) {
      errors.sellingPrice = `Harga jual tidak boleh lebih dari ${(VALIDATION_RULES.PRICE.MAX / 1000000).toFixed(0)} juta`;
    }
  }

  // Image validation (only required for new products)
  if (!isEditing && !formData.imageFile) {
    errors.imageFile = "Gambar produk harus diupload";
  } else if (formData.imageFile) {
    const file = formData.imageFile;

    if (!VALIDATION_RULES.IMAGE.ALLOWED_TYPES.includes(file.type)) {
      errors.imageFile = "Format gambar harus JPEG, JPG, PNG, atau WebP";
    } else if (file.size > VALIDATION_RULES.IMAGE.MAX_SIZE) {
      errors.imageFile = `Ukuran gambar tidak boleh lebih dari ${VALIDATION_RULES.IMAGE.MAX_SIZE / (1024 * 1024)}MB`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

export const formatPrice = (price) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return "0";
  return numPrice.toLocaleString("id-ID");
};

export const parsePrice = (formattedPrice) => {
  if (typeof formattedPrice !== "string") return formattedPrice;
  return parseFloat(formattedPrice.replace(/[.,]/g, "")) || 0;
};
