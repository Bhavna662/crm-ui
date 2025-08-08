import React, { useState } from 'react';

export default function Signup({ onSubmit }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 8)
      errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords must match';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
    } else {
      onSubmit && onSubmit(form);
      console.log('Signup data:', form);
      // Optionally reset: setForm({ firstName:'', lastName:'', … })
    }
  };

  const inputClass =
    'appearance-none rounded w-full px-3 py-2 border shadow-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          {['firstName', 'lastName', 'email', 'password', 'confirmPassword'].map(name => (
            <div className="mb-4" key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
                {name === 'confirmPassword' ? 'Confirm Password' : name.charAt(0).toUpperCase() + name.slice(1)}
              </label>
              <input
                type={name.toLowerCase().includes('password') ? 'password' : 'text'}
                name={name}
                id={name}
                value={form[name]}
                onChange={handleChange}
                className={inputClass + (errors[name] ? ' border-red-500' : ' border-gray-300')}
              />
              {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
