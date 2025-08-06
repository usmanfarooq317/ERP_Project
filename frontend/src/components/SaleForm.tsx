'use client';

import { useState } from 'react';
import { Save, Calendar, Plus, Trash2, Pencil, Search, Download, Check, X, RefreshCw, Grid2x2Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SaleForm = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    customer: '',
    date: '',
    product: '',
    quantity: '',
    price: '',
    discount: '',
    customDiscount: '',
    paymentMethod: '',
    notes: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      customer: '',
      date: '',
      product: '',
      quantity: '',
      price: '',
      discount: '',
      customDiscount: '',
      paymentMethod: '',
      notes: '',
    });
    setEditingId(null);
  };

  const handleAddOrUpdateSale = (e) => {
    e.preventDefault();

    const totalAmount =
      parseFloat(formData.price || '0') * parseInt(formData.quantity || '0') -
      parseFloat(formData.customDiscount || '0');

    const saleData = {
      id: editingId || sales.length + 1,
      customer: formData.customer,
      date: formData.date,
      product: formData.product,
      quantity: formData.quantity,
      price: formData.price,
      amount: `$${totalAmount.toFixed(2)}`,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    };

    if (editingId) {
      setSales(sales.map(sale => sale.id === editingId ? saleData : sale));
    } else {
      setSales([...sales, saleData]);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (id) => {
    const saleToEdit = sales.find(sale => sale.id === id);
    if (saleToEdit) {
      setFormData({
        customer: saleToEdit.customer,
        date: saleToEdit.date,
        product: saleToEdit.product,
        quantity: saleToEdit.quantity,
        price: saleToEdit.price,
        discount: '',
        customDiscount: '',
        paymentMethod: saleToEdit.paymentMethod,
        notes: saleToEdit.notes
      });
      setEditingId(id);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (id) => {
    setSales(sales.filter(sale => sale.id !== id));
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = () => {
    // This would be replaced with actual PDF generation logic
    alert("PDF download functionality would be implemented here");
  };

  const handleRefresh = () => {
    // In a real app, this would refresh data from the server
    setSearchTerm('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Sales List Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold">Sales List</h1>
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
              onClick={handleRefresh}
              className="px-4 py-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[160px] justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Record New Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Sale' : 'Record New Sale'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddOrUpdateSale} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Customer</label>
                      <select
                        name="customer"
                        value={formData.customer}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      >
                        <option value="">Select Customer</option>
                        <option>Acme Corp</option>
                        <option>TechStart Inc</option>
                        <option>Global Solutions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Sale Date</label>
                      <div className="relative">
                        <input
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg"
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product</label>
                      <select
                        name="product"
                        value={formData.product}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      >
                        <option value="">Select Product</option>
                        <option>Product A</option>
                        <option>Product B</option>
                        <option>Product C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity</label>
                      <input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Unit Price</label>
                      <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discount</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option>No Discount</option>
                        <option>5% Off</option>
                        <option>10% Off</option>
                        <option>15% Off</option>
                      </select>
                      <input
                        name="customDiscount"
                        type="number"
                        value={formData.customDiscount}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Custom Amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option>Cash</option>
                      <option>Credit Card</option>
                      <option>Bank Transfer</option>
                      <option>Digital Wallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Additional sale notes..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? 'Update' : 'Record'} Sale
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Sale ID</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Customer</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Date</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Product</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Quantity</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Price</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Amount</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Payment Method</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Notes</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Grid2x2Plus className="h-12 w-12 mb-2 text-gray-400" />
                        <p className="text-lg font-medium mb-1">No sales yet</p>
                        <p className="text-sm">Click "Record New Sale" to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="font-medium text-gray-900">{sale.id}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{sale.customer}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{sale.date}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{sale.product}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{sale.quantity}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">${sale.price}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="font-medium text-gray-900">{sale.amount}</span>
                      </td>
                      
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{sale.paymentMethod}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700 truncate block max-w-xs">{sale.notes}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(sale.id)}
                            className="hover:bg-blue-50 text-xs px-2 py-1"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(sale.id)}
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
      </div>

      {/* Download PDF Button */}
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

export default SaleForm;