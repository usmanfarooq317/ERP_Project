import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Invoices from "@/components/Invoices";
import Quotes from "@/components/Quotes";
import ManagementForm from "@/components/ManagementForm";
import OrdersForm from "@/components/OrdersForm";
import FinanceForm from "@/components/FinanceForm";
import PaymentsForm from '@/components/PaymentsForm';
import ProductForm from "@/components/ProductForm";
import CustomerForm from "@/components/CustomerForm";
import SaleForm from "@/components/SaleForm";
import Comapanies from "@/components/Companies";
import ReportsSection from "@/components/ReportsSection";
import DashboardSection from "@/components/DashboardSection";
import UserManagementForm from "@/components/UserManagementForm";
import {
  BarChart3,

  Users,
  FileText,
  DollarSign,
  ShoppingCart,
  Users2,
  Banknote,
  ClipboardList,
  ArrowUp,
  ArrowDown,
  Eye,
  Plus,
  Bell,
  Settings,
  Home,
  Receipt,
  Building2,
  Package,
  TrendingUp,
  UserCircle,
  BarChart,
  Calendar,
  Save,
  X,

  Menu,
  ChevronDown,
  User,
  Lock,
  Globe,
  Fingerprint,
  Briefcase,
  UserCog,
  LogOut,
  Edit

} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ERPHomepage from '@/pages/ERPHomepage';


const ERPDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com'
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 45000, target: 50000 },
    { month: 'Feb', sales: 52000, target: 55000 },
    { month: 'Mar', sales: 48000, target: 52000 },
    { month: 'Apr', sales: 61000, target: 58000 },
    { month: 'May', sales: 55000, target: 60000 },
    { month: 'Jun', sales: 67000, target: 65000 },
    { month: 'Jul', sales: 71000, target: 68000 },
    { month: 'Aug', sales: 69000, target: 70000 },
    { month: 'Sep', sales: 76000, target: 72000 },
    { month: 'Oct', sales: 82000, target: 75000 },
    { month: 'Nov', sales: 78000, target: 80000 },
    { month: 'Dec', sales: 85000, target: 82000 }
  ];

  // Mock data
  const stats = {
    revenue: 125450,
    revenueChange: 12.5,
    customers: 1247,
    customersChange: 8.2,
    invoices: 89,
    invoicesChange: -3.1,
    orders: 156,
    ordersChange: 15.7,
    pendingPayments: 23450,
    overdueInvoices: 12,
    activeEmployees: 28,
    monthlyExpenses: 45670
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'quotes', label: 'Quotes', icon: Receipt },
    { id: 'management', label: 'Management (HR)', icon: Building2 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'payments', label: 'Payments', icon: Banknote },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'companies', label: 'Companies', icon: Briefcase },
    { id: 'reports', label: 'Reports', icon: BarChart },
    { id: 'user-management', label: 'User Management', icon: UserCog },
    { id: 'fingerprint', label: 'Fingerprint', icon: Fingerprint }

  ];

  

  const recentOrders = [
    { id: 'ORD-001', customer: 'Acme Corp', items: 12, total: 2450, status: 'completed' },
    { id: 'ORD-002', customer: 'TechStart Inc', items: 8, total: 1890, status: 'processing' },
    { id: 'ORD-003', customer: 'Global Solutions', items: 15, total: 3200, status: 'shipped' },
    { id: 'ORD-004', customer: 'Digital Agency', items: 6, total: 1750, status: 'pending' }
  ];

  const topCustomers = [
    { name: 'Acme Corp', revenue: 15450, orders: 12, growth: 8.5 },
    { name: 'TechStart Inc', revenue: 12890, orders: 9, growth: 12.3 },
    { name: 'Global Solutions', revenue: 11200, orders: 8, growth: -2.1 },
    { name: 'Digital Agency', revenue: 9750, orders: 7, growth: 5.7 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
      case 'processing':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'overdue':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'draft':
        return 'text-muted-foreground bg-muted border-border';
      case 'shipped':
        return 'text-info bg-info/10 border-info/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your profile update logic here
    setShowProfileModal(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your password update logic here
    setShowPasswordModal(false);
  };

  // Form Components
  const InvoiceForm = () => (
    <Card>
      ...
    </Card>
  );
 const QuotesForm = () => (
    <Card>
      ...
    </Card>
  );
  const ManagementsForm = () => (
    <Card>
      ...
    </Card>
  );

  const OrderForm = () => (
    <Card>
      ...
    </Card>
  );

  const FinancesForm = () => (
    <Card>
      ...
    </Card>
  );

  const SalesForm = () => (
    <Card>
      ...
    </Card>
  );

  const ProductsForm = () => (
    <Card>
      ...
    </Card>
  );


  const CustomersForm = () => (
    <Card>
      ...
    </Card>
  );
  const CompaniesForm = () => (
    <Card>
      ...
    </Card>
  );
  const UserManagementForms = () => (
    <Card>
      ...
    </Card>
  );
  const handleLogout = (): void => {
        navigate('/');
    };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection
          stats={stats}
          recentOrders={recentOrders}
          topCustomers={topCustomers}
          getStatusColor={getStatusColor}
        />;
      case 'invoices': 
        return <Invoices />;
      case 'quotes':
        return <Quotes />;
      case 'management':
        return <ManagementForm />;
      case 'orders':
        return <OrdersForm />;
      case 'finance':
        return <FinanceForm />;
      case 'sales':
        return <SaleForm />;
      case 'products':
        return <ProductForm />;
      case 'payments':
        return <PaymentsForm />;
      case 'customers':
        return <CustomerForm />;
      case 'reports':
        return <ReportsSection salesData={salesData} stats={stats} />;
      case 'companies':
        return <Comapanies />;
      case 'user-management':
        return <UserManagementForm />;
      case 'fingerprint':
        //await handleFingerprintRegistration(); 
    return null;
      default:
        return <ERPHomepage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-white">ERP Dashboard</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-white hover:bg-slate-800"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeSection === item.id
                      ? 'bg-primary text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground capitalize">
                {activeSection === 'management' ? 'HR Management' : activeSection}
              </h2>
              <p className="text-muted-foreground">
                {activeSection === 'dashboard'
                  ? 'Overview of your business metrics'
                  : `Manage your ${activeSection === 'management' ? 'employees and HR data' : activeSection}`
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Currency Selector -  */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2" aria-label="Currency selection">
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <span>USD</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>PKR</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2" aria-label="Language selection">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <span>English</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Urdu</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Settings Dropdown  */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2" aria-label="User settings">
                    <UserCircle className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    <span>Logged in as: Admin</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    <span>Update Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLogout()}>
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
      {/* Profile Update Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Profile</h3>
              <button onClick={() => setShowProfileModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowProfileModal(false);
                    setShowPasswordModal(true);
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Password</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ERPDashboard;