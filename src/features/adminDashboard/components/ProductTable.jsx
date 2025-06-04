import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table,
  Input,
  Space,
  Card,
  Select,
  InputNumber,
  message
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const CATEGORIES = [
  { value: 'Minuman', label: 'Minuman' },
  { value: 'Makanan', label: 'Makanan' },
  { value: 'Snack', label: 'Snack' }
];

const ProductTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    productName: '',
    category: undefined,
    minPrice: null,
    maxPrice: null
  });

  const columns = [
    {
      title: 'Nama Produk',
      dataIndex: 'productName',
      key: 'productName',
      sorter: true,
    },
    {
      title: 'Gambar',
      dataIndex: 'productUrl',
      key: 'productUrl',
      render: (productUrl) => 
        productUrl ? (
          <img 
            src={productUrl} 
            alt="Product" 
            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
          />
        ) : (
          <span>No image</span>
        ),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      filters: CATEGORIES,
      filterMultiple: false,
    },
    {
      title: 'Harga Jual',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      sorter: true,
      render: (price) => `Rp ${price.toLocaleString('id-ID')}`,
    }
  ];

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        params: {
          page: params.current || pagination.current,
          limit: params.pageSize || pagination.pageSize,
          productName: filters.productName,
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setData(response.data.items);
      setPagination({
        ...pagination,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching product data:', error);
      message.error('Gagal memuat data produk');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const category = tableFilters.category?.[0];
    setFilters(prev => ({
      ...prev,
      category: category
    }));
    
    fetchData({
      ...newPagination,
      sortField: sorter.field,
      sortOrder: sorter.order,
    });
  };

  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      productName: value
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
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
              onChange={(value) => handlePriceRangeChange('minPrice', value)}
              formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\Rp\s?|(,*)/g, '')}
              min={0}
            />
            <span>-</span>
            <InputNumber
              placeholder="Max Harga"
              style={{ width: 120 }}
              onChange={(value) => handlePriceRangeChange('maxPrice', value)}
              formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\Rp\s?|(,*)/g, '')}
              min={0}
            />
          </Space>
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
    </Card>
  );
};

export default ProductTable;
