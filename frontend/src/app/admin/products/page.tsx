"use client";

import { useState, useEffect } from "react";
import {
  Table, Button, Modal, Form, Input, InputNumber, Select, Switch, Space, Popconfirm, Tag, Typography, Upload, App,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const API = "http://localhost:5000/api/admin";

const categories = ["Bridal Sets", "Necklaces", "Earrings & Bangles", "Fancy Items", "Rings", "Anklets", "Bridal Dresses"];

export default function AdminProducts() {
  const { message } = App.useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [form] = Form.useForm();
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleUpload = async (file: File) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      
      const currentImages = form.getFieldValue("images");
      let newImages = "";
      if (Array.isArray(currentImages)) {
        newImages = [...currentImages, data.url].join(", ");
      } else if (typeof currentImages === "string" && currentImages.trim() !== "") {
        newImages = `${currentImages}, ${data.url}`;
      } else {
        newImages = data.url;
      }

      form.setFieldsValue({ images: newImages });
      message.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`, { credentials: "include" });
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API}/products/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        message.success("Product deleted");
        fetchProducts();
      } else {
        const data = await res.json();
        message.error(data.message || "Failed to delete");
      }
    } catch {
      message.error("Failed to delete");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (typeof values.images === "string") {
        values.images = values.images.split(",").map((s: string) => s.trim()).filter(Boolean);
      }
      if (typeof values.features === "string") {
        values.features = values.features.split(",").map((s: string) => s.trim()).filter(Boolean);
      }
      const url = editing ? `${API}/products/${editing._id}` : `${API}/products`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(values), credentials: "include" });
      if (res.ok) {
        message.success(editing ? "Product updated" : "Product created");
        setModalOpen(false);
        fetchProducts();
      } else {
        const data = await res.json();
        message.error(data.message || "Operation failed");
      }
    } catch {
      message.error("Please check the form");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", ellipsis: true },
    {
      title: "Category", dataIndex: "category", key: "category", render: (cat: string) => <Tag>{cat}</Tag>,
    },
    {
      title: "Price/Day", dataIndex: "pricePerDay", key: "pricePerDay", render: (v: number) => `₹${v}`,
      sorter: (a: any, b: any) => a.pricePerDay - b.pricePerDay,
    },
    {
      title: "Deposit", dataIndex: "securityDeposit", key: "securityDeposit", render: (v: number) => `₹${v}`,
    },
    {
      title: "Available", dataIndex: "isAvailable", key: "isAvailable",
      render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "Yes" : "No"}</Tag>,
    },
    { title: "Images", dataIndex: "images", key: "images", render: (imgs: string[]) => imgs?.length || 0 },
    {
      title: "Actions", key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredProducts = products.filter((prod: any) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || prod.category === categoryFilter;
    const matchesAvailability = !availabilityFilter || String(prod.isAvailable) === availabilityFilter;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <App>
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontFamily: "serif", color: "#d4a853" }}>Product Inventory</Title>
          <Text style={{ color: "#a39589" }}>Manage items, category tags, pricing, and warranty details</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ backgroundColor: "#d4a853", borderColor: "#d4a853", color: "#1c1410", fontWeight: "bold" }}>
          Add Product
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", background: "#1c1410", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(212,168,83,0.15)" }}>
        <Input
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 260 }}
          allowClear
        />
        <Select
          placeholder="Filter by category"
          value={categoryFilter || undefined}
          onChange={(v) => setCategoryFilter(v || "")}
          style={{ width: 180 }}
          allowClear
          options={[
            { label: "All Categories", value: "" },
            ...categories.map(c => ({ label: c, value: c }))
          ]}
        />
        <Select
          placeholder="Filter by availability"
          value={availabilityFilter || undefined}
          onChange={(v) => setAvailabilityFilter(v || "")}
          style={{ width: 180 }}
          allowClear
          options={[
            { label: "All Statuses", value: "" },
            { label: "Available", value: "true" },
            { label: "Booked/Unavailable", value: "false" }
          ]}
        />
      </div>

      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ border: "1px solid rgba(212,168,83,0.1)", borderRadius: 8, overflow: "hidden" }}
      />
      <Modal
        title={editing ? "Edit Product" : "Create Product"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? "Update" : "Create"}
        width={640}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Space style={{ width: "100%" }} size="large">
            <Form.Item name="pricePerDay" label="Price per Day (₹)" rules={[{ required: true }]} style={{ width: 180 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="securityDeposit" label="Security Deposit (₹)" rules={[{ required: true }]} style={{ width: 180 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select options={categories.map((c) => ({ label: c, value: c }))} />
          </Form.Item>
          <Form.Item label="Product Images">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
              <Form.Item name="images" noStyle>
                <Input placeholder="Image URLs (comma-separated, e.g. https://... or use upload button below)" />
              </Form.Item>
              <Upload
                accept="image/*"
                beforeUpload={(file) => {
                  handleUpload(file);
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} loading={uploadingImage} style={{ border: "1px dashed #d4a853", color: "#d4a853", background: "rgba(212,168,83,0.05)", width: "100%" }}>
                  Upload Photo from Laptop
                </Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item name="features" label="Features (comma-separated)">
            <Input placeholder="Feature 1, Feature 2, ..." />
          </Form.Item>
          <Form.Item name="isAvailable" label="Available for Booking" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </App>
  );
}
