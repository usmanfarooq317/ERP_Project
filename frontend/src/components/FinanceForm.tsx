import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit, Trash2, Check, X, Plus, Download, Grid2x2Plus } from "lucide-react";

interface Transaction {
    id: string;
    type: string;
    category: string;
    description: string;
    amount: number;
    date: string;
    bank: string;
    checkNumber: string;
    vendor: string;
    status: string;
    isReceived: boolean;
}

interface ValidationErrors {
    type?: string;
    category?: string;
    description?: string;
    amount?: string;
    date?: string;
    bank?: string;
    checkNumber?: string;
    vendor?: string;
    status?: string;
}

const FinanceForm = () => {
    const [formData, setFormData] = useState({
        type: '',
        category: '',
        description: '',
        amount: '',
        date: '',
        bank: '',
        checkNumber: '',
        vendor: '',
        status: 'Pending',
        isReceived: false
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingData, setEditingData] = useState({
        type: '',
        category: '',
        description: '',
        amount: '',
        date: '',
        bank: '',
        checkNumber: '',
        vendor: '',
        status: 'Pending',
        isReceived: false
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [editErrors, setEditErrors] = useState<ValidationErrors>({});
    const [showForm, setShowForm] = useState(false);

    const handleDownloadPDF = () => {
        // This would be replaced with actual PDF generation logic
        alert("PDF download functionality would be implemented here");
    };

    const validateForm = (data: any): ValidationErrors => {
        const newErrors: ValidationErrors = {};

        if (!data.type) {
            newErrors.type = 'Transaction type is required';
        }

        if (!data.category) {
            newErrors.category = 'Category is required';
        }

        if (!data.description) {
            newErrors.description = 'Description is required';
        }

        if (!data.amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(Number(data.amount))) {
            newErrors.amount = 'Amount must be a number';
        }

        if (!data.date) {
            newErrors.date = 'Date is required';
        }

        if (!data.bank) {
            newErrors.bank = 'Bank is required';
        }

        if (!data.vendor) {
            newErrors.vendor = 'Vendor is required';
        }

        if (!data.status) {
            newErrors.status = 'Status is required';
        }

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newTransaction: Transaction = {
            id: `TRX-${Date.now()}`,
            type: formData.type,
            category: formData.category,
            description: formData.description,
            amount: Number(formData.amount),
            date: formData.date,
            bank: formData.bank,
            checkNumber: formData.checkNumber,
            vendor: formData.vendor,
            status: formData.status,
            isReceived: formData.isReceived
        };

        setTransactions(prev => [...prev, newTransaction]);
        setFormData({
            type: '',
            category: '',
            description: '',
            amount: '',
            date: '',
            bank: '',
            checkNumber: '',
            vendor: '',
            status: 'Pending',
            isReceived: false
        });
        setErrors({});
        setShowForm(false);
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditingData({
            type: transactions[index].type,
            category: transactions[index].category,
            description: transactions[index].description,
            amount: transactions[index].amount.toString(),
            date: transactions[index].date,
            bank: transactions[index].bank,
            checkNumber: transactions[index].checkNumber,
            vendor: transactions[index].vendor,
            status: transactions[index].status,
            isReceived: transactions[index].isReceived
        });
    };

    const handleSaveEdit = () => {
        if (editingIndex !== null) {
            const validationErrors = validateForm(editingData);

            if (Object.keys(validationErrors).length > 0) {
                setEditErrors(validationErrors);
                return;
            }

            const updatedTransactions = [...transactions];
            updatedTransactions[editingIndex] = {
                ...updatedTransactions[editingIndex],
                type: editingData.type,
                category: editingData.category,
                description: editingData.description,
                amount: Number(editingData.amount),
                date: editingData.date,
                bank: editingData.bank,
                checkNumber: editingData.checkNumber,
                vendor: editingData.vendor,
                status: editingData.status,
                isReceived: editingData.isReceived
            };

            setTransactions(updatedTransactions);
            setEditingIndex(null);
            setEditingData({
                type: '',
                category: '',
                description: '',
                amount: '',
                date: '',
                bank: '',
                checkNumber: '',
                vendor: '',
                status: 'Pending',
                isReceived: false
            });
            setEditErrors({});
        }
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditingData({
            type: '',
            category: '',
            description: '',
            amount: '',
            date: '',
            bank: '',
            checkNumber: '',
            vendor: '',
            status: 'Pending',
            isReceived: false
        });
        setEditErrors({});
    };

    const handleDelete = (index: number) => {
        const updatedTransactions = transactions.filter((_, i) => i !== index);
        setTransactions(updatedTransactions);
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditingData({
                type: '',
                category: '',
                description: '',
                amount: '',
                date: '',
                bank: '',
                checkNumber: '',
                vendor: '',
                status: 'Pending',
                isReceived: false
            });
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setEditingData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (editErrors[name as keyof ValidationErrors]) {
            setEditErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setFormData({
            type: '',
            category: '',
            description: '',
            amount: '',
            date: '',
            bank: '',
            checkNumber: '',
            vendor: '',
            status: 'Pending',
            isReceived: false
        });
        setErrors({});
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Static text field as shown in the image */}
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <h2 className="text-lg font-semibold mb-2">Opening balance = (balance)</h2>
                <div className="space-y-2">
                    <p className="text-sm text-gray-700">- Additional Information</p>
                    <div className="ml-4">
                        <p className="text-sm text-gray-700">Add New Transaction</p>
                    </div>
                </div>
            </div>

            {/* Add New Transaction Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <CardTitle>Add New Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Transaction Type</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.type ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Income">Income</option>
                                            <option value="Expense">Expense</option>
                                            <option value="Transfer">Transfer</option>
                                        </select>
                                        {errors.type && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.type}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                                        <input
                                            type="text"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="0.00"
                                        />
                                        {errors.amount && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.amount}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Bank</label>
                                        <input
                                            type="text"
                                            name="bank"
                                            value={formData.bank}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.bank ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="Bank Name"
                                        />
                                        {errors.bank && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.bank}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Check Number</label>
                                        <input
                                            type="text"
                                            name="checkNumber"
                                            value={formData.checkNumber}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                                            placeholder="Check #"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Vendor</label>
                                        <input
                                            type="text"
                                            name="vendor"
                                            value={formData.vendor}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.vendor ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                            placeholder="Vendor Name"
                                        />
                                        {errors.vendor && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.vendor}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Office Supplies">Office Supplies</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Travel">Travel</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Salaries">Salaries</option>
                                        </select>
                                        {errors.category && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.category}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        />
                                        {errors.date && (
                                            <p className="text-red-600 text-sm mt-1 font-medium">{errors.date}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isReceived"
                                        name="isReceived"
                                        checked={formData.isReceived}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isReceived" className="text-sm font-medium text-foreground">
                                        Received Payment
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        rows={3}
                                        placeholder="Transaction description..."
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1 font-medium">{errors.description}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelForm}
                                        className="min-w-[100px]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="min-w-[140px]"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Transaction
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Main Transactions Table */}
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
                    <h1 className="text-xl sm:text-2xl font-bold">Financial Transactions</h1>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="min-w-[160px]"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Transaction
                    </Button>
                </div>

                <div className="bg-white rounded-lg border border-border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Type</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Category</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Description</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Amount</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Date</th>
                                    <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <Grid2x2Plus className="h-12 w-12 mb-2 text-gray-400" />
                                                <p className="text-lg font-medium mb-1">No transactions yet</p>
                                                <p className="text-sm">Click "Add New Transaction" to get started</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((trx, index) => (
                                        <tr key={trx.id} className="hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                <span className={`font-medium ${trx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {trx.type}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {trx.category}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {trx.description}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                <span className={`font-medium ${trx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                                    ${trx.amount.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                {new Date(trx.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(index)}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(index)}
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

export default FinanceForm;