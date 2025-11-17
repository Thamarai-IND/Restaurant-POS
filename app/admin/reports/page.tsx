'use client';

import { useState, useEffect } from 'react';
import { SalesReport } from '@/lib/types';
import { format, subMonths } from 'date-fns';

export default function ReportsPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [selectedMonth]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sales?month=${selectedMonth}`);
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      alert('Failed to fetch sales report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-red-500">
      <header className="bg-stone-950 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Monthly Sales Report</h1>
            <div className="space-x-4">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border rounded"
              />
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Print Report
              </button>
              <a
                href="/admin"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-gray-600"
              >
                Back to Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center text-2xl">Loading...</div>
        ) : report ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">
                Sales Report for {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-600">Total Sales</h3>
                  <p className="text-3xl font-bold text-blue-600">₹{report.totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
                  <p className="text-3xl font-bold text-green-600">{report.totalOrders}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-600">Average Order Value</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    ₹{report.totalOrders > 0 ? (report.totalSales / report.totalOrders).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Item-wise Sales</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Item Name</th>
                      <th className="px-6 py-3 text-left">Quantity Sold</th>
                      <th className="px-6 py-3 text-left">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.length > 0 ? (
                      report.items.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold">{item.name}</td>
                          <td className="px-6 py-4">{item.quantity}</td>
                          <td className="px-6 py-4">₹{item.revenue.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                          No sales data for this month
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-2xl">No report data available</div>
        )}
      </main>

      <style jsx global>{`
        @media print {
          header,
          button,
          input {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

