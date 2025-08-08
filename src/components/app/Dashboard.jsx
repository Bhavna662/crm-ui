// src/components/app/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Table, Spin, Statistic, Divider } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Content } = Layout;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalCalls, setTotalCalls] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
       const cusRes = await axios.get('/customer?limit=5');
       const logsRes = await axios.get('/log?limit=5&sort=-createdAt');
       const countRes = await axios.get('/customer/count');
       const callCountRes = await axios.get('/log/count');

        setCustomers(cusRes.data?.customers ?? cusRes.data);
        setLogs(logsRes.data);
        setTotalCustomers(countRes.data.count);
        setTotalCalls(callCountRes.data.count);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spin style={{ marginTop: 100 }} />;

  const customerCols = [
    { title: 'Name', dataIndex: 'fullname', key: 'fullname' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  const logsCols = [
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: ts => moment(ts).format('DD MMM YYYY, hh:mm A'),
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ margin: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Total Customers" value={totalCustomers} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="Total Calls Logged" value={totalCalls} />
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Recent Customers">
              <Table
                dataSource={customers}
                columns={customerCols}
                rowKey={record => record._id || record.id}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Recent Call Logs">
              <Table
                dataSource={logs}
                columns={logsCols}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
