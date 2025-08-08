import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Validation schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().matches(/^\+?\d*$/, 'Digits only').notRequired(),
  message: yup.string().required('Message is required'),
});

// Modal component
function Modal({ isOpen, onClose, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    const onClick = e => ref.current && !ref.current.contains(e.target) && onClose();
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onClick);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 overflow-auto">
      <div ref={ref} className="bg-white rounded-lg shadow-lg w-full max-w-xl sm:mx-auto">
        {children}
      </div>
    </div>
  );
}

export default function EnquiryApp() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  // Load enquiries
  useEffect(() => {
    axios.get('/enquiries')
      .then(res => setEnquiries(res.data))
      .catch(() => setError('Failed to load enquiries'))
      .finally(() => setLoading(false));
  }, []);

  // Open Add modal
  const openAdd = () => {
    setEditingId(null);
    reset();
    setModalOpen(true);
  };

  // Open Edit modal
  const openEdit = id => {
    const item = enquiries.find(e => e._id === id);
    if (!item) return;
    setEditingId(id);
    reset({
      name: item.name,
      email: item.email,
      phone: item.phone,
      message: item.message,
    });
    setModalOpen(true);
  };

  // Delete handler
  const handleDelete = async id => {
    if (!id || !window.confirm('Are you sure you want to delete?')) return;
    await axios.delete(`/api/enquiries/${id}`);
    setEnquiries(prev => prev.filter(e => e._id !== id));
  };

  // Submit handler for Add or Edit
  const onSubmit = async data => {
    let res;
    if (editingId) {
      res = await axios.put(`/api/enquiries/${editingId}`, data);
      setEnquiries(prev => prev.map(e => (e._id === editingId ? res.data : e)));
    } else {
      res = await axios.post('/api/enquiries', data);
      setEnquiries(prev => [...prev, res.data]);
    }
    reset();
    setModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 p-4">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Customer Enquiries</h1>
        <button onClick={openAdd} className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          + Add Enquiry
        </button>
      </header>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Fullname','Email','Mobile','Created','Message','Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-sm font-medium text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.map(e => (
                <tr key={e._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                  <td className="px-6 py-4">{e.name}</td>
                  <td className="px-6 py-4">{e.email}</td>
                  <td className="px-6 py-4">{e.phone}</td>
                  <td className="px-6 py-4">{new Date(e.created).toLocaleString()}</td>
                  <td className="px-6 py-4">{e.message}</td>
                  <td className="px-6 py-4 space-x-4">
                    <button className="text-purple-600 hover:underline" onClick={() => openEdit(e._id)}>Edit</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(e._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Enquiry' : 'New Enquiry'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {['name','email','phone','message'].map(key => (
              <div key={key}>
                {key !== 'message' ? (
                  <input
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    {...register(key)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 ${errors[key] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                ) : (
                  <textarea
                    placeholder="Message"
                    rows="4"
                    {...register(key)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-purple-500 ${errors[key] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
                {errors[key] && <p className="text-xs text-red-600">{errors[key].message}</p>}
              </div>
            ))}
            <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-purple-600 text-white rounded-lg">
              {isSubmitting ? 'Submitting...' : editingId ? 'Update Enquiry' : 'Submit Enquiry'}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="w-full py-2 border rounded-lg text-gray-700">
              Cancel
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
