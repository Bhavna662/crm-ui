import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function CallLogForm({ customerId, onAdded, defaultData }) {
  const [form] = Form.useForm();

  // If defaultData (including timestamp) is async-loaded, inject it dynamically
  useEffect(() => {
    if (defaultData) {
      form.setFieldsValue({
        caller: defaultData.caller,
        duration: defaultData.duration,
        timestamp: defaultData.timestamp ? dayjs(defaultData.timestamp) : dayjs(),
      });
    }
  }, [defaultData, form]);

  const submit = async (values) => {
    await fetch('/api/calllogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        caller: values.caller,
        duration: values.duration,
        timestamp: values.timestamp.toISOString(),
      }),
    });
    form.resetFields();
    onAdded();
  };

  return (
    <Form
      form={form}
      layout="inline"
      style={{ marginBottom: 16 }}
      onFinish={submit}
      initialValues={{
        caller: defaultData?.caller,
        duration: defaultData?.duration,
        // Initial timestamp for first render
        timestamp: defaultData?.timestamp ? dayjs(defaultData.timestamp) : dayjs(),
      }}
    >
      <Form.Item name="caller" rules={[{ required: true }]}>
        <Input placeholder="Caller name" />
      </Form.Item>

      <Form.Item name="duration" rules={[{ required: true }]}>
        <InputNumber min={1} placeholder="Duration (min)" />
      </Form.Item>

      <Form.Item name="timestamp" rules={[{ required: true }]}>
        <DatePicker showTime />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Add Call</Button>
      </Form.Item>
    </Form>
  );
}
