import React from 'react';

const QuoteStatusProgress: React.FC = () => {
  const totalQuotes = 100;

  const quoteStatuses = [
    'draft', 'pending', 'sent', 'accepted', 'declined',
    'draft', 'pending', 'sent', 'expired', 'accepted'
  ];

  const statusCounts: Record<string, number> = {
    draft: 0,
    pending: 0,
    sent: 0,
    accepted: 0,
    declined: 0,
    expired: 0,
  };

  quoteStatuses.forEach(status => {
    const lowerStatus = status.toLowerCase();
    if (statusCounts.hasOwnProperty(lowerStatus)) {
      statusCounts[lowerStatus]++;
    }
  });

  const statusPercentages: Record<string, number> = {};
  for (const status in statusCounts) {
    statusPercentages[status] = (statusCounts[status] / totalQuotes) * 100;
  }

  const statusOrder = ['draft', 'pending', 'sent', 'accepted', 'declined', 'expired'];

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-sm">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Quotes</h2>
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
                className="bg-blue-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuoteStatusProgress;