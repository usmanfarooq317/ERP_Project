import React from 'react';

const InvoiceStatusProgress: React.FC = () => {
  const totalInvoices = 100;

  const invoiceStatuses = [
    'paid', 'pending', 'overdue', 'paid', 'unpaid', 'unpaid',
    'draft', 'draft', 'partially', 'overdue'
  ];

  const statusCounts: Record<string, number> = {
    draft: 0,
    pending: 0,
    overdue: 0,
    paid: 0,
    unpaid: 0,
    partially: 0,
  };

  invoiceStatuses.forEach(status => {
    const lowerStatus = status.toLowerCase();
    if (statusCounts.hasOwnProperty(lowerStatus)) {
      statusCounts[lowerStatus]++;
    }
  });

  const statusPercentages: Record<string, number> = {};
  for (const status in statusCounts) {
    statusPercentages[status] = (statusCounts[status] / totalInvoices) * 100;
  }

  const statusOrder = ['draft', 'pending', 'overdue', 'paid', 'unpaid', 'partially'];

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-sm">
      <h2 className="text-lg font-semibold text-purple-800 mb-4">Invoices</h2>
      {statusOrder.map((status) => {
        const percent = Math.round(statusPercentages[status]);
        return (
          <div key={status} className="mb-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="capitalize">{status}</span>
              <span>{percent} %</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percent, 100)}%`}}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvoiceStatusProgress;