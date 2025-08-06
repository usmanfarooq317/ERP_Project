import { useState } from 'react';
import { CreditCard, Search, RefreshCw, Plus, X, Save, Download, Edit, Trash2, Check, Grid2x2Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Payment {
    id: string;
    receiptNumber: string;
    client: string;
    amount: number;
    date: string;
    number: string;
    transactionDate: string;
    paymentMode: string;
    paymentTransaction: string;
}

interface ValidationErrors {
    receiptNumber?: string;
    client?: string;
    amount?: string;
    date?: string;
    number?: string;
    transactionDate?: string;
    paymentMode?: string;
    paymentTransaction?: string;
}

const PaymentsForm = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editErrors, setEditErrors] = useState<ValidationErrors>({});

    const handleDownloadPDF = () => {
        alert("PDF download functionality would be implemented here");
    };

    const handleAddPayment = (payment: Payment) => {
        if (editingPayment) {
            setPayments(payments.map(p => p.id === payment.id ? payment : p));
            setEditingPayment(null);
        } else {
            setPayments([...payments, { ...payment, id: Date.now().toString() }]);
        }
        setIsDialogOpen(false);
    };

    const handleEdit = (payment: Payment) => {
        setEditingPayment(payment);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setPayments(payments.filter(payment => payment.id !== id));
    };

    const filteredPayments = payments.filter(payment =>
        payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentMode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header with Search, Refresh and Add Payment */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
                <h1 className="text-xl sm:text-2xl font-bold">Payment List</h1>
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
                        onClick={() => setSearchTerm('')}
                        className="px-4 py-2"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => {
                            setEditingPayment(null);
                            setIsDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[160px] justify-center"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Payment
                    </Button>
                </div>
            </div>

            {/* Payment Table */}
            <div className="bg-white rounded-lg border border-border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Receipt Number</th>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Client</th>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Amount</th>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Date</th>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Number</th>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Transaction Date</th>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Payment Mode</th>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Payment Transaction</th>
                                <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Grid2x2Plus className="h-12 w-12 mb-2 text-gray-400" />
                                            <p className="text-lg font-medium mb-1">No payments yet</p>
                                            <p className="text-sm">Click "Add New Payment" to get started</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <span className="font-medium text-gray-900">{payment.receiptNumber}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <span className="text-gray-700">{payment.client}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <span className="text-gray-700">${payment.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <span className="text-gray-700">{payment.date}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <span className="text-gray-700">{payment.number}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <span className="text-gray-700">{payment.transactionDate}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <span className="text-gray-700">{payment.paymentMode}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <span className="text-gray-700">{payment.paymentTransaction}</span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                                            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(payment)}
                                                    className="hover:bg-blue-50 text-xs px-2 py-1"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(payment.id)}
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

            {/* Add/Edit Payment Form Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPayment ? 'Edit Payment' : 'Create New Payment'}
                        </DialogTitle>
                    </DialogHeader>
                    <PaymentForm
                        onClose={() => setIsDialogOpen(false)}
                        onSubmit={handleAddPayment}
                        payment={editingPayment}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

interface PaymentFormProps {
    onClose: () => void;
    onSubmit: (payment: Payment) => void;
    payment?: Payment | null;
}

const PaymentForm = ({ onClose, onSubmit, payment }: PaymentFormProps) => {
    const [paymentData, setPaymentData] = useState<Omit<Payment, 'id'>>(payment || {
        receiptNumber: '',
        client: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        number: '',
        transactionDate: new Date().toISOString().split('T')[0],
        paymentMode: 'cash',
        paymentTransaction: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...paymentData,
            id: payment?.id || Date.now().toString()
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="receiptNumber">Receipt Number</Label>
                    <Input
                        id="receiptNumber"
                        name="receiptNumber"
                        value={paymentData.receiptNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Input
                        id="client"
                        name="client"
                        value={paymentData.client}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={paymentData.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        name="date"
                        type="date"
                        value={paymentData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="number">Number</Label>
                    <Input
                        id="number"
                        name="number"
                        value={paymentData.number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="transactionDate">Transaction Date</Label>
                    <Input
                        id="transactionDate"
                        name="transactionDate"
                        type="date"
                        value={paymentData.transactionDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Select
                        value={paymentData.paymentMode}
                        onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMode: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                            <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentTransaction">Payment Transaction</Label>
                    <Input
                        id="paymentTransaction"
                        name="paymentTransaction"
                        value={paymentData.paymentTransaction}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
                <Button type="submit">
                    {payment ? (
                        <>
                            <Check className="h-4 w-4 mr-2" />
                            Update Payment
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Payment
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default PaymentsForm;