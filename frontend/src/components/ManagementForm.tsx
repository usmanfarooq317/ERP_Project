import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Edit, Trash2, Check, X, Plus, Search, RefreshCw, User, Mail, Briefcase, Calendar, DollarSign, Eye, Download } from "lucide-react";

interface Employee {
    id: number;
    name: string;
    employeeId: string;
    department: string;
    position: string;
    salary: number;
    hireDate: string;
    email: string;
    website: string;
    status: 'Active' | 'Inactive';
}

interface ValidationErrors {
    name?: string;
    employeeId?: string;
    department?: string;
    position?: string;
    salary?: string;
    hireDate?: string;
    email?: string;
    website?: string;
}

const LightGlassCard = ({ children, className = "", gradient = false }: { children: React.ReactNode, className?: string, gradient?: boolean }) => (
    <div className={`backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg ${gradient ? 'bg-gradient-to-br from-white/90 to-gray-50/80' : ''} ${className}`}>
        {children}
    </div>
);

const ManagementForm: React.FC = () => {
    const [formData, setFormData] = useState<Employee>({
        id: 0,
        name: "",
        employeeId: "",
        department: "",
        position: "",
        salary: 0,
        hireDate: "",
        email: "",
        website: "",
        status: 'Active'
    });

    const [employees, setEmployees] = useState<Employee[]>([
        {
            id: 1,
            name: "John Doe",
            employeeId: "EMP-001",
            department: "IT",
            position: "Developer",
            salary: 75000,
            hireDate: "2022-01-15",
            email: "john.doe@company.com",
            website: "https://john-doe.dev",
            status: 'Active'
        },
        {
            id: 2,
            name: "Jane Smith",
            employeeId: "EMP-002",
            department: "HR",
            position: "Manager",
            salary: 85000,
            hireDate: "2021-05-10",
            email: "jane.smith@company.com",
            website: "",
            status: 'Active'
        },
        {
            id: 3,
            name: "Mike Johnson",
            employeeId: "EMP-003",
            department: "Finance",
            position: "Analyst",
            salary: 65000,
            hireDate: "2023-02-20",
            email: "mike.johnson@company.com",
            website: "",
            status: 'Inactive'
        }
    ]);

    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [editForm, setEditForm] = useState<Employee | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateForm = (data: Employee): ValidationErrors => {
        const newErrors: ValidationErrors = {};
        if (!data.name.trim()) newErrors.name = "Name is required";
        if (!data.employeeId.trim()) newErrors.employeeId = "Employee ID is required";
        if (!data.department.trim()) newErrors.department = "Department is required";
        if (!data.position.trim()) newErrors.position = "Position is required";
        if (!data.salary || data.salary <= 0) newErrors.salary = "Enter valid salary";
        if (!data.hireDate) newErrors.hireDate = "Hire date is required";
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = "Invalid email format";
        if (data.website && !/^https?:\/\/.+\..+/.test(data.website)) newErrors.website = "Invalid website URL";
        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "salary" ? Number(value) : value
        }));

        if (errors[name as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (editForm) {
            setEditForm({
                ...editForm,
                [name]: name === "salary" ? Number(value) : value
            });
        }
    };

    const handleAddEmployee = () => {
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newEmployee = {
            ...formData,
            id: Math.max(...employees.map(e => e.id), 0) + 1
        };

        setEmployees([...employees, newEmployee]);
        setFormData({
            id: 0,
            name: "",
            employeeId: "",
            department: "",
            position: "",
            salary: 0,
            hireDate: "",
            email: "",
            website: "",
            status: 'Active'
        });
        setErrors({});
        setShowAddModal(false);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setEditForm({ ...employee });
    };

    const handleSaveEdit = () => {
        if (!editForm) return;

        const validationErrors = validateForm(editForm);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setEmployees(employees.map(emp =>
            emp.id === editForm.id ? editForm : emp
        ));
        setEditingEmployee(null);
        setEditForm(null);
        setErrors({});
    };

    const handleDelete = (id: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const confirmDelete = confirm("Are you sure you want to delete this employee?");
        if (confirmDelete) {
            setEmployees(employees.filter(emp => emp.id !== id));
            if (editingEmployee?.id === id) {
                setEditingEmployee(null);
                setEditForm(null);
            }
        }
    };

    const handleStatusToggle = (id: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        setEmployees(employees.map(emp =>
            emp.id === id
                ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' }
                : emp
        ));
    };

    const handleView = (employee: Employee, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const employeeInfo = `👤 Employee Details:\n\n` +
            `Name: ${employee.name}\n` +
            `Employee ID: ${employee.employeeId}\n` +
            `Department: ${employee.department}\n` +
            `Position: ${employee.position}\n` +
            `Salary: $${employee.salary.toLocaleString()}\n` +
            `Hire Date: ${employee.hireDate}\n` +
            `Email: ${employee.email}\n` +
            `Website: ${employee.website || 'N/A'}\n` +
            `Status: ${employee.status}`;

        alert(employeeInfo);
    };

    const getDepartmentColor = (department: string) => {
        switch (department.toLowerCase()) {
            case 'it':
                return 'text-purple-700 bg-purple-100 border border-purple-200 hover:bg-purple-200';
            case 'hr':
                return 'text-blue-700 bg-blue-100 border border-blue-200 hover:bg-blue-200';
            case 'finance':
                return 'text-green-700 bg-green-100 border border-green-200 hover:bg-green-200';
            case 'marketing':
                return 'text-pink-700 bg-pink-100 border border-pink-200 hover:bg-pink-200';
            case 'sales':
                return 'text-orange-700 bg-orange-100 border border-orange-200 hover:bg-orange-200';
            default:
                return 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Active'
            ? 'text-green-700 bg-green-100 border border-green-200 hover:bg-green-200'
            : 'text-red-700 bg-red-100 border border-red-200 hover:bg-red-200';
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownloadPDF = () => {
        // This would be replaced with actual PDF generation logic
        alert("PDF download functionality would be implemented here");
    };

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                    Employee Management
                </h2>
                <div className="flex space-x-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center font-medium shadow-lg whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredEmployees.map((employee) => (
                    <LightGlassCard key={employee.id} className="p-4 sm:p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 group relative overflow-hidden" gradient>
                        <div className="relative z-10">
                            {/* Employee Header */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
                                        {employee.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm ${employee.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-800 font-bold text-base sm:text-lg truncate">{employee.name}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm truncate">{employee.employeeId}</p>
                                </div>
                            </div>

                            {/* Employee Details */}
                            <div className="space-y-2 sm:space-y-3 mb-4">
                                <div className="flex items-center space-x-2">
                                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-700 text-xs sm:text-sm truncate flex-1">
                                        {employee.position}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-700 text-xs sm:text-sm truncate flex-1" title={employee.email}>
                                        {employee.email}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-600 text-xs sm:text-sm">Department:</span>
                                    </div>
                                    <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full transition-all duration-200 ${getDepartmentColor(employee.department)}`}>
                                        {employee.department}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-600 text-xs sm:text-sm">Salary:</span>
                                    </div>
                                    <span className="text-gray-700 text-xs sm:text-sm">
                                        ${employee.salary.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-600 text-xs sm:text-sm">Hire Date:</span>
                                    </div>
                                    <span className="text-gray-700 text-xs sm:text-sm">
                                        {new Date(employee.hireDate).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-xs sm:text-sm">Status:</span>
                                    <button
                                        onClick={(e) => handleStatusToggle(employee.id, e)}
                                        className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer ${getStatusColor(employee.status)}`}
                                        title="Click to toggle status"
                                    >
                                        {employee.status}
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-3 sm:pt-4 border-t border-gray-200/50 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEdit(employee);
                                    }}
                                    className="flex-1 px-2 sm:px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center space-x-1"
                                >
                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={(e) => handleDelete(employee.id, e)}
                                    className="flex-1 px-2 sm:px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center space-x-1"
                                >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Delete</span>
                                </button>
                                <button
                                    onClick={(e) => handleView(employee, e)}
                                    className="px-2 sm:px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                                    title={`View ${employee.name}'s details`}
                                >
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>
                    </LightGlassCard>
                ))}
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <LightGlassCard className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto" gradient>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Add New Employee</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.employeeId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="EMP-001"
                                />
                                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Department</option>
                                    <option>IT</option>
                                    <option>HR</option>
                                    <option>Finance</option>
                                    <option>Marketing</option>
                                    <option>Sales</option>
                                </select>
                                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.position ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Manager"
                                />
                                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.salary ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="50000"
                                />
                                {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                                <input
                                    type="date"
                                    name="hireDate"
                                    value={formData.hireDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.hireDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.hireDate && <p className="text-red-500 text-xs mt-1">{errors.hireDate}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="john@company.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.website ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="https://company.com"
                                />
                                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEmployee}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm"
                            >
                                Add Employee
                            </button>
                        </div>
                    </LightGlassCard>
                </div>
            )}

            {/* Edit Employee Modal */}
            {editingEmployee && editForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <LightGlassCard className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto" gradient>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Edit Employee</h3>
                            <button
                                onClick={() => setEditingEmployee(null)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={editForm.employeeId}
                                    onChange={handleEditChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.employeeId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    name="department"
                                    value={editForm.department}
                                    onChange={handleEditChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Department</option>
                                    <option>IT</option>
                                    <option>HR</option>
                                    <option>Finance</option>
                                    <option>Marketing</option>
                                    <option>Sales</option>
                                </select>
                                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={editForm.position}
                                    onChange={handleEditChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.position ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={editForm.salary}
                                    onChange={handleEditChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.salary ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                                <input
                                    type="date"
                                    name="hireDate"
                                    value={editForm.hireDate}
                                    onChange={handleEditChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.hireDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.hireDate && <p className="text-red-500 text-xs mt-1">{errors.hireDate}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={editForm.website}
                                    onChange={handleEditChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${errors.website ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={editForm.status}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                            <button
                                onClick={() => setEditingEmployee(null)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </LightGlassCard>
                </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{employees.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Employees</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{employees.filter(e => e.status === 'Active').length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Active</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                        ${employees.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Salary</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-orange-600">
                        {employees.length > 0
                            ? Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length).toLocaleString()
                            : 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Avg. Salary</div>
                </LightGlassCard>
            </div>
            <div className="mt-6 flex justify-end">
                <Button
                    onClick={handleDownloadPDF}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                </Button>
            </div>
        </div>
    );
};

export default ManagementForm;