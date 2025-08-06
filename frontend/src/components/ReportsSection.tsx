import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportsSectionProps {
    salesData: {
        month: string;
        sales: number;
        target: number;
    }[];
    stats: {
        customers: number;
        customersChange: number;
        revenue: number;
        monthlyExpenses: number;
    };
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ salesData, stats }) => {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Sales Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                                    name="Actual Sales"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="target"
                                    stroke="hsl(var(--success))"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                                    name="Target Sales"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Sales:</span>
                                <span className="font-semibold">$789,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Target:</span>
                                <span className="font-semibold">$765,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Achievement:</span>
                                <span className="font-semibold text-success">103.1%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Customers:</span>
                                <span className="font-semibold">{stats.customers}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">New This Month:</span>
                                <span className="font-semibold">42</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Growth Rate:</span>
                                <span className="font-semibold text-success">+{stats.customersChange}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Monthly Revenue:</span>
                                <span className="font-semibold">${stats.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Expenses:</span>
                                <span className="font-semibold">${stats.monthlyExpenses.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Net Profit:</span>
                                <span className="font-semibold text-success">${(stats.revenue - stats.monthlyExpenses).toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReportsSection;