import React, { useState } from "react";
import {
  Table,
  Input,
  Space,
  Card,
  Select,
  InputNumber,
  Button,
  Modal,
  Form,
  Upload,
  message,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  ClearOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useProducts } from "../hooks/useProducts";

const { Option } = Select;

const CATEGORIES = [
  { value: "Minuman", label: "Minuman" },
  { value: "Makanan", label: "Makanan" },
  { value: "Snack", label: "Snack" },
];

const ProductTable = () => {
  // Use the custom hook for products
  const {
    products,
    loading,
    pagination,
    filters,
    handleDelete: deleteProduct,
    handleTableChange: onTableChange,
    handleSearch: onSearch,
    handleCreate: createProduct,
    handleUpdate: updateProduct,
    refreshProducts,
  } = useProducts();

  // Component state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [searchValue, setSearchValue] = useState("");

  // Wrapper functions for product actions
  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      productName: product.productName,
      productUrl: product.productUrl,
      category: product.category,
      sellingPrice: product.sellingPrice,
    });
    setEditModalVisible(true);
  };

  const handleDelete = (product) => {
    Modal.confirm({
      title: "Konfirmasi Hapus",
      content: `Apakah Anda yakin ingin menghapus produk "${product.productName}"?`,
      okText: "Ya",
      cancelText: "Tidak",
      onOk: async () => {
        const success = await deleteProduct(product.id, product.productName);
        if (success) {
          // Additional UI feedback if needed
        }
      },
    });
  };

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    onTableChange(newPagination, tableFilters, sorter);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch({
      ...filters,
      productName: value,
    });
  };

  const handleCreate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("category", values.category);
      formData.append("sellingPrice", values.sellingPrice);

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = userData.id || 1;
      formData.append("userId", userId);

      // Handle file upload
      if (values.productUrl) {
        let fileToUpload = null;

        if (values.productUrl.originFileObj) {
          fileToUpload = values.productUrl.originFileObj;
        } else if (
          values.productUrl.file &&
          values.productUrl.file.originFileObj
        ) {
          fileToUpload = values.productUrl.file.originFileObj;
        } else if (values.productUrl instanceof File) {
          fileToUpload = values.productUrl;
        }

        if (fileToUpload) {
          formData.append("productImg", fileToUpload);
        }
      }

      const success = await createProduct(formData);
      if (success) {
        setCreateModalVisible(false);
        createForm.resetFields();
      }
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("Gagal membuat produk");
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("category", values.category);
      formData.append("sellingPrice", values.sellingPrice);

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      formData.append("userId", userData.id || editingProduct.userId || 1);

      // Handle file upload
      if (values.productUrl) {
        let fileToUpload = null;

        if (values.productUrl.originFileObj) {
          fileToUpload = values.productUrl.originFileObj;
        } else if (
          values.productUrl.file &&
          values.productUrl.file.originFileObj
        ) {
          fileToUpload = values.productUrl.file.originFileObj;
        } else if (values.productUrl instanceof File) {
          fileToUpload = values.productUrl;
        }

        if (fileToUpload) {
          formData.append("productImg", fileToUpload);
        }
      }

      const success = await updateProduct(editingProduct.id, formData);
      if (success) {
        setEditModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Gagal memperbarui produk");
    }
  };

  const handleResetFilters = () => {
    setSearchValue("");
    onSearch({
      productName: "",
      category: undefined,
      minPrice: null,
      maxPrice: null,
    });
  };

  const handleRefresh = () => {
    refreshProducts();
  };

  const handlePriceRangeChange = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    onSearch(newFilters);
  };

  const columns = [
    {
      title: "Nama Produk",
      dataIndex: "productName",
      key: "productName",
      sorter: true,
    },
    {
      title: "Gambar",
      dataIndex: "productUrl",
      key: "productUrl",
      render: (productUrl) =>
        productUrl ? (
          <img
            src={productUrl}
            alt="Product"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>No image</span>
        ),
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      filters: CATEGORIES,
      filterMultiple: false,
    },
    {
      title: "Harga Jual",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      sorter: true,
      render: (price) => `Rp ${price.toLocaleString("id-ID")}`,
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];

  const uploadProps = {
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Anda hanya dapat mengunggah file gambar!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ukuran gambar harus kurang dari 2MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      if (info.file && info.file.status !== "removed") {
        console.log("File selected:", info.file.name);
      }
    },
    onRemove: () => {
      return true;
    },
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: true,
    },
  };

  const ProductForm = ({ form, onFinish, initialValues }) => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Form.Item
        name="productName"
        label="Nama Produk"
        rules={[{ required: true, message: "Nama produk wajib diisi" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="productUrl"
        label="Gambar Produk"
        valuePropName="file"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e && e.fileList && e.fileList.length > 0
            ? e.fileList[0]
            : e && e.file;
        }}
      >
        <div>
          {initialValues?.productUrl && (
            <div style={{ marginBottom: 8 }}>
              <span>Gambar saat ini:</span>
              <br />
              <img
                src={initialValues.productUrl}
                alt="Current product"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  marginTop: 4,
                }}
              />
            </div>
          )}
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
          </Upload>
        </div>
      </Form.Item>

      <Form.Item
        name="category"
        label="Kategori"
        rules={[{ required: true, message: "Kategori wajib dipilih" }]}
      >
        <Select placeholder="Pilih kategori">
          {CATEGORIES.map((category) => (
            <Option key={category.value} value={category.value}>
              {category.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="sellingPrice"
        label="Harga Jual"
        rules={[
          { required: true, message: "Harga jual wajib diisi" },
          {
            type: "number",
            min: 1,
            message: "Harga harus lebih dari 0",
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
          min={1}
          placeholder="Masukkan harga jual"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? "Simpan" : "Buat"}
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              initialValues
                ? setEditModalVisible(false)
                : setCreateModalVisible(false);
            }}
          >
            Batal
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Cari nama produk..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
          <Space>
            <span>Harga:</span>
            <InputNumber
              placeholder="Min"
              style={{ width: 120 }}
              onChange={(value) => handlePriceRangeChange("minPrice", value)}
              formatter={(value) =>
                `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
              min={0}
            />
            <InputNumber
              placeholder="Max"
              style={{ width: 120 }}
              onChange={(value) => handlePriceRangeChange("maxPrice", value)}
              formatter={(value) =>
                `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
              min={0}
            />
          </Space>
          <Button
            icon={<ClearOutlined />}
            onClick={handleResetFilters}
            title="Reset semua filter"
          >
            Reset Filter
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            title="Refresh data"
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Tambah Produk
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={products}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
      />

      <Modal
        title="Edit Produk"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <ProductForm
          form={form}
          onFinish={handleEditSubmit}
          initialValues={editingProduct}
        />
      </Modal>

      <Modal
        title="Tambah Produk Baru"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
      >
        <ProductForm form={createForm} onFinish={handleCreate} />
      </Modal>
    </Card>
  );
};

export default ProductTable;
