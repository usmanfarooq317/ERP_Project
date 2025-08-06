import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit, Trash2, Check, X, Plus, Search, RefreshCw, Download, Grid2x2Plus } from "lucide-react";

interface Order {
    number: string;
    customer: string;
    product: string;
    quantity: number;
    price: number;
    discount: number;
    total: number;
    status: string;
    phone: string;
    state: string;
    city: string;
    note: string;
}

interface ValidationErrors {
    number?: string;
    customer?: string;
    product?: string;
    quantity?: string;
    price?: string;
    discount?: string;
    total?: string;
    status?: string;
    phone?: string;
    state?: string;
    city?: string;
    note?: string;
}

const OrdersForm: React.FC = () => {
    const [formData, setFormData] = useState<Order>({
        number: '',
        customer: '',
        product: '',
        quantity: 1,
        price: 0,
        discount: 0,
        total: 0,
        status: 'Pending',
        phone: '',
        state: '',
        city: '',
        note: '',
    });

    const [orders, setOrders] = useState<Order[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Order>({
        number: '',
        customer: '',
        product: '',
        quantity: 1,
        price: 0,
        discount: 0,
        total: 0,
        status: 'Pending',
        phone: '',
        state: '',
        city: '',
        note: '',
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [editErrors, setEditErrors] = useState<ValidationErrors>({});
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const validateForm = (data: Order): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        // Order Number validation
        if (!data.number.trim()) {
            newErrors.number = 'Order number is required';
        }

        // Customer validation
        if (!data.customer.trim()) {
            newErrors.customer = 'Customer is required';
        }

        // Product validation
        if (!data.product.trim()) {
            newErrors.product = 'Product is required';
        }

        // Quantity validation
        if (data.quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        // Price validation
        if (data.price < 0) {
            newErrors.price = 'Price cannot be negative';
        }

        // Calculate total if quantity and price are valid
        if (!newErrors.quantity && !newErrors.price) {
            data.total = data.quantity * data.price * (1 - (data.discount / 100));
        }

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'quantity' || name === 'price' || name === 'discount'
            ? parseFloat(value) || 0
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue,
            total: calculateTotal({ ...prev, [name]: parsedValue })
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const calculateTotal = (data: Order): number => {
        return data.quantity * data.price * (1 - (data.discount / 100));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Add the order to the list
        setOrders(prev => [...prev, { ...formData }]);

        // Reset form and close modal
        setFormData({
            number: '',
            customer: '',
            product: '',
            quantity: 1,
            price: 0,
            discount: 0,
            total: 0,
            status: 'Pending',
            phone: '',
            state: '',
            city: '',
            note: '',
        });
        setErrors({});
        setShowForm(false);
    };

    const handleAddOrder = () => {
        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Add the order to the list
        setOrders(prev => [...prev, { ...formData }]);

        // Reset form and close modal
        setFormData({
            number: '',
            customer: '',
            product: '',
            quantity: 1,
            price: 0,
            discount: 0,
            total: 0,
            status: 'Pending',
            phone: '',
            state: '',
            city: '',
            note: '',
        });
        setErrors({});
        setShowForm(false);
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditingData(orders[index]);
    };

    const handleSaveEdit = () => {
        if (editingIndex !== null) {
            const validationErrors = validateForm(editingData);

            if (Object.keys(validationErrors).length > 0) {
                setEditErrors(validationErrors);
                return;
            }

            const updatedOrders = [...orders];
            updatedOrders[editingIndex] = editingData;
            setOrders(updatedOrders);
            setEditingIndex(null);
            setEditingData({
                number: '',
                customer: '',
                product: '',
                quantity: 1,
                price: 0,
                discount: 0,
                total: 0,
                status: 'Pending',
                phone: '',
                state: '',
                city: '',
                note: '',
            });
            setEditErrors({});
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditingData({
            number: '',
            customer: '',
            product: '',
            quantity: 1,
            price: 0,
            discount: 0,
            total: 0,
            status: 'Pending',
            phone: '',
            state: '',
            city: '',
            note: '',
        });
        setEditErrors({});
    };

    const handleDelete = (index: number) => {
        const updatedOrders = orders.filter((_, i) => i !== index);
        setOrders(updatedOrders);
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditingData({
                number: '',
                customer: '',
                product: '',
                quantity: 1,
                price: 0,
                discount: 0,
                total: 0,
                status: 'Pending',
                phone: '',
                state: '',
                city: '',
                note: '',
            });
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'quantity' || name === 'price' || name === 'discount'
            ? parseFloat(value) || 0
            : value;

        setEditingData(prev => ({
            ...prev,
            [name]: parsedValue,
            total: calculateTotal({ ...prev, [name]: parsedValue })
        }));

        // Clear error for this field when user starts typing
        if (editErrors[name as keyof ValidationErrors]) {
            setEditErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setFormData({
            number: '',
            customer: '',
            product: '',
            quantity: 1,
            price: 0,
            discount: 0,
            total: 0,
            status: 'Pending',
            phone: '',
            state: '',
            city: '',
            note: '',
        });
        setErrors({});
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleRefresh = () => {
        // In a real app, this would refresh data from the server
        setSearchTerm('');
    };

    const filteredOrders = orders.filter(order =>
        order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleDownloadPDF = () => {
        // This would be replaced with actual PDF generation logic
        alert("PDF download functionality would be implemented here");
    };


    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Add New Order Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <CardTitle>Add New Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Order Number</label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="ORD-001"
                                        />
                                        {errors.number && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.number}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Customer</label>
                                        <select
                                            name="customer"
                                            value={formData.customer}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.customer ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select Customer</option>
                                            <option value="Acme Corp">Acme Corp</option>
                                            <option value="TechStart Inc">TechStart Inc</option>
                                            <option value="Global Solutions">Global Solutions</option>
                                        </select>
                                        {errors.customer && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.customer}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Product</label>
                                        <select
                                            name="product"
                                            value={formData.product}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.product ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select Product</option>
                                            <option value="Product A">Product A</option>
                                            <option value="Product B">Product B</option>
                                            <option value="Product C">Product C</option>
                                        </select>
                                        {errors.product && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.product}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="1"
                                            min="1"
                                        />
                                        {errors.quantity && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.quantity}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                        {errors.price && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.price}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Discount (%)</label>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.discount ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                }`}
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                        />
                                        {errors.discount && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.discount}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Total</label>
                                        <input
                                            type="number"
                                            name="total"
                                            value={formData.total.toFixed(2)}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="City"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Order Notes</label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Special instructions..."
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelForm}
                                        className="px-6 py-2 min-w-[100px]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleAddOrder}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[140px] flex items-center justify-center"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Add Order
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Order Table */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
                    <h1 className="text-xl sm:text-2xl font-bold">Order List</h1>
                    <div className="flex space-x-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={handleSearch}
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
                        <Button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[160px] justify-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Order
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Number</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Name</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Product</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Quantity</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Price</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Discount</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Total</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Status</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Phone</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">State</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">City</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Note</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={13} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Grid2x2Plus className="h-12 w-12 mb-2 text-gray-400" />
                                                <p className="text-lg font-medium mb-1">No orders yet</p>
                                                <p className="text-sm">Click "Add New Order" to get started</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="number"
                                                            value={editingData.number}
                                                            onChange={handleEditChange}
                                                            className={`w-full px-2 py-1 text-xs sm:text-sm border rounded bg-background text-foreground ${editErrors.number ? 'border-red-500' : 'border-border'
                                                                }`}
                                                        />
                                                        {editErrors.number && (
                                                            <p className="text-red-500 text-xs mt-1">{editErrors.number}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="font-medium text-gray-900">{order.number}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="customer"
                                                            value={editingData.customer}
                                                            onChange={handleEditChange}
                                                            className={`w-full px-2 py-1 text-xs sm:text-sm border rounded bg-background text-foreground ${editErrors.customer ? 'border-red-500' : 'border-border'
                                                                }`}
                                                        />
                                                        {editErrors.customer && (
                                                            <p className="text-red-500 text-xs mt-1">{editErrors.customer}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-700">{order.customer}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="product"
                                                            value={editingData.product}
                                                            onChange={handleEditChange}
                                                            className={`w-full px-2 py-1 text-xs sm:text-sm border rounded bg-background text-foreground ${editErrors.product ? 'border-red-500' : 'border-border'
                                                                }`}
                                                        />
                                                        {editErrors.product && (
                                                            <p className="text-red-500 text-xs mt-1">{editErrors.product}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-700">{order.product}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <div>
                                                        <input
                                                            type="number"
                                                            name="quantity"
                                                            value={editingData.quantity}
                                                            onChange={handleEditChange}
                                                            className={`w-full px-2 py-1 text-xs sm:text-sm border rounded bg-background text-foreground ${editErrors.quantity ? 'border-red-500' : 'border-border'
                                                                }`}
                                                            min="1"
                                                        />
                                                        {editErrors.quantity && (
                                                            <p className="text-red-500 text-xs mt-1">{editErrors.quantity}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-700">{order.quantity}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <div>
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            value={editingData.price}
                                                            onChange={handleEditChange}
                                                            className={`w-full px-2 py-1 text-xs sm:text-sm border rounded bg-background text-foreground ${editErrors.price ? 'border-red-500' : 'border-border'
                                                                }`}
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                        {editErrors.price && (
                                                            <p className="text-red-500 text-xs mt-1">{editErrors.price}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-700">${order.price.toFixed(2)}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <div>
                                                        <input
                                                            type="number"
                                                            name="discount"
                                                            value={editingData.discount}
                                                            onChange={handleEditChange}
                                                            className={`w-full px-2 py-1 text-xs sm:text-sm border rounded bg-background text-foreground ${editErrors.discount ? 'border-red-500' : 'border-border'
                                                                }`}
                                                            min="0"
                                                            max="100"
                                                        />
                                                        {editErrors.discount && (
                                                            <p className="text-red-500 text-xs mt-1">{editErrors.discount}</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-700">{order.discount}%</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <select
                                                        name="status"
                                                        value={editingData.status}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1 text-xs sm:text-sm border border-border rounded bg-background text-foreground"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={editingData.phone}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1 text-xs sm:text-sm border border-border rounded bg-background text-foreground"
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">{order.phone}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={editingData.state}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1 text-xs sm:text-sm border border-border rounded bg-background text-foreground"
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">{order.state}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={editingData.city}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1 text-xs sm:text-sm border border-border rounded bg-background text-foreground"
                                                    />
                                                ) : (
                                                    <span className="text-gray-700">{order.city}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {editingIndex === index ? (
                                                    <textarea
                                                        name="note"
                                                        value={editingData.note}
                                                        onChange={handleEditChange}
                                                        className="w-full px-2 py-1 text-xs sm:text-sm border border-border rounded bg-background text-foreground"
                                                        rows={2}
                                                    />
                                                ) : (
                                                    <span className="text-gray-700 truncate block max-w-xs">{order.note}</span>
                                                )}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                                                    {editingIndex === index ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={handleSaveEdit}
                                                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                                                            >
                                                                <Check className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={handleCancelEdit}
                                                                className="text-xs px-2 py-1"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
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
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
        </div>
    );
};

export default OrdersForm;