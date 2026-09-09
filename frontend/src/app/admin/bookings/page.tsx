"use client";

import { useState, useEffect } from "react";
import {
  Table, Tag, Select, Button, Space, Popconfirm, message, Typography, Modal, Descriptions, Input,
} from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const API = "http://localhost:5000/api/admin";

const statusColors: Record<string, string> = {
  Pending: "gold",
  Confirmed: "green",
  Cancelled: "red",
  Completed: "blue",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/bookings`, { credentials: "include" });
      if (res.ok) setBookings(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (res.ok) {
        message.success(`Status updated to ${status}`);
        fetchBookings();
      } else {
        const data = await res.json();
        message.error(data.message || "Failed to update");
      }
    } catch {
      message.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API}/bookings/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        message.success("Booking deleted");
        fetchBookings();
      } else {
        const data = await res.json();
        message.error(data.message || "Failed to delete");
      }
    } catch {
      message.error("Failed to delete");
    }
  };

  const showDetail = (record: any) => {
    setSelected(record);
    setDetailOpen(true);
  };

  const columns = [
    {
      title: "Customer", key: "customer", width: 160,
      render: (_: any, r: any) => r.user?.name || "Unknown",
    },
    {
      title: "Email", key: "email", ellipsis: true,
      render: (_: any, r: any) => r.user?.email || "-",
    },
    {
      title: "Product", key: "product", ellipsis: true,
      render: (_: any, r: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={r.product?.images?.[0] || "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=200"}
            alt=""
            style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(212,168,83,0.3)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=200";
            }}
          />
          <span>{r.product?.name || "Deleted Product"}</span>
        </div>
      ),
    },
    {
      title: "Dates", key: "dates", width: 220,
      render: (_: any, r: any) =>
        r.startDate ? `${new Date(r.startDate).toLocaleDateString()} — ${new Date(r.endDate).toLocaleDateString()}` : "-",
    },
    {
      title: "Total", dataIndex: "totalPrice", key: "totalPrice", width: 100,
      render: (v: number) => `$${v?.toFixed(2) || "0.00"}`,
      sorter: (a: any, b: any) => (a.totalPrice || 0) - (b.totalPrice || 0),
    },
    {
      title: "Phone", dataIndex: "phone", key: "phone", width: 130,
    },
    {
      title: "Status", dataIndex: "status", key: "status", width: 140,
      render: (status: string, record: any) => (
        <Select
          value={status}
          size="small"
          style={{ width: 120 }}
          onChange={(val) => handleStatusChange(record._id, val)}
          options={["Pending", "Confirmed", "Cancelled", "Completed"].map((s) => ({
            label: <Tag color={statusColors[s]} style={{ margin: 0 }}>{s}</Tag>,
            value: s,
          }))}
        />
      ),
    },
    {
      title: "Actions", key: "actions", width: 110,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => showDetail(record)} />
          <Popconfirm title="Delete this booking?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredBookings = bookings.filter((b: any) => {
    const customerName = b.user?.name?.toLowerCase() || "";
    const customerEmail = b.user?.email?.toLowerCase() || "";
    const productName = b.product?.name?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();
    
    const matchesSearch = customerName.includes(q) || customerEmail.includes(q) || productName.includes(q);
    const matchesStatus = !statusFilter || b.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0, fontFamily: "serif", color: "#d4a853" }}>Reservations & Bookings</Title>
        <Text style={{ color: "#a39589" }}>Review bridal and jewellery rental dates, user phone records, and update status options</Text>
      </div>

      {/* Filter Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", background: "#1c1410", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(212,168,83,0.15)" }}>
        <Input
          placeholder="Search by customer name, email, or product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 340 }}
          allowClear
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter || undefined}
          onChange={(v) => setStatusFilter(v || "")}
          style={{ width: 180 }}
          allowClear
          options={[
            { label: "All Statuses", value: "" },
            ...Object.keys(statusColors).map(s => ({
              label: <Tag color={statusColors[s]} style={{ margin: 0 }}>{s}</Tag>,
              value: s
            }))
          ]}
        />
      </div>

      <Table
        dataSource={filteredBookings}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ border: "1px solid rgba(212,168,83,0.1)", borderRadius: 8, overflow: "hidden" }}
      />
      <Modal
        title="Booking Details"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={<Button onClick={() => setDetailOpen(false)}>Close</Button>}
      >
        {selected && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Booking ID">{selected._id}</Descriptions.Item>
            <Descriptions.Item label="Customer">{selected.user?.name} ({selected.user?.email})</Descriptions.Item>
            <Descriptions.Item label="Product">{selected.product?.name}</Descriptions.Item>
            <Descriptions.Item label="Start Date">{new Date(selected.startDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="End Date">{new Date(selected.endDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Total Price">₹{selected.totalPrice?.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selected.phone}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selected.status]}>{selected.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Notes">{selected.notes || "-"}</Descriptions.Item>
            <Descriptions.Item label="Created">{new Date(selected.createdAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
