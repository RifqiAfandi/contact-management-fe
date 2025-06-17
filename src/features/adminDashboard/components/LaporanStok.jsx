import React, { useState, useEffect } from 'react';
import { DatePicker, Card, Row, Col, Statistic, Table, Tag, Select, message, Spin } from 'antd';
import { ShopOutlined, AlertOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const LaporanStok = () => {
  const [loading, setLoading] = useState(false);
  const [stokTersedia, setStokTersedia] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'days'), dayjs()]);
  const [filterPeriod, setFilterPeriod] = useState('7days');  // Dummy data untuk stok terpakai
  const stokTerpakai = [
    {
      id: 1,
      itemName: 'Laptop Asus ROG',
      imageUrl: 'https://example.com/laptop.jpg',
      purchasePrice: 15000000,
      entryDate: '2024-12-01',
      dateUsed: '2024-12-15',
      status: 'Terjual'
    },
    {
      id: 2,
      itemName: 'Mouse Wireless',
      imageUrl: 'https://example.com/mouse.jpg',
      purchasePrice: 250000,
      entryDate: '2024-12-02',
      dateUsed: '2024-12-14',
      status: 'Terjual'
    },
    {
      id: 3,
      itemName: 'Keyboard Mechanical',
      imageUrl: 'https://example.com/keyboard.jpg',
      purchasePrice: 800000,
      entryDate: '2024-12-03',
      dateUsed: '2024-12-13',
      status: 'Rusak'
    },
    {
      id: 4,
      itemName: 'Monitor LG 24"',
      imageUrl: 'https://example.com/monitor.jpg',
      purchasePrice: 3500000,
      entryDate: '2024-12-04',
      dateUsed: '2024-12-12',
      status: 'Terjual'
    },
    {
      id: 5,
      itemName: 'Webcam HD',
      imageUrl: 'https://example.com/webcam.jpg',
      purchasePrice: 500000,
      entryDate: '2024-12-05',
      dateUsed: '2024-12-11',
      status: 'Expired'
    }
  ];

  const fetchStokTersedia = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const response = await axios.get("http://localhost:5000/api/inventory", {
        params: { page: 1, limit: 1000 },
        headers,
      });

      const stockItems = response.data.data || [];
      
      // Filter berdasarkan range tanggal
      const filteredItems = stockItems.filter(item => {
        const entryDate = dayjs(item.entryDate);
        return entryDate.isAfter(dateRange[0]) && entryDate.isBefore(dateRange[1].add(1, 'day'));
      });

      setStokTersedia(filteredItems);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      message.error("Gagal memuat data stok");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStokTersedia();
  }, [dateRange]);

  const handlePeriodChange = (value) => {
    setFilterPeriod(value);
    const today = dayjs();
    let startDate;

    switch (value) {
      case '1day':
        startDate = today.subtract(1, 'day');
        break;
      case '7days':
        startDate = today.subtract(7, 'days');
        break;
      case '30days':
        startDate = today.subtract(30, 'days');
        break;
      case '90days':
        startDate = today.subtract(90, 'days');
        break;
      default:
        startDate = today.subtract(7, 'days');
    }

    setDateRange([startDate, today]);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      setFilterPeriod('custom');
    }
  };

  // Kolom untuk tabel stok tersedia
  const columnsStokTersedia = [
    {
      title: 'Nama Produk',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 200,
    },
    {
      title: 'Gambar',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
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
      title: 'Harga Beli',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 120,
      render: (price) => `Rp ${price?.toLocaleString("id-ID")}`,
    },
    {
      title: 'Tanggal Masuk',
      dataIndex: 'entryDate',
      key: 'entryDate',
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: 'Tanggal Kadaluarsa',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      width: 130,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: 'Status',
      key: 'status',
      width: 150,
      render: (_, record) => {
        if (!record.expiredDate)
          return <Tag color="blue">Non-Expired</Tag>;

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
  ];  // Kolom untuk tabel stok terpakai
  const columnsStokTerpakai = [
    {
      title: 'Nama Produk',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 200,
    },
    {
      title: 'Gambar',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
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
      title: 'Harga Beli',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 120,
      render: (price) => `Rp ${price?.toLocaleString("id-ID")}`,
    },
    {
      title: 'Tanggal Masuk',
      dataIndex: 'entryDate',
      key: 'entryDate',
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: 'Tanggal Terpakai',
      dataIndex: 'dateUsed',
      key: 'dateUsed',
      width: 130,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        let color = 'default';
        switch (status) {
          case 'Terjual':
            color = 'green';
            break;
          case 'Rusak':
            color = 'red';
            break;
          case 'Expired':
            color = 'orange';
            break;
          default:
            color = 'blue';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];
  // Filter stok terpakai berdasarkan range tanggal
  const filteredStokTerpakai = stokTerpakai.filter(item => {
    const usedDate = dayjs(item.dateUsed);
    return usedDate.isAfter(dateRange[0]) && usedDate.isBefore(dateRange[1].add(1, 'day'));
  });

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <h2 style={{ margin: 0 }}>📊 Laporan Stok</h2>
          </Col>
          <Col span={6}>
            <Select
              value={filterPeriod}
              onChange={handlePeriodChange}
              style={{ width: '100%' }}
              placeholder="Pilih periode"
            >
              <Option value="1day">1 Hari Terakhir</Option>
              <Option value="7days">7 Hari Terakhir</Option>
              <Option value="30days">30 Hari Terakhir</Option>
              <Option value="90days">90 Hari Terakhir</Option>
              <Option value="custom">Custom Range</Option>
            </Select>
          </Col>
          <Col span={12}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              placeholder={['Tanggal Mulai', 'Tanggal Akhir']}
            />
          </Col>
        </Row>
      </Card>

      {/* Statistik Ringkasan */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Stok Tersedia"
              value={stokTersedia.length}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Stok Terpakai"
              value={filteredStokTerpakai.length}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Akan Expired"
              value={stokTersedia.filter(item => {
                if (!item.expiredDate) return false;
                const daysUntilExpiry = dayjs(item.expiredDate).diff(dayjs(), 'day');
                return daysUntilExpiry >= 0 && daysUntilExpiry < 30;
              }).length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sudah Expired"
              value={stokTersedia.filter(item => {
                if (!item.expiredDate) return false;
                return dayjs(item.expiredDate).isBefore(dayjs());
              }).length}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabel Stok Tersedia */}
      <Card 
        title="🟢 Stok Yang Masih Ada" 
        style={{ marginBottom: '24px' }}
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
      </Card>      {/* Tabel Stok Terpakai */}
      <Card 
        title="🔵 Stok Yang Sudah Terpakai" 
        extra={<Tag color="blue">{filteredStokTerpakai.length} Items</Tag>}
      >
        <Table
          columns={columnsStokTerpakai}
          dataSource={filteredStokTerpakai}
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
      </Card>

      {/* Informasi Summary */}
      <Card title="📋 Ringkasan Laporan" style={{ marginTop: '24px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ padding: '16px', backgroundColor: '#f6ffed', borderRadius: '6px' }}>
              <h4 style={{ color: '#52c41a', marginBottom: '8px' }}>✅ Stok Tersedia</h4>
              <p style={{ margin: 0 }}>
                Terdapat <strong>{stokTersedia.length} produk</strong> yang masih memiliki stok dalam periode {' '}
                <strong>{dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}</strong>
              </p>
            </div>
          </Col>          <Col span={12}>
            <div style={{ padding: '16px', backgroundColor: '#e6f4ff', borderRadius: '6px' }}>
              <h4 style={{ color: '#1890ff', marginBottom: '8px' }}>🔵 Stok Terpakai</h4>
              <p style={{ margin: 0 }}>
                Terdapat <strong>{filteredStokTerpakai.length} produk</strong> yang telah terpakai dalam periode {' '}
                <strong>{dateRange[0].format('DD/MM/YYYY')} - {dateRange[1].format('DD/MM/YYYY')}</strong>
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default LaporanStok;
