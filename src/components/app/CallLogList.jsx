import React from 'react';
import { Table, Button, Popconfirm, Empty } from 'antd';
import useSWR, { useSWRConfig } from 'swr';

export default function CallLogList({ customerId }) {
  const endpoint = customerId
    ? `/api/calllogs/customer/${customerId}`
    : `/api/calllogs`;

  const { data: logs, isLoading } = useSWR(endpoint);
  const { mutate } = useSWRConfig();

  const deleteLog = async (id) => {
    await fetch(`/api/calllogs/${id}`, { method: 'DELETE' });
    mutate(endpoint); // revalidate the current list
  };

  const columns = [
    { title: 'Caller', dataIndex: 'caller', key: 'caller' },
    { title: 'Duration (min)', dataIndex: 'duration', key: 'duration' },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: ts => new Date(ts).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm title="Delete?" onConfirm={() => deleteLog(record._id)}>
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <h2 style={{ marginBottom: 16 }}>
        {customerId ? `Call Logs for Customer ${customerId}` : 'All Call Logs'}
      </h2>

      <Table
        rowKey="_id"
        dataSource={logs || []}
        columns={columns}
        loading={isLoading}
        locale={{
          emptyText: (
            <Empty
              description={
                customerId
                  ? 'No logs found for this customer.'
                  : 'No logs available.'
              }
            />
          ),
        }}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
}
