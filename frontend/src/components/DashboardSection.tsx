import React from 'react';
import {
    DollarSign,
    Users,
    ShoppingCart,
    FileText,
    Receipt,
    UserCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import InvoiceStatusProgress from './InvoiceStatusProgress';
import QuotesStatusProgress from './QuoteStatusProgress';
import SalesStatusProgress from './SalesCountCircle';
interface DashboardSectionProps {
    stats: {
        revenue: number;
        revenueChange: number;
        customers: number;
        customersChange: number;
        invoices: number;
        invoicesChange: number;
        orders: number;
        ordersChange: number;
    };

    recentOrders: {
        id: string;
        customer: string;
        total: number;
        status: string;
    }[];
    topCustomers: {
        name: string;
        revenue: number;
        orders: number;
        growth: number;
    }[];
    getStatusColor: (status: string) => string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
    stats,
    recentOrders,
    topCustomers,
    getStatusColor
}) => {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
                                <p className="text-xs text-success flex items-center mt-2">
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                    {stats.revenueChange}%
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                                <p className="text-2xl font-bold">{stats.customers.toLocaleString()}</p>
                                <p className="text-xs text-success flex items-center mt-2">
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                    {stats.customersChange}%
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-success" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{stats.orders}</p>
                                <p className="text-xs text-success flex items-center mt-2">
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                    {stats.ordersChange}%
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-info/10 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-6 w-6 text-info" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Invoices</p>
                                <p className="text-2xl font-bold">{stats.invoices}</p>
                                <p className="text-xs text-destructive flex items-center mt-2">
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                    {Math.abs(stats.invoicesChange)}%
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-warning/10 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-warning" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <InvoiceStatusProgress />
                <QuotesStatusProgress />
                <SalesStatusProgress/>

            </div>
            {/*Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 bg-success/10 rounded-lg flex items-center justify-center">
                                        <ShoppingCart className="h-4 w-4 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{order.id}</p>
                                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${order.total.toLocaleString()}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topCustomers.map((customer) => (
                            <div key={customer.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                                        <UserCircle className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">${customer.revenue.toLocaleString()}</p>
                                    <p className={`text-xs ${customer.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                                        {customer.growth > 0 ? '+' : ''}{customer.growth}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            </div>
        
        </div>
    );
};

export default DashboardSection;