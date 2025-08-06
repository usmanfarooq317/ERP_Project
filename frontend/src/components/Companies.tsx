import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw, Search, Download, Save, X, Grid2x2Plus } from 'lucide-react';

export interface Company {
  id: string;
  name: string;
  contact: string;
  country: string;
  phone: string;
  email: string;
  website: string;
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCompany, setNewCompany] = useState<Omit<Company, 'id'>>({
    name: '',
    contact: '',
    country: '',
    phone: '',
    email: '',
    website: ''
  });

  

 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const companyToAdd = {
      ...newCompany,
      id: `comp-${Date.now()}`
    };

    setCompanies(prev => [...prev, companyToAdd]);
    setIsAddingNew(false);
    setNewCompany({
      name: '',
      contact: '',
      country: '',
      phone: '',
      email: '',
      website: ''
    });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewCompany({
      name: '',
      contact: '',
      country: '',
      phone: '',
      email: '',
      website: ''
    });
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Add New Company Form Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Company</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">* Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newCompany.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Contact</label>
                    <input
                      type="text"
                      name="contact"
                      value={newCompany.contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={newCompany.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={newCompany.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">* Email</label>
                    <input
                      type="email"
                      name="email"
                      value={newCompany.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={newCompany.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelAdd}
                    className="px-6 py-2 min-w-[100px]"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[140px] flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Company Table */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold">Company List</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button
              variant="outline"
              onClick={() => setCompanies([])}
              className="px-4 py-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 min-w-[160px] justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Company
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Name</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Contact</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Country</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Phone</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Email</th>
                  <th className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-900">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Grid2x2Plus className="h-12 w-12 mb-2 text-gray-400" />
                        <p className="text-lg font-medium mb-1">No companies yet</p>
                        <p className="text-sm">Click "Add New Company" to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="font-medium text-gray-900">{company.name}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{company.contact}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{company.country}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{company.phone}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        <span className="text-gray-700">{company.email}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {company.website}
                          </a>
                        )}
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

export default Companies;