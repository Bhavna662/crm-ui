import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import fetcher from '../../lib/fetcher'
import { Button, Divider, Form, Input, Modal, Pagination, Skeleton, Table } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UserAddOutlined,
  ImportOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'
import axios from 'axios'
import moment from 'moment'
import lodash from 'lodash'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as XLS from 'xlsx'

axios.defaults.baseURL = import.meta.env.VITE_API_URL; 

const Customers = () => {
  const [importModal, setImportModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [filter, setFilter] = useState([])

  const navigate = useNavigate()

  const { data, error, isLoading } = useSWR(
    `/customer?page=${page}&limit=${limit}`,
    fetcher
  )

  const deleteCustomer = async (id) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`/customer/${id}`)
      mutate(`/customer?page=${page}&limit=${limit}`)
    }
  }

  const editCustomer = (id) => {
    const customer = data.customers.find((c) => c._id === id)
    if (customer) {
      setEditingCustomer(customer)
      setOpen(true)
    }
  }

  const addCustomer = async (values) => {
    try {
      if (editingCustomer) {
        await axios.put(`/customer/${editingCustomer._id}`, values)
        toast.success("Customer updated successfully!", { position: 'top-center' })
      } else {
        await axios.post('/customer', values)
        toast.success("Customer created successfully!", { position: 'top-center' })
      }

      setOpen(false)
      setImportModal(false)
      setEditingCustomer(null)
      mutate(`/customer?page=${page}&limit=${limit}`)
    } catch (err) {
      toast.error(err.message, { position: 'top-center' })
    }
  }

  const columns = [
    { key: 'fullname', title: 'Fullname', dataIndex: 'fullname' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    { key: 'mobile', title: 'Mobile', dataIndex: 'mobile' },
    {
      key: 'created',
      title: 'Created',
      render: (item) => (
        <label>
          {moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}
        </label>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className='space-x-3'>
          <Button
            onClick={() => editCustomer(item._id)}
            icon={<EditOutlined />}
            className='!text-violet-600 !border-violet-600 !border-2'
          />
          <Button
            onClick={() => deleteCustomer(item._id)}
            icon={<DeleteOutlined />}
            className='!text-rose-600 !border-rose-600 !border-2'
          />
          <Button
            onClick={() => navigate(`/app/logs?customer=${item._id}`)}
            icon={<EyeOutlined style={{ color: 'green' }} />}
            className='!border-green-600 !border-2'
          />
        </div>
      ),
    },
  ]

  const onPaginate = (pageNo, pageSize) => {
    setPage(pageNo)
    setLimit(pageSize)
  }

  const onSearch = lodash.debounce((e) => {
    const key = e.target.value.trim().toLowerCase()
    const filtered = data.customers.filter((item) =>
      item.fullname.toLowerCase().includes(key)
    )
    setFilter(filtered)
  }, 500)

  const downloadSample = () => {
    const a = document.createElement("a")
    a.href = "/sample.xls"
    a.download = "sample.xls"
    a.click()
    a.remove()
  }

  const importXLsFile = (e) => {
    const file = e.target.files[0]
    const ext = file.name.split(".").pop()

    if (!['xlsx', 'xls'].includes(ext))
      return toast.error("Invalid file format—please upload XLS/XLSX", { position: 'top-center' })

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = (e) => {
      const result = new Uint8Array(e.target.result)
      const excelFile = XLS.read(result, { type: "array" })
      const key = excelFile.SheetNames[0]
      const sheet = excelFile.Sheets[key]
      const rows = XLS.utils.sheet_to_json(sheet)

      if (rows.length === 0)
        return toast.error("Your file is empty", { position: 'top-center' })

      const valid = rows.filter(r => r.email && r.fullname && r.mobile)
      addCustomer(valid)
    }
  }

  if (isLoading) return <Skeleton active />

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Input
          size="large"
          placeholder='Search customers'
          prefix={<SearchOutlined className='!text-gray-300' />}
          className='!w-[350px]'
          onChange={onSearch}
        />
        <div className='space-x-4'>
          <Button
            icon={<ImportOutlined />}
            size="large"
            onClick={() => setImportModal(true)}
          >
            Import Customers
          </Button>

          <Button
            icon={<PlusOutlined />}
            size="large"
            type='primary'
            className='!bg-violet-500'
            onClick={() => setOpen(true)}
          >
            Add Customer
          </Button>
        </div>
      </div>

      <Divider />

      <Table
        columns={columns}
        dataSource={filter.length > 0 ? filter : data.customers}
        rowKey="_id"
        pagination={false}
      />

      <div className='flex justify-end'>
        <Pagination
          total={data.total}
          onChange={onPaginate}
          current={page}
          pageSize={limit}
          hideOnSinglePage
        />
      </div>

      <Modal
        open={open}
        footer={null}
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        onCancel={() => { setOpen(false); setEditingCustomer(null) }}
        maskClosable={false}
      >
        <Form layout="vertical" onFinish={addCustomer} initialValues={editingCustomer || {}}>
          <Form.Item label="Customer's name" name="fullname" rules={[{ required: true }]}>
            <Input size="large" placeholder='Mr Akash' />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" placeholder='mail@mail.com' />
          </Form.Item>
          <Form.Item name="mobile" rules={[{ required: true }]}>
            <PhoneInput country={'in'} containerClass='!w-full' inputClass='!w-full' />
          </Form.Item>
          <Form.Item>
            <Button icon={<UserAddOutlined />} type="primary" htmlType="submit" size='large'>
              {editingCustomer ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={importModal} footer={null} title="Import Customers" onCancel={() => setImportModal(false)}>
        <Divider />
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Sample XLS Format</h2>
            <Button icon={<DownloadOutlined />} size="large" onClick={downloadSample}>
              Download Sample
            </Button>
          </div>
          <div className='flex justify-center'>
            <Button className='!w-[100px] !h-[100px] flex flex-col !text-gray-500 relative'>
              <UploadOutlined className='text-3xl' />
              Upload XLS
              <input
                type="file"
                accept=".xls,.xlsx"
                className='w-full h-full absolute top-0 left-0 opacity-0'
                onChange={importXLsFile}
              />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Customers
