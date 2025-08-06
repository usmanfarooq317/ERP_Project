import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Plus, RefreshCw, Edit, Trash2, Search, Download, Grid2x2Plus } from 'lucide-react';

interface InvoiceItem {
  item: string;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  id?: number; // Add id for existing invoices
  number: string;
  client: string;
  date: string;
  expireDate: string;
  year: number; // Changed to number to match backend
  currency: string;
  status: 'draft' | 'pending' | 'unpaid' | 'overdue' | 'partially paid' | 'paid';
  paid: number;
  note: string;
  items: InvoiceItem[];
  createdBy: string;
  tax?: number;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [newInvoice, setNewInvoice] = useState<InvoiceData>({
    number: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    expireDate: '',
    year: new Date().getFullYear(), // Use number
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
  const [visibleInvoices, setVisibleInvoices] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null); // To track which invoice is being edited

  // Load invoices on component mount and when refreshInvoices is called
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoiceAPI.getInvoices();
      setInvoices(response.data);
    } catch (err) {
      console.error('Error loading invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const table = document.querySelector('.invoice-table-container');
    if (table) {
      const { scrollTop, scrollHeight, clientHeight } = table;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setVisibleInvoices(prev => prev + 10);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: name === 'paid' || name === 'tax' || name === 'year' ? parseFloat(value) : value });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [e.target.name]: e.target.name === 'quantity' || e.target.name === 'price'
        ? parseFloat(e.target.value)
        : e.target.value
    };
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const addItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { item: '', description: '', quantity: 0, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = newInvoice.items.filter((_, i) => i !== index);
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  function calculateTotal(invoice?: InvoiceData) {
    const targetInvoice = invoice || newInvoice;
    const subtotal = targetInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxAmount = targetInvoice.tax ? subtotal * (targetInvoice.tax / 100) : 0;
    return subtotal + taxAmount;
  }

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const total = calculateTotal();
      const finalStatus = newInvoice.paid >= total ? 'paid' :
        newInvoice.paid > 0 ? 'partially paid' :
          newInvoice.status;

      const invoiceToSave = {
        ...newInvoice,
        status: finalStatus,
        year: parseInt(newInvoice.year.toString()), // Ensure year is number
        paid: parseFloat(newInvoice.paid.toString()), // Ensure paid is number
        tax: newInvoice.tax ? parseFloat(newInvoice.tax.toString()) : 0, // Ensure tax is number
        items: newInvoice.items.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity.toString()),
          price: parseFloat(item.price.toString())
        }))
      };

      if (editingId) {
        await invoiceAPI.updateInvoice(editingId, invoiceToSave);
      } else {
        await invoiceAPI.createInvoice(invoiceToSave);
      }
      
      await loadInvoices(); // Refresh the list
      setOpen(false);
      setEditingId(null);
      setNewInvoice({
        number: '',
        client: '',
        date: new Date().toISOString().split('T')[0],
        expireDate: '',
        year: new Date().getFullYear(),
        currency: 'PKR',
        status: 'draft',
        paid: 0,
        note: '',
        items: [{ item: '', description: '', quantity: 0, price: 0 }],
        createdBy: 'Admin',
        tax: 0
      });
    } catch (err) {
      console.error('Error saving invoice:', err);
      setError('Failed to save invoice. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await invoiceAPI.getInvoice(id);
      // Transform data from backend to match frontend InvoiceData structure
      const invoiceData = {
        ...response.data,
        year: parseInt(response.data.year), // Ensure year is number
        paid: parseFloat(response.data.paid), // Ensure paid is number
        tax: parseFloat(response.data.tax), // Ensure tax is number
        items: response.data.items.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price)
        }))
      };
      setNewInvoice(invoiceData);
      setEditingId(id);
      setOpen(true);
    } catch (err) {
      console.error('Error fetching invoice for edit:', err);
      setError('Failed to load invoice for editing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setLoading(true);
      setError(null);
      try {
        await invoiceAPI.deleteInvoice(id);
        await loadInvoices(); // Refresh the list
      } catch (err) {
        console.error('Error deleting invoice:', err);
        setError('Failed to delete invoice. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const refreshInvoices = () => {
    console.log('Refreshing invoices...');
    loadInvoices(); // Call loadInvoices to fetch fresh data
  };

  const filteredInvoices = invoices
    .filter(invoice =>
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, visibleInvoices);

  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold">Invoice List</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button
            variant="outline"
            onClick={refreshInvoices}
            className="px-4 py-2"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[160px] justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Invoice' : 'New Invoice'}</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <input
                      name="client"
                      value={newInvoice.client}
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
                      value={newInvoice.date}
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
                      value={newInvoice.number}
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
                      value={newInvoice.year}
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
                      value={newInvoice.currency}
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
                      value={newInvoice.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="overdue">Overdue</option>
                      <option value="partially paid">Partially Paid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Expire Date</label>
                    <input
                      name="expireDate"
                      value={newInvoice.expireDate}
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
                      value={newInvoice.note}
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
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          name="item"
                          value={item.item}
                          onChange={e => handleItemChange(index, e)}
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
                          onChange={e => handleItemChange(index, e)}
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
                          onChange={e => handleItemChange(index, e)}
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
                          disabled={newInvoice.items.length === 1}
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
                      value={newInvoice.paid || ''}
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
                      value={newInvoice.tax || ''}
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
                      <span>{newInvoice.currency}
                        {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tax:</span>
                      <span>{newInvoice.currency} {(calculateSubtotal() *
                        (newInvoice.tax || 0) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{newInvoice.currency}
                        {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-border shadow-sm">
        <div className="overflow-x-auto invoice-table-container" onScroll={handleScroll}>
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
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Grid2x2Plus className="h-12 w-12 mb-2 text-gray-400" />
                      <p className="text-lg font-medium mb-1">No invoices yet</p>
                      <p className="text-sm">Click "Add New Invoice" to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="font-medium text-gray-900">{invoice.number}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{invoice.client}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{invoice.date}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{invoice.expireDate}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{invoice.currency} {calculateTotal(invoice).toFixed(2)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{invoice.currency} {invoice.paid.toFixed(2)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'partially paid' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <span className="text-gray-700">{invoice.createdBy}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(invoice.id!)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(invoice.id!)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default Invoices;
