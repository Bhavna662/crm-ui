
import React from 'react'
import { Link } from 'react-router-dom'

const CustomerLink = ({ to, children }) => (
  <Link to={to} className="text-blue-600 hover:underline">
    {children}
  </Link>
)

export default CustomerLink
