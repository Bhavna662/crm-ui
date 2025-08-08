import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Table, Spin, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);


  const params = new URLSearchParams(useLocation().search);
  const customerId = params.get('customer');

  useEffect(() => {
    const fetchLogsAndCustomer = async () => {
      try {
        setLoading(true);

        if (customerId) {
          // Fetch logs for this customer
          const logsRes = await axios.get(`/customer/${customerId}/logs`);
          setLogs(logsRes.data);

          // Fetch customer details
          const custRes = await axios.get(`/customer/${customerId}`);
          setCustomer(custRes.data);
        } else {
          // Fetch all logs
          const logsRes = await axios.get(`/log`);
          setLogs(logsRes.data);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogsAndCustomer();
  }, [customerId]);

  if (loading) return <Spin style={{ margin: 40 }} />;

  const cols = [
    {
      key: 'createdAt',
      title: 'Time',
      dataIndex: 'createdAt',
      render: ts => moment(ts).format('DD MMM YYYY, hh:mm A'),
    },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ];

  return (
    <div>
      <Link to="/app/customers">
        <Button>← Back to Customers</Button>
      </Link>
      <h2 style={{ margin: '20px 0' }}>
        {customerId
          ? `Call Logs for ${customer?.fullname || 'Customer'}`
          : 'All Call Logs'}
      </h2>
      <Table
        dataSource={logs}
        columns={cols}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Logs;
