import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit, Trash2, Check, X, Plus, Search, RefreshCw, User, Mail, Briefcase, Calendar, DollarSign, Eye, Building2, Phone, MapPin, Globe, ShoppingCart, Download } from "lucide-react";
import { customersAPI } from "@/lib/api";

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    companyId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

const LightGlassCard = ({ children, className = "", gradient = false }: { children: React.ReactNode, className?: string, gradient?: boolean }) => (
    <div className={`backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg ${gradient ? 'bg-gradient-to-br from-white/90 to-gray-50/80' : ''} ${className}`}>
        {children}
    </div>
);

const CustomerForm: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        companyId: "",
        isActive: true
    });

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [editForm, setEditForm] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load customers on component mount
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await customersAPI.getCustomers();
            setCustomers(response);
        } catch (err: any) {
            console.error('Error loading customers:', err);
            setError('Failed to load customers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (data: any): ValidationErrors => {
        const newErrors: ValidationErrors = {};
        if (!data.firstName?.trim()) newErrors.firstName = "First name is required";
        if (!data.lastName?.trim()) newErrors.lastName = "Last name is required";
        if (!data.email?.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Invalid email format";
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        if (editForm) {
            setEditForm({
                ...editForm,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleAddCustomer = async () => {
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await customersAPI.createCustomer(formData);
            await loadCustomers(); // Reload the list
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                state: "",
                country: "",
                postalCode: "",
                companyId: "",
                isActive: true
            });
            setErrors({});
            setShowAddModal(false);
        } catch (err: any) {
            console.error('Error creating customer:', err);
            setError('Failed to create customer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setEditForm({ ...customer });
    };

    const handleSaveEdit = async () => {
        if (!editForm || !editingCustomer) return;

        const validationErrors = validateForm(editForm);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await customersAPI.updateCustomer(editingCustomer.id, editForm);
            await loadCustomers(); // Reload the list
            setEditingCustomer(null);
            setEditForm(null);
            setErrors({});
        } catch (err: any) {
            console.error('Error updating customer:', err);
            setError('Failed to update customer. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const confirmDelete = confirm("Are you sure you want to delete this customer?");
        if (confirmDelete) {
            setLoading(true);
            try {
                await customersAPI.deleteCustomer(id);
                await loadCustomers(); // Reload the list
                if (editingCustomer?.id === id) {
                    setEditingCustomer(null);
                    setEditForm(null);
                }
            } catch (err: any) {
                console.error('Error deleting customer:', err);
                setError('Failed to delete customer. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStatusToggle = async (customer: Customer, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        setLoading(true);
        try {
            await customersAPI.updateCustomer(customer.id, {
                ...customer,
                isActive: !customer.isActive
            });
            await loadCustomers(); // Reload the list
        } catch (err: any) {
            console.error('Error updating customer status:', err);
            setError('Failed to update customer status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (customer: Customer, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const customerInfo = `👤 Customer Details:\n\n` +
            `Name: ${customer.firstName} ${customer.lastName}\n` +
            `Email: ${customer.email}\n` +
            `Phone: ${customer.phone || 'N/A'}\n` +
            `Address: ${customer.address || 'N/A'}\n` +
            `City: ${customer.city || 'N/A'}\n` +
            `State: ${customer.state || 'N/A'}\n` +
            `Country: ${customer.country || 'N/A'}\n` +
            `Postal Code: ${customer.postalCode || 'N/A'}\n` +
            `Status: ${customer.isActive ? 'Active' : 'Inactive'}\n` +
            `Created: ${new Date(customer.createdAt).toLocaleDateString()}`;

        alert(customerInfo);
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive
            ? 'text-green-700 bg-green-100 border border-green-200 hover:bg-green-200'
            : 'text-red-700 bg-red-100 border border-red-200 hover:bg-red-200';
    };

    const filteredCustomers = customers.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && customers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline">{error}</span>
                    <button
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setError(null)}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                    Customer Management
                </h2>
                <div className="flex space-x-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={loadCustomers}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center font-medium shadow-lg whitespace-nowrap disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center font-medium shadow-lg whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Customer Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredCustomers.map((customer) => (
                    <LightGlassCard key={customer.id} className="p-4 sm:p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 group relative overflow-hidden" gradient>
                        <div className="relative z-10">
                            {/* Customer Header */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
                                        {customer.firstName[0]}{customer.lastName[0]}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm ${customer.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-800 font-bold text-base sm:text-lg truncate">{customer.firstName} {customer.lastName}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm truncate">{customer.email}</p>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="space-y-2 sm:space-y-3 mb-4">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-700 text-xs sm:text-sm truncate flex-1" title={customer.email}>
                                        {customer.email}
                                    </span>
                                </div>

                                {customer.phone && (
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-xs sm:text-sm truncate flex-1">
                                            {customer.phone}
                                        </span>
                                    </div>
                                )}

                                {customer.address && (
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-xs sm:text-sm truncate flex-1" title={customer.address}>
                                            {customer.address}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-600 text-xs sm:text-sm">Created:</span>
                                    </div>
                                    <span className="text-gray-700 text-xs sm:text-sm">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-xs sm:text-sm">Status:</span>
                                    <button
                                        onClick={(e) => handleStatusToggle(customer, e)}
                                        disabled={loading}
                                        className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer disabled:opacity-50 ${getStatusColor(customer.isActive)}`}
                                        title="Click to toggle status"
                                    >
                                        {customer.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center space-x-2">
                                <button
                                    onClick={(e) => handleView(customer, e)}
                                    className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-medium"
                                    title="View Details"
                                >
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    View
                                </button>
                                <button
                                    onClick={() => handleEdit(customer)}
                                    className="flex-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-medium"
                                    title="Edit Customer"
                                >
                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => handleDelete(customer.id, e)}
                                    disabled={loading}
                                    className="flex-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-medium disabled:opacity-50"
                                    title="Delete Customer"
                                >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </LightGlassCard>
                ))}
            </div>

            {/* Add Customer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <LightGlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Add New Customer</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter first name"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter last name"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter state"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter country"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter postal code"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active Customer</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddCustomer}
                                    disabled={loading}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center disabled:opacity-50"
                                >
                                    {loading ? (
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Customer
                                </button>
                            </div>
                        </div>
                    </LightGlassCard>
                </div>
            )}

            {/* Edit Customer Modal */}
            {editingCustomer && editForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <LightGlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Edit Customer</h3>
                                <button
                                    onClick={() => {
                                        setEditingCustomer(null);
                                        setEditForm(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editForm.firstName}
                                        onChange={handleEditChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter first name"
                                    />
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editForm.lastName}
                                        onChange={handleEditChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter last name"
                                    />
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editForm.phone || ''}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={editForm.address || ''}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={editForm.city || ''}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={editForm.state || ''}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter state"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={editForm.country || ''}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter country"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={editForm.postalCode || ''}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter postal code"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={editForm.isActive}
                                            onChange={handleEditChange}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active Customer</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setEditingCustomer(null);
                                        setEditForm(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={loading}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center disabled:opacity-50"
                                >
                                    {loading ? (
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Update Customer
                                </button>
                            </div>
                        </div>
                    </LightGlassCard>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{customers.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Customers</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{customers.filter(c => c.isActive).length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Active</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">0</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">$0</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Revenue</div>
                </LightGlassCard>
            </div>
        </div>
    );
};

export default CustomerForm;

