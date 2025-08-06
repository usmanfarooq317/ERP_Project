import React, { useState } from 'react';
import { Users, Plus, Eye, Edit, Trash2, User, Mail, Key, Shield, X, Download } from 'lucide-react';

// Light theme Glass Card component
const LightGlassCard = ({ children, className = "", gradient = false }: { children: React.ReactNode, className?: string, gradient?: boolean }) => (
    <div className={`backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg ${gradient ? 'bg-gradient-to-br from-white/90 to-gray-50/80' : ''} ${className}`}>
        {children}
    </div>
);

// User Management Component
const UserManagementForm = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Alex Chen',
            username: 'alexchen',
            password: '••••••••',
            email: 'alex.chen@company.com',
            role: 'Admin',
            status: 'Active',
            avatar: 'AC'
        },
        {
            id: 2,
            name: 'Sarah Kim',
            username: 'sarahkim',
            password: '••••••••',
            email: 'sarah.kim@company.com',
            role: 'Manager',
            status: 'Active',
            avatar: 'SK'
        },
        {
            id: 3,
            name: 'Marcus Johnson',
            username: 'marcusj',
            password: '••••••••',
            email: 'marcus.johnson@company.com',
            role: 'User',
            status: 'Inactive',
            avatar: 'MJ'
        },
        {
            id: 4,
            name: 'Elena Rodriguez',
            username: 'elenarodriguez',
            password: '••••••••',
            email: 'elena.rodriguez@company.com',
            role: 'Manager',
            status: 'Active',
            avatar: 'ER'
        },
        {
            id: 5,
            name: 'John Doe',
            username: 'johndoe',
            password: '••••••••',
            email: 'john.doe@company.com',
            role: 'User',
            status: 'Active',
            avatar: 'JD'
        },
        {
            id: 6,
            name: 'Lisa Wang',
            username: 'lisawang',
            password: '••••••••',
            email: 'lisa.wang@company.com',
            role: 'Manager',
            status: 'Inactive',
            avatar: 'LW'
        }
    ]);

    const [editingUser, setEditingUser] = useState<any>(null);
    const [viewingUser, setViewingUser] = useState<any>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setEditForm({ ...user });
    };

    const handleSaveEdit = () => {
        setUsers(users.map(user =>
            user.id === editingUser.id ? { ...editForm } : user
        ));
        setEditingUser(null);
        setEditForm({});
    };

    const handleDeleteClick = (user: any, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleStatusToggle = (userId: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        setUsers(prevUsers => prevUsers.map(user =>
            user.id === userId
                ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
                : user
        ));
    };

    const handleAddUser = () => {
        const newUser = {
            id: Math.max(...users.map(u => u.id)) + 1,
            name: 'New User',
            username: 'newuser',
            password: '••••••••',
            email: 'newuser@company.com',
            role: 'User',
            status: 'Active',
            avatar: 'NU'
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        setShowAddModal(false);
    };

    const handleView = (user: any, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setViewingUser(user);
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'text-red-700 bg-red-100 border border-red-200 hover:bg-red-200';
            case 'manager':
                return 'text-blue-700 bg-blue-100 border border-blue-200 hover:bg-blue-200';
            case 'user':
                return 'text-green-700 bg-green-100 border border-green-200 hover:bg-green-200';
            default:
                return 'text-gray-700 bg-gray-100 border border-gray-200 hover:bg-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Active'
            ? 'text-green-700 bg-green-100 border border-green-200 hover:bg-green-200'
            : 'text-red-700 bg-red-100 border border-red-200 hover:bg-red-200';
    };
    const handleDownloadPDF = () => {
        // This would be replaced with actual PDF generation logic
        alert("PDF download functionality would be implemented here");
    };


    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                    User Management
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center font-medium shadow-lg"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                </button>
            </div>

            {/* User Cards Grid - Wider Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {users.map((user) => (
                    <LightGlassCard key={user.id} className="p-4 sm:p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 group relative overflow-hidden min-w-[300px]" gradient>
                        <div className="relative z-10">
                            {/* User Header */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
                                        {user.avatar}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-800 font-bold text-base sm:text-lg truncate">{user.name}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm truncate">@{user.username}</p>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="space-y-2 sm:space-y-3 mb-4">
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-700 text-xs sm:text-sm truncate flex-1" title={user.email}>
                                        {user.email}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Key className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-700 text-xs sm:text-sm">
                                        {user.password}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-600 text-xs sm:text-sm">Role:</span>
                                    </div>
                                    <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full transition-all duration-200 ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-xs sm:text-sm">Status:</span>
                                    <button
                                        onClick={(e) => handleStatusToggle(user.id, e)}
                                        className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer ${getStatusColor(user.status)}`}
                                        title="Click to toggle status"
                                    >
                                        {user.status}
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons - Responsive */}
                            <div className="pt-3 sm:pt-4 border-t border-gray-200/50 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEdit(user);
                                    }}
                                    className="flex-1 px-2 sm:px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center space-x-1"
                                >
                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={(e) => handleDeleteClick(user, e)}
                                    className="flex-1 px-2 sm:px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center space-x-1"
                                >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Delete</span>
                                </button>
                                <button
                                    onClick={(e) => handleView(user, e)}
                                    className="px-2 sm:px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                                    title={`View ${user.name}'s details`}
                                >
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>
                    </LightGlassCard>
                ))}
            </div>

            {/* View User Modal */}
            {viewingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <LightGlassCard className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto" gradient>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                                User Details
                            </h3>
                            <button
                                onClick={() => setViewingUser(null)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* User Avatar and Basic Info */}
                        <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {viewingUser.avatar}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${viewingUser.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-800">{viewingUser.name}</h4>
                                <p className="text-gray-600">@{viewingUser.username}</p>
                                <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full mt-1 ${getStatusColor(viewingUser.status)}`}>
                                    {viewingUser.status}
                                </span>
                            </div>
                        </div>

                        {/* Detailed Information */}
                        <div className="space-y-4">
                            <div className="bg-white/50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Personal Information</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Full Name:</span>
                                        <span className="text-gray-800 font-medium">{viewingUser.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">User ID:</span>
                                        <span className="text-gray-800 font-medium">#{viewingUser.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Contact Information</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="text-gray-800 font-medium break-all">{viewingUser.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Username:</span>
                                        <span className="text-gray-800 font-medium">@{viewingUser.username}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Account Settings</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Role:</span>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(viewingUser.role)}`}>
                                            {viewingUser.role}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status:</span>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(viewingUser.status)}`}>
                                            {viewingUser.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setViewingUser(null)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </LightGlassCard>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <LightGlassCard className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md" gradient>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Delete User</h3>
                                <p className="text-sm text-gray-600">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-800">
                                Are you sure you want to delete <strong>{userToDelete.name}</strong>?
                                This will permanently remove their account and all associated data.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setUserToDelete(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                Delete User
                            </button>
                        </div>
                    </LightGlassCard>
                </div>
            )}

            {/* Edit Modal - Responsive */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <LightGlassCard className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto" gradient>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Edit User</h3>
                            <button
                                onClick={() => setEditingUser(null)}
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
                                    value={editForm.name || ''}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={editForm.username || ''}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email || ''}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={editForm.role || ''}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={editForm.status || ''}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                            <button
                                onClick={() => setEditingUser(null)}
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

            {/* Add User Modal - Responsive */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <LightGlassCard className="p-4 sm:p-6 w-full max-w-sm sm:max-w-md" gradient>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Add New User</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">A new user with default values will be created. You can edit the details afterwards.</p>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm"
                            >
                                Add User
                            </button>
                        </div>
                    </LightGlassCard>
                </div>
            )}

            {/* Summary Stats - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{users.length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Users</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{users.filter(u => u.status === 'Active').length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Active Users</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{users.filter(u => u.role === 'Admin').length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Admins</div>
                </LightGlassCard>
                <LightGlassCard className="p-3 sm:p-4 text-center" gradient>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'Manager').length}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Managers</div>
                </LightGlassCard>
            </div>
            {/* Download PDF Button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center font-medium shadow-lg"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default UserManagementForm;