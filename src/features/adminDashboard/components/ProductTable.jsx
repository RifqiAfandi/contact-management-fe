import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Space,
  Card,
  Select,
  InputNumber,
  message,
  Button,
  Modal,
  Form,
  Upload,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const CATEGORIES = [
  { value: "Minuman", label: "Minuman" },
  { value: "Makanan", label: "Makanan" },
  { value: "Snack", label: "Snack" },
];

const ProductTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState({
    productName: "",
    category: undefined,
    minPrice: null,
    maxPrice: null,
  });

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

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products", {
        params: {
          page: params.current || pagination.current,
          limit: params.pageSize || pagination.pageSize,
          productName: filters.productName,
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sortField: params.sortField,
          sortOrder: params.sortOrder,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data.data || []);
      setPagination({
        ...pagination,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: response.data.pagination?.totalItems || 0,
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      message.error("Gagal memuat data produk");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const category = tableFilters.category?.[0];
    setFilters((prev) => ({
      ...prev,
      category: category,
    }));
    fetchData({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
      sortField: sorter.field,
      sortOrder:
        sorter.order === "ascend"
          ? "asc"
          : sorter.order === "descend"
          ? "desc"
          : undefined,
    });
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({
      ...prev,
      productName: value,
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

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
      content: `Apakah Anda yakin ingin menghapus produk ${product.productName}?`,
      okText: "Ya",
      cancelText: "Tidak",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/products/${product.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          message.success("Produk berhasil dihapus");
          fetchData();
        } catch (error) {
          console.error("Error deleting product:", error);
          message.error("Gagal menghapus produk");
        }
      },
    });
  };

  const handleEditSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("category", values.category);
      formData.append("sellingPrice", values.sellingPrice);

      if (values.productUrl && values.productUrl.file) {
        formData.append("productImage", values.productUrl.file.originFileObj);
      }

      await axios.put(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Produk berhasil diperbarui");
      setEditModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Gagal memperbarui produk");
    }
  };

  const handleCreate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("category", values.category);
      formData.append("sellingPrice", values.sellingPrice);

      if (values.productUrl && values.productUrl.file) {
        formData.append("productImage", values.productUrl.file.originFileObj);
      }

      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Produk berhasil dibuat");
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchData();
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("Gagal membuat produk");
    }
  };

  const uploadProps = {
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Anda hanya dapat mengunggah file gambar!");
      }
      return false;
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
      >
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="category"
        label="Kategori"
        rules={[{ required: true, message: "Kategori wajib dipilih" }]}
      >
        <Select placeholder="Pilih kategori">
          {CATEGORIES.map((cat) => (
            <Option key={cat.value} value={cat.value}>
              {cat.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="sellingPrice"
        label="Harga Jual"
        rules={[{ required: true, message: "Harga jual wajib diisi" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          formatter={(value) =>
            `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
          min={0}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
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
        <Space wrap justify="space-between" style={{ width: "100%" }}>
          <Space wrap>
            <Input
              placeholder="Cari nama produk"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
            <Space>
              <InputNumber
                placeholder="Min Harga"
                style={{ width: 120 }}
                onChange={(value) => handlePriceRangeChange("minPrice", value)}
                formatter={(value) =>
                  `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
                min={0}
              />
              <span>-</span>
              <InputNumber
                placeholder="Max Harga"
                style={{ width: 120 }}
                onChange={(value) => handlePriceRangeChange("maxPrice", value)}
                formatter={(value) =>
                  `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
                min={0}
              />
            </Space>
          </Space>
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
        dataSource={data}
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
