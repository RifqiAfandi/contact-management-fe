import React, { useState } from "react";
import {
  Table,
  Input,
  Space,
  Card,
  Select,
  Button,
  Modal,
  Form,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useUsers } from "../hooks/useUsers";

const { Option } = Select;

const ROLES = [
  { value: "kasir", label: "Kasir" },
  { value: "gudang", label: "Gudang" },
];

const UserTable = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const {
    users,
    loading,
    pagination,
    handleTableChange,
    handleSearch,
    handleUpdate,
    handleDelete,
  } = useUsers();

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
            onClick={() => handleUserDelete(record)}
          >
            Hapus
          </Button>
        </Space>
      ),
    },
  ];
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      username: user.username,
      role: user.role,
    });
    setEditModalVisible(true);
  };
  const handleUserDelete = (user) => {
    Modal.confirm({
      title: "Konfirmasi Hapus",
      content: `Apakah Anda yakin ingin menghapus pengguna ${user.name}?`,
      okText: "Ya",
      cancelText: "Tidak",
      onOk: async () => {
        await handleDelete(user.id, user.name);
      },
    });
  };
  const handleEditSubmit = async (values) => {
    const payload = {
      name: values.name,
      username: values.username,
      role: values.role,
    };

    if (values.password) {
      payload.password = values.password;
    }

    const success = await handleUpdate(editingUser.id, payload);
    if (success) {
      setEditModalVisible(false);
      form.resetFields();
    }
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Cari nama pengguna"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch({ name: e.target.value, role: undefined })}
            style={{ width: 200 }}
            allowClear
          />
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={users}
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
