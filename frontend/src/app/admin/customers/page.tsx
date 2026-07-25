"use client";

import { useState, useEffect } from "react";
import { Table, Tag, Typography, Avatar, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const API = "http://localhost:5000/api/admin";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${API}/customers`, { credentials: "include" });
        if (res.ok) setCustomers(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c: any) => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const columns = [
    {
      title: "", key: "avatar", width: 50,
      render: (_: any, record: any) => (
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: record.isAdmin ? "#d4a853" : "#8c7e74", color: "#120c09" }} />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name", sorter: (a: any, b: any) => a.name.localeCompare(b.name) },
    { title: "Email", dataIndex: "email", key: "email", ellipsis: true },
    {
      title: "Role", dataIndex: "isAdmin", key: "isAdmin",
      render: (isAdmin: boolean) => isAdmin ? <Tag color="gold">Admin</Tag> : <Tag>Customer</Tag>,
    },
    {
      title: "Joined", dataIndex: "createdAt", key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend" as const,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0, fontFamily: "serif", color: "#d4a853" }}>Customer Directory</Title>
        <Text style={{ color: "#a39589" }}>View registered accounts, security details, and registration dates</Text>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", background: "#1c1410", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(212,168,83,0.15)" }}>
        <Input
          placeholder="Search by customer name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 340 }}
          allowClear
        />
      </div>

      <Table
        dataSource={filteredCustomers}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ border: "1px solid rgba(212,168,83,0.1)", borderRadius: 8, overflow: "hidden" }}
      />
    </div>
  );
}
