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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-darkText/70 text-lg">
        Loading payment history...
      </div>
    );
  }

  if (message) {
    return (
      <div className="flex justify-center items-center py-20 text-red-600 text-lg font-semibold">
        {message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-neutralBg rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center md:text-left text-darkText">
        Payment History
      </h2>

      <div className="overflow-x-auto rounded-lg shadow border border-neutralBg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-primary whitespace-nowrap">
                Package Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-primary whitespace-nowrap">
                Amount (USD)
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold border-r border-primary whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                Purchased At
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-neutralBg/50 transition-colors"
              >
                <td className="px-4 py-3 text-darkText font-medium whitespace-nowrap">
                  {payment.packageName}
                </td>
                <td className="px-4 py-3 text-darkText whitespace-nowrap">
                  ${(payment.amount / 100).toFixed(2)}
                </td>
                <td
                  className={`px-4 py-3 font-semibold whitespace-nowrap ${
                    payment.status === 'succeeded'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </td>
                <td className="px-4 py-3 text-darkText/70 whitespace-nowrap">
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
