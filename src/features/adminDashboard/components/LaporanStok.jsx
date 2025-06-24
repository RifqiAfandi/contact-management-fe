import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Select,
  message,
  Spin,
  Button,
} from "antd";
import {
  ShopOutlined,
  AlertOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const LaporanStok = () => {
  const [loading, setLoading] = useState(false);
  const [loadingUsed, setLoadingUsed] = useState(false);
  const [stokTersedia, setStokTersedia] = useState([]);
  const [stokTerpakai, setStokTerpakai] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, "days"),
    dayjs(),
  ]);
  const [filterPeriod, setFilterPeriod] = useState("7days");
  const fetchStokTersedia = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      // Fetch all available stock (status != 'Terpakai')
      const response = await axios.get(
        "http://localhost:5000/api/inventory/all",
        {
          headers,
        }
      );

      const allItems = response.data.data || [];

      // Filter stock that is NOT used and within date range
      const availableStock = allItems.filter((item) => {
        const entryDate = dayjs(item.entryDate);
        const isInDateRange =
          entryDate.isAfter(dateRange[0]) &&
          entryDate.isBefore(dateRange[1].add(1, "day"));
        const isNotUsed = item.status !== "Terpakai";
        return isInDateRange && isNotUsed;
      });
      setStokTersedia(availableStock);
    } catch (error) {
      message.error("Gagal memuat data stok tersedia");
    }
    setLoading(false);
  };

  const fetchStokTerpakai = async () => {
    setLoadingUsed(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      // Fetch all used stock (status = 'Terpakai')
      const response = await axios.get(
        "http://localhost:5000/api/inventory/all",
        {
          headers,
        }
      );

      const allItems = response.data.data || [];

      // Filter stock that is used and within date range (based on useDate)
      const usedStock = allItems.filter((item) => {
        if (item.status !== "Terpakai" || !item.useDate) return false;

        const useDate = dayjs(item.useDate);
        return (
          useDate.isAfter(dateRange[0]) &&
          useDate.isBefore(dateRange[1].add(1, "day"))
        );
      });
      setStokTerpakai(usedStock);
    } catch (error) {
      message.error("Gagal memuat data stok terpakai");
    }
    setLoadingUsed(false);
  };
  useEffect(() => {
    fetchStokTersedia();
    fetchStokTerpakai();
  }, [dateRange]);
  const handlePeriodChange = (value) => {
    setFilterPeriod(value);
    const today = dayjs();
    let startDate;

    switch (value) {
      case "1day":
        startDate = today.subtract(1, "day");
        break;
      case "7days":
        startDate = today.subtract(7, "days");
        break;
      case "30days":
        startDate = today.subtract(30, "days");
        break;
      case "90days":
        startDate = today.subtract(90, "days");
        break;
      default:
        startDate = today.subtract(7, "days");
    }

    setDateRange([startDate, today]);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      setFilterPeriod("custom");
    }
  };

  const refreshData = () => {
    fetchStokTersedia();
    fetchStokTerpakai();
  };

  // Kolom untuk tabel stok tersedia
  const columnsStokTersedia = [
    {
      title: "Nama Produk",
      dataIndex: "itemName",
      key: "itemName",
      width: 200,
    },
    {
      title: "Gambar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>No image</span>
        ),
    },
    {
      title: "Harga Beli",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 120,
      render: (price) => `Rp ${price?.toLocaleString("id-ID")}`,
    },
    {
      title: "Tanggal Masuk",
      dataIndex: "entryDate",
      key: "entryDate",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Tanggal Kadaluarsa",
      dataIndex: "expiredDate",
      key: "expiredDate",
      width: 130,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      render: (_, record) => {
        if (!record.expiredDate) return <Tag color="blue">Non-Expired</Tag>;

        const now = dayjs();
        const expiry = dayjs(record.expiredDate);
        const daysUntilExpiry = expiry.diff(now, "day");

        if (daysUntilExpiry < 0) {
          return <Tag color="red">Kadaluarsa</Tag>;
        } else if (daysUntilExpiry < 30) {
          return <Tag color="orange">Hampir Kadaluarsa</Tag>;
        }
        return <Tag color="green">Baik</Tag>;
      },
    },
  ]; // Kolom untuk tabel stok terpakai
  const columnsStokTerpakai = [
    {
      title: "Nama Produk",
      dataIndex: "itemName",
      key: "itemName",
      width: 200,
    },
    {
      title: "Gambar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (imageUrl) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>No image</span>
        ),
    },
    {
      title: "Harga Beli",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 120,
      render: (price) => `Rp ${price?.toLocaleString("id-ID")}`,
    },
    {
      title: "Tanggal Masuk",
      dataIndex: "entryDate",
      key: "entryDate",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Tanggal Terpakai",
      dataIndex: "useDate",
      key: "useDate",
      width: 130,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        // Since we're filtering for 'Terpakai' status, all should be 'Terpakai'
        return <Tag color="blue">Terpakai</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {" "}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={16} align="middle">
          <Col span={5}>
            <h2 style={{ margin: 0 }}>📊 Laporan Stok</h2>
          </Col>
          <Col span={5}>
            <Select
              value={filterPeriod}
              onChange={handlePeriodChange}
              style={{ width: "100%" }}
              placeholder="Pilih periode"
            >
              <Option value="1day">1 Hari Terakhir</Option>
              <Option value="7days">7 Hari Terakhir</Option>
              <Option value="30days">30 Hari Terakhir</Option>
              <Option value="90days">90 Hari Terakhir</Option>
              <Option value="custom">Custom Range</Option>
            </Select>
          </Col>
          <Col span={10}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder={["Tanggal Mulai", "Tanggal Akhir"]}
            />
          </Col>
          <Col span={4}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={refreshData}
              loading={loading || loadingUsed}
              style={{ width: "100%" }}
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>
      {/* Statistik Ringkasan */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Stok Tersedia"
              value={stokTersedia.length}
              prefix={<ShopOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>{" "}
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Stok Terpakai"
              value={stokTerpakai.length}
              prefix={<AlertOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Akan Expired"
              value={
                stokTersedia.filter((item) => {
                  if (!item.expiredDate) return false;
                  const daysUntilExpiry = dayjs(item.expiredDate).diff(
                    dayjs(),
                    "day"
                  );
                  return daysUntilExpiry >= 0 && daysUntilExpiry < 30;
                }).length
              }
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sudah Expired"
              value={
                stokTersedia.filter((item) => {
                  if (!item.expiredDate) return false;
                  return dayjs(item.expiredDate).isBefore(dayjs());
                }).length
              }
              prefix={<AlertOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>
      {/* Tabel Stok Tersedia */}
      <Card
        title="🟢 Stok Yang Masih Ada"
        style={{ marginBottom: "24px" }}
        extra={<Tag color="green">{stokTersedia.length} Items</Tag>}
      >
        <Spin spinning={loading}>
          <Table
            columns={columnsStokTersedia}
            dataSource={stokTersedia}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} dari ${total} items`,
            }}
            scroll={{ x: 800 }}
          />
        </Spin>
      </Card>{" "}
      {/* Tabel Stok Terpakai */}
      <Card
        title="🔵 Stok Yang Sudah Terpakai"
        extra={<Tag color="blue">{stokTerpakai.length} Items</Tag>}
      >
        <Spin spinning={loadingUsed}>
          <Table
            columns={columnsStokTerpakai}
            dataSource={stokTerpakai}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} dari ${total} items`,
            }}
            scroll={{ x: 800 }}
          />
        </Spin>
      </Card>
      {/* Informasi Summary */}
      <Card title="📋 Ringkasan Laporan" style={{ marginTop: "24px" }}>
        <Row gutter={16}>
          <Col span={12}>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f6ffed",
                borderRadius: "6px",
              }}
            >
              <h4 style={{ color: "#52c41a", marginBottom: "8px" }}>
                ✅ Stok Tersedia
              </h4>
              <p style={{ margin: 0 }}>
                Terdapat <strong>{stokTersedia.length} produk</strong> yang
                masih memiliki stok dalam periode{" "}
                <strong>
                  {dateRange[0].format("DD/MM/YYYY")} -{" "}
                  {dateRange[1].format("DD/MM/YYYY")}
                </strong>
              </p>
            </div>
          </Col>{" "}
          <Col span={12}>
            {" "}
            <div
              style={{
                padding: "16px",
                backgroundColor: "#e6f4ff",
                borderRadius: "6px",
              }}
            >
              <h4 style={{ color: "#1890ff", marginBottom: "8px" }}>
                🔵 Stok Terpakai
              </h4>
              <p style={{ margin: 0 }}>
                Terdapat <strong>{stokTerpakai.length} produk</strong> yang
                telah terpakai dalam periode{" "}
                <strong>
                  {dateRange[0].format("DD/MM/YYYY")} -{" "}
                  {dateRange[1].format("DD/MM/YYYY")}
                </strong>
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default LaporanStok;
