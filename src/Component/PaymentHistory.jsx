import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import axiosInstance from '../Api/axios';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.email) {
      setMessage('User not logged in');
      setLoading(false);
      return;
    }

    axiosInstance
      .get(`/payments/${user.email}`)
      .then((res) => {
        // Check if payments array exists and has items
        if (res.data.payments?.length) {
          setPayments(res.data.payments);
          setMessage('');
        } else {
          setMessage('No payment history found');
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage('Failed to fetch payment history');
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500 text-lg">
        Loading payment history...
      </div>
    );
  }

  // Message state for no data or errors
  if (message) {
    return (
      <div className="flex justify-center items-center py-20 text-red-600 text-lg font-semibold">
        {message}
      </div>
    );
  }

  // Main payment history table
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Payment History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left px-6 py-3 uppercase font-medium text-sm border-r border-blue-500">
                Package Name
              </th>
              <th className="text-left px-6 py-3 uppercase font-medium text-sm border-r border-blue-500">
                Amount (USD)
              </th>
              <th className="text-left px-6 py-3 uppercase font-medium text-sm border-r border-blue-500">
                Status
              </th>
              <th className="text-left px-6 py-3 uppercase font-medium text-sm">
                Purchased At
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {payment.packageName}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  ${ (payment.amount / 100).toFixed(2) }
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    payment.status === 'succeeded'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(payment.purchasedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
