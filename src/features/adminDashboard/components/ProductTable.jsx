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
  ClearOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const CATEGORIES = [
  { value: "Minuman", label: "Minuman" },
  { value: "Makanan", label: "Makanan" },
  { value: "Snack", label: "Snack" },
];

const ProductTable = () => {  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [tableKey, setTableKey] = useState(0); // Add key for forcing table re-render
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });  const [filters, setFilters] = useState({
    productName: "",
    category: undefined,
    minPrice: null,
    maxPrice: null,
  });
  const [searchValue, setSearchValue] = useState("");

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
  ];  const fetchData = async (params = {}) => {
    console.log("=== FETCHING PRODUCT DATA ===");
    console.log("Fetch params:", params);
    console.log("Current filters:", filters);
    console.log("Current pagination:", pagination);
    
    setLoading(true);
    try {
      const requestParams = {
        page: params.current || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        productName: filters.productName,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortField: params.sortField,
        sortOrder: params.sortOrder,
        // Add timestamp to prevent caching
        _t: Date.now(),
      };
      
      console.log("Request params:", requestParams);
      
      const response = await axios.get("http://localhost:5000/api/products", {
        params: requestParams,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      console.log("Fetch response:", response.data);
      
      // Handle both success and 404 responses
      if (response.data.isSuccess || response.status === 200) {
        console.log("Setting data:", response.data.data);
        const newData = response.data.data || [];
        setData(newData);
        
        const newPagination = {
          current: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          total: response.data.pagination?.totalItems || 0,
        };
        
        console.log("Setting pagination:", newPagination);
        setPagination(newPagination);
        
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      if (error.response?.status === 404) {
        // Handle no products found
        console.log("No products found, setting empty data");
        setData([]);
        setPagination(prev => ({
          ...prev,
          current: params.current || prev.current,
          pageSize: params.pageSize || prev.pageSize,
          total: 0,
        }));
        message.info("Tidak ada produk yang ditemukan");
      } else {
        message.error(error.response?.data?.message || "Gagal memuat data produk");
      }
    }
    setLoading(false);
    console.log("=== FETCH COMPLETE ===");
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);
  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const category = tableFilters.category?.[0];
    
    // Check if category filter changed
    const categoryChanged = category !== filters.category;
    
    setFilters((prev) => ({
      ...prev,
      category: category,
    }));
    
    fetchData({
      current: categoryChanged ? 1 : newPagination.current, // Reset to page 1 if category changed
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
    setPagination(prev => ({
      ...prev,
      current: 1, // Reset to first page when searching
    }));
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchEnter = () => {
    handleSearch(searchValue);
  };
  const handleSearchClear = () => {
    setSearchValue("");
    handleSearch("");
  };
  const handleResetFilters = () => {
    setSearchValue("");
    setFilters({
      productName: "",
      category: undefined,
      minPrice: null,
      maxPrice: null,
    });
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
  };

  const handleRefresh = async () => {
    console.log("Manual refresh triggered");
    setData([]);
    await fetchData({ current: pagination.current, pageSize: pagination.pageSize });
  };
  const handlePriceRangeChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setPagination(prev => ({
      ...prev,
      current: 1, // Reset to first page when filtering
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
  };  const handleDelete = (product) => {
    console.log("=== HANDLE DELETE CLICKED ===");
    console.log("Product to delete:", product);
    
    Modal.confirm({
      title: "Konfirmasi Hapus",
      content: `Apakah Anda yakin ingin menghapus produk "${product.productName}"?`,
      okText: "Ya",
      cancelText: "Tidak",
      onOk: async () => {
        console.log("=== USER CONFIRMED DELETE ===");
        
        // Show loading state
        setLoading(true);
        
        try {
          console.log(`Product details:`, {
            id: product.id,
            name: product.productName,
            type: typeof product.id
          });
          
          const deleteUrl = `http://localhost:5000/api/products/${product.id}`;
          console.log(`DELETE URL: ${deleteUrl}`);
          
          const token = localStorage.getItem("token");
          console.log(`Token exists: ${!!token}`);
          console.log(`Token length: ${token?.length || 0}`);
          
          if (!token) {
            throw new Error("No authentication token found");
          }
          
          console.log("Sending DELETE request...");
          const response = await axios.delete(deleteUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
          });
          
          console.log("=== DELETE RESPONSE RECEIVED ===");
          console.log("Response status:", response.status);
          console.log("Response headers:", response.headers);
          console.log("Response data:", response.data);
          
          if (response.status === 200 && response.data && response.data.isSuccess) {
            console.log("✅ Delete was successful");
            message.success("Produk berhasil dihapus");
            
            // Immediately update local state
            console.log("Updating local state...");
            setData(prevData => {
              const newData = prevData.filter(item => item.id !== product.id);
              console.log(`Data updated: ${prevData.length} -> ${newData.length}`);
              return newData;
            });
            
            // Update pagination
            setPagination(prev => ({
              ...prev,
              total: Math.max(0, prev.total - 1),
            }));
            
            // Force table re-render
            setTableKey(prev => prev + 1);
            
            // Refresh from server to confirm
            console.log("Refreshing from server...");
            setTimeout(() => {
              fetchData({ current: pagination.current, pageSize: pagination.pageSize });
            }, 1000);
            
          } else {
            console.log("❌ Delete failed - invalid response");
            message.error(response.data?.message || "Gagal menghapus produk - response tidak valid");
          }
        } catch (error) {
          console.log("=== DELETE ERROR ===");
          console.error("Full error object:", error);
          console.error("Error message:", error.message);
          console.error("Error response:", error.response?.data);
          console.error("Error status:", error.response?.status);
          console.error("Error config:", error.config);
          
          let errorMessage = "Gagal menghapus produk";
          
          if (error.response) {
            // Server responded with error status
            errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          } else if (error.request) {
            // Request was made but no response received
            errorMessage = "Tidak ada respons dari server. Pastikan server berjalan.";
          } else {
            // Something else happened
            errorMessage = error.message;
          }
          
          message.error(errorMessage);
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        console.log("User cancelled delete");
      }
    });
  };const handleEditSubmit = async (values) => {
    try {
      console.log("Edit form values:", values);
      
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("category", values.category);
      formData.append("sellingPrice", values.sellingPrice);
      
      // Get user data from localStorage or context
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      formData.append("userId", userData.id || editingProduct.userId || 1);

      // Check if file exists and append it
      if (values.productUrl) {
        let fileToUpload = null;
        
        // Handle different file formats from Antd Upload
        if (values.productUrl.originFileObj) {
          fileToUpload = values.productUrl.originFileObj;
        } else if (values.productUrl.file && values.productUrl.file.originFileObj) {
          fileToUpload = values.productUrl.file.originFileObj;
        } else if (values.productUrl instanceof File) {
          fileToUpload = values.productUrl;
        }
        
        if (fileToUpload) {
          formData.append("productImg", fileToUpload);
          console.log("File attached for update:", fileToUpload.name);
        } else {
          console.log("No valid file found for update");
        }
      } else {
        console.log("No new file for update");
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
      console.error("Error response:", error.response?.data);
      message.error(error.response?.data?.message || "Gagal memperbarui produk");
    }
  };const handleCreate = async (values) => {
    try {
      console.log("Form values:", values);
      
      const formData = new FormData();
      formData.append("productName", values.productName);
      formData.append("category", values.category);
      formData.append("sellingPrice", values.sellingPrice);
      
      // Get user data from localStorage or context
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = userData.id || 1;
      formData.append("userId", userId);

      // Check if file exists and append it
      if (values.productUrl) {
        let fileToUpload = null;
        
        // Handle different file formats from Antd Upload
        if (values.productUrl.originFileObj) {
          fileToUpload = values.productUrl.originFileObj;
        } else if (values.productUrl.file && values.productUrl.file.originFileObj) {
          fileToUpload = values.productUrl.file.originFileObj;
        } else if (values.productUrl instanceof File) {
          fileToUpload = values.productUrl;
        }
        
        if (fileToUpload) {
          formData.append("productImg", fileToUpload);
          console.log("File attached:", fileToUpload.name);
        } else {
          console.log("No valid file found in productUrl:", values.productUrl);
        }
      } else {
        console.log("No file attached");
      }

      // Debug FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Response:", response.data);
      message.success("Produk berhasil dibuat");
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchData();
    } catch (error) {
      console.error("Error creating product:", error);
      console.error("Error response:", error.response?.data);
      message.error(error.response?.data?.message || "Gagal membuat produk");
    }
  };const uploadProps = {
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
      console.log("Upload onChange:", info);
      // Update form field when file is selected
      if (info.file && info.file.status !== 'removed') {
        console.log("File selected:", info.file.name);
      }
    },
    onRemove: () => {
      console.log("File removed");
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
      </Form.Item>      <Form.Item
        name="productUrl"
        label="Gambar Produk"
        valuePropName="file"
        getValueFromEvent={(e) => {
          console.log("Upload event:", e);
          if (Array.isArray(e)) {
            return e;
          }
          return e && e.fileList && e.fileList.length > 0 ? e.fileList[0] : e && e.file;
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
                style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 4 }}
              />
            </div>
          )}
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>
              {initialValues ? "Ganti Gambar" : "Pilih Gambar"}
            </Button>
          </Upload>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            Format: JPG, PNG, GIF. Maksimal 2MB
          </div>
        </div>
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
      </Form.Item>      <Form.Item
        name="sellingPrice"
        label="Harga Jual"
        rules={[
          { required: true, message: "Harga jual wajib diisi" },
          { 
            type: 'number', 
            min: 1, 
            message: "Harga harus lebih dari 0" 
          }
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
        <Space wrap justify="space-between" style={{ width: "100%" }}>
          <Space wrap>            <Input
              placeholder="Cari nama produk"
              prefix={<SearchOutlined />}
              value={searchValue}
              onChange={handleSearchInputChange}
              onPressEnter={handleSearchEnter}
              style={{ width: 200 }}
              allowClear
              onClear={handleSearchClear}
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={handleSearchEnter}
            >
              Cari
            </Button>
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
                parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}                min={0}
              />
            </Space>            <Button 
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Tambah Produk
          </Button>
        </Space>
      </Space>      <Table
        key={tableKey} // Force re-render when key changes
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
