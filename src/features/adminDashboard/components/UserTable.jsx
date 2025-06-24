import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Space,
  Card,
  Select,
  Button,
  Modal,
  Form,
  message,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const ROLES = [
  { value: "kasir", label: "Kasir" },
  { value: "gudang", label: "Gudang" },
];

const UserTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    role: undefined,
  });

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: ROLES.map((role) => ({ text: role.label, value: role.value })),
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
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
      const response = await axios.get("http://localhost:5000/api/auth/users", {
        params: {
          page: params.current || pagination.current,
          limit: params.pageSize || pagination.pageSize,
          name: filters.name,
          role: filters.role,
          sortField: params.sortField || undefined,
          sortOrder: params.sortOrder || undefined,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data.data || response.data.items || []);
      setPagination({
        ...pagination,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total:
          response.data.total ||
          (response.data.data ? response.data.data.length : 0),
      });
    } catch (error) {
      message.error("Gagal memuat data pengguna");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const role = tableFilters.role?.[0];
    setFilters((prev) => ({
      ...prev,
      role: role,
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
      name: value,
    }));
    // Reset to first page when searching
    fetchData({ current: 1, pageSize: pagination.pageSize });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      username: user.username,
      role: user.role,
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (user) => {
    Modal.confirm({
      title: "Konfirmasi Hapus",
      content: `Apakah Anda yakin ingin menghapus pengguna ${user.name}?`,
      okText: "Ya",
      cancelText: "Tidak",
      onOk: async () => {
        try {
          await axios.delete(
            `http://localhost:5000/api/auth/users/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          message.success("Pengguna berhasil dihapus");
          fetchData();
        } catch (error) {
          message.error("Gagal menghapus pengguna");
        }
      },
    });
  };

  const handleEditSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        username: values.username,
        role: values.role,
      };

      if (values.password) {
        payload.password = values.password;
      }

      await axios.put(
        `http://localhost:5000/api/auth/users/${editingUser.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Data pengguna berhasil diperbarui");
      setEditModalVisible(false);
      fetchData();
    } catch (error) {
      message.error("Gagal memperbarui data pengguna");
    }
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Cari nama pengguna"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
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
        title="Edit Pengguna"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="name"
            label="Nama"
            rules={[{ required: true, message: "Nama wajib diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username wajib diisi" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password Baru"
            rules={[{ required: false }]}
          >
            <Input.Password placeholder="Kosongkan jika tidak ingin mengubah password" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Role wajib dipilih" }]}
          >
            <Select>
              {ROLES.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Simpan
              </Button>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  form.resetFields();
                }}
              >
                Batal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserTable;
