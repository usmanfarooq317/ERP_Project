import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Plus, RefreshCw, Edit, Trash2, Search, Download, Grid2x2Plus } from 'lucide-react';

interface QuotesItem {
  item: string;
  description: string;
  quantity: number;
  price: number;
}

interface QuotesData {
  number: string;
  client: string;
  date: string;
  expireDate: string;
  year: string;
  currency: string;
  status: 'draft' | 'pending' | 'unpaid' | 'overdue' | 'partially paid' | 'paid';
  paid: number;
  note: string;
  items: QuotesItem[];
  createdBy: string;
  tax?: number;
}

const Quotess = () => {
  const [Quotess, setQuotess] = useState<QuotesData[]>([]);
  const [newQuotes, setNewQuotes] = useState<QuotesData>({
    number: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    expireDate: '',
    year: new Date().getFullYear().toString(),
    currency: 'PKR',
    status: 'draft',
    paid: 0,
    note: '',
    items: [{ item: '', description: '', quantity: 0, price: 0 }],
    createdBy: 'Admin',
    tax: 0
  });
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleQuotess, setVisibleQuotess] = useState(10);

  const handleScroll = () => {
    const table = document.querySelector('.Quotes-table-container');
    if (table) {
      const { scrollTop, scrollHeight, clientHeight } = table;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setVisibleQuotess(prev => prev + 10);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewQuotes({ ...newQuotes, [name]: name === 'paid' || name === 'tax' ? parseFloat(value) : value });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItems = [...newQuotes.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [e.target.name]: e.target.name === 'quantity' || e.target.name === 'price'
        ? parseFloat(e.target.value)
        : e.target.value
    };
    setNewQuotes({ ...newQuotes, items: updatedItems });
  };

  const addItem = () => {
    setNewQuotes({
      ...newQuotes,
      items: [...newQuotes.items, { item: '', description: '', quantity: 0, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = newQuotes.items.filter((_, i) => i !== index);
    setNewQuotes({ ...newQuotes, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return newQuotes.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  function calculateTotal(Quotes?: QuotesData) {
    const targetQuotes = Quotes || newQuotes;
    const subtotal = targetQuotes.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = targetQuotes.tax ? subtotal * (targetQuotes.tax / 100) : 0;
    return subtotal + taxAmount;
  }

  const handleSave = () => {
    const total = calculateTotal();
    setQuotess([...Quotess, {
      ...newQuotes,
      status: newQuotes.paid >= total ? 'paid' :
        newQuotes.paid > 0 ? 'partially paid' :
          newQuotes.status
    }]);
    setNewQuotes({
      number: '',
      client: '',
      date: new Date().toISOString().split('T')[0],
      expireDate: '',
      year: new Date().getFullYear().toString(),
      currency: 'PKR',
      status: 'draft',
      paid: 0,
      note: '',
      items: [{ item: '', description: '', quantity: 0, price: 0 }],
      createdBy: 'Admin',
      tax: 0
    });
    setOpen(false);
  };

  const handleEdit = (index: number) => {
    const QuotesToEdit = Quotess[index];
    setNewQuotes(QuotesToEdit);
    setOpen(true);
    setQuotess(Quotess.filter((_, i) => i !== index));
  };

  const handleDelete = (index: number) => {
    setQuotess(Quotess.filter((_, i) => i !== index));
  };

  const refreshQuotess = () => {
    console.log('Refreshing Quotess...');
  };

  const filteredQuotess = Quotess
    .filter(Quotes =>
      Quotes.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Quotes.number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, visibleQuotess);

  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold">Quotes List</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button
            variant="outline"
            onClick={refreshQuotess}
            className="px-4 py-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[160px] justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Quotes
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Quotes</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <input
                      name="client"
                      value={newQuotes.client}
                      onChange={handleChange}
                      type="text"
                      placeholder="Client"
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                    <input
                      name="date"
                      value={newQuotes.date}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Number</label>
                    <input
                      name="number"
                      value={newQuotes.number}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="INV-001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Year</label>
                    <input
                      name="year"
                      value={newQuotes.year}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
                    <select
                      name="currency"
                      value={newQuotes.currency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="PKR">Rs (Pakistan Rupee)</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                    <select
                      name="status"
                      value={newQuotes.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Expire Date</label>
                    <input
                      name="expireDate"
                      value={newQuotes.expireDate}
                      onChange={handleChange}
                      type="date"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Note</label>
                    <input
                      name="note"
                      value={newQuotes.note}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Item Description</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  <div className="grid grid-cols-12 gap-2 font-medium text-sm">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-3">Quantity</div>
                    <div className="col-span-3">Price</div>
                    <div className="col-span-1"></div>
                  </div>

                  {newQuotes.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          name="item"
                          value={item.item}
                          onChange={(e) => handleItemChange(index, e)}
                          type="text"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Item Name"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          name="quantity"
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(index, e)}
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          name="price"
                          value={item.price || ''}
                          onChange={(e) => handleItemChange(index, e)}
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={newQuotes.items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Paid Amount</label>
                    <input
                      name="paid"
                      value={newQuotes.paid || ''}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tax (%)</label>
                    <input
                      name="tax"
                      value={newQuotes.tax || ''}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="w-full md:w-1/3 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Sub Total:</span>
                      <span>{newQuotes.currency} {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tax:</span>
                      <span>{newQuotes.currency} {(calculateSubtotal() * (newQuotes.tax || 0) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{newQuotes.currency} {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="overflow-x-auto Quotes-table-container" onScroll={handleScroll}>
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Number</th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Client</th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Date</th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Expired Date</th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Total</th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Paid</th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Status</th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Created By</th>
                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotess.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Grid2x2Plus className="h-12 w-12 mb-2 text-gray-400" />
                      <p className="text-lg font-medium mb-1">No Quotess yet</p>
                      <p className="text-sm">Click "Add New Quotes" to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuotess.map((Quotes, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="font-medium text-gray-900">{Quotes.number}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{Quotes.client}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{Quotes.date}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{Quotes.expireDate}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="font-medium text-gray-900">{Quotes.currency} {calculateTotal(Quotes).toFixed(2)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{Quotes.currency} {Quotes.paid.toFixed(2)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${Quotes.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : Quotes.status === 'draft'
                          ? 'bg-gray-100 text-gray-800'
                          : Quotes.status === 'pending'
                            ? 'bg-blue-100 text-blue-800'
                            : Quotes.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {Quotes.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{Quotes.createdBy}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(index)}
                          className="hover:bg-blue-50 text-xs px-2 py-1"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(index)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs px-2 py-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleDownloadPDF}
          className="mt-4"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default Quotess;