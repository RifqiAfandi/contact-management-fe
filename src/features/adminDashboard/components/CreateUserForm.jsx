import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Card,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const ROLES = [
  { value: "kasir", label: "Kasir" },
  { value: "gudang", label: "Gudang" },
];

const CreateUserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("username", values.username);
      formData.append("password", values.password);
      formData.append("role", values.role);
      // Ganti field image sesuai backend (bukan profilImage)
      if (values.profilImage && values.profilImage.file) {
        formData.append("image", values.profilImage.file);
      }
      await axios.post("http://localhost:3000/api/auth/users", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Jangan set Content-Type, biarkan browser yang mengatur
        },
      });
      message.success("User berhasil dibuat");
      form.resetFields();
      setImageUrl("");
    } catch (error) {
      console.error("Error creating user:", error);
      message.error("Gagal membuat user");
    }
    setLoading(false);
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      // Get the uploaded file URL from response
      setImageUrl(info.file.response.url);
      message.success(`${info.file.name} berhasil diunggah`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} gagal diunggah`);
    }
  };

  const uploadProps = {
    name: "profilImage",
    // Tidak perlu action, upload dilakukan saat submit
    beforeUpload: () => false, // Supaya file tidak langsung diupload
    maxCount: 1,
    accept: "image/*",
    showUploadList: true,
  };

  return (
    <Card
      title="Buat User Baru"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Nama"
          rules={[{ required: true, message: "Nama wajib diisi" }]}
        >
          <Input placeholder="Masukkan nama lengkap" />
        </Form.Item>

        <Form.Item
          name="profilImage"
          label="Foto Profil"
          valuePropName="file"
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Pilih Foto</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: "Username wajib diisi" },
            { min: 3, message: "Username minimal 3 karakter" },
          ]}
        >
          <Input placeholder="Masukkan username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Password wajib diisi" },
            { min: 6, message: "Password minimal 6 karakter" },
          ]}
        >
          <Input.Password placeholder="Masukkan password" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Role wajib dipilih" }]}
        >
          <Select placeholder="Pilih role">
            {ROLES.map((role) => (
              <Option
                key={role.value}
                value={role.value}
              >
                {role.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Buat User
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setImageUrl("");
              }}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateUserForm;
