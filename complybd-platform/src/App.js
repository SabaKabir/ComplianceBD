import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { Search, FileText, LayoutDashboard, Settings, Library, DollarSign, Target, ShieldCheck, Download, Filter, Calendar, AlertTriangle } from 'lucide-react';

// --- MOCK DATA ---
// This data simulates what would be fetched from a backend API.

const mockCirculars = [
  { id: 1, title: 'Guidelines on Environmental & Social Risk Management (ESRM)', department: 'SFD', date: '2022-11-08', circularNo: 'SFD Circular No. 03/2022', category: 'ESRM' },
  { id: 2, title: 'Half-yearly Reporting on CSR Activities', department: 'SFD', date: '2022-01-20', circularNo: 'SFD Circular Letter No. 01/2022', category: 'CSR' },
  { id: 3, title: 'Establishment of Climate Risk Fund', department: 'GBCSRD', date: '2015-12-30', circularNo: 'GBCSRD Circular No. 04/2015', category: 'CSR' },
  { id: 4, title: 'Policy Guidelines for Green Banking', department: 'GBCSRD', date: '2014-08-25', circularNo: 'GBCSRD Circular No. 04/2014', category: 'Green Banking' },
  { id: 5, title: 'Mainstreaming Sustainable Finance', department: 'SFD', date: '2023-08-10', circularNo: 'SFD Circular No. 05/2023', category: 'Sustainable Finance' },
  { id: 6, title: 'Promotion of Bangla-QR in CSR Activities', department: 'SFD', date: '2023-02-15', circularNo: 'SFD Circular No. 01/2023', category: 'CSR' },
];

const initialCsrData = {
  totalBudget: 50000000, // 5 Crore BDT
  climateRiskFundAllocation: 5000000, // 10%
  expenditure: {
    disasterManagement: 7500000,
    environmentAndClimate: 12000000,
    education: 10000000,
    health: 8500000,
    artsCultureSports: 4000000,
    banglaQR: 3000000,
  }
};

const greenFinanceData = {
  target: 5.0, // 5%
  achieved: 4.2,
  totalLoanDisbursed: 25000000000, // 2500 Crore BDT
  greenLoanDisbursed: 1050000000, // 105 Crore BDT
};

const esrmChecklistItems = [
    { id: 'esrm1', text: 'Identify potential environmental and social risks of the project.', checked: true },
    { id: 'esrm2', text: 'Categorize the project based on risk level (High, Medium, Low).', checked: true },
    { id: 'esrm3', text: 'Conduct Environmental & Social Due Diligence (ESDD).', checked: false },
    { id: 'esrm4', text: 'Develop and include environmental and social covenants in loan agreements.', checked: true },
    { id: 'esrm5', text: 'Monitor the borrower\'s E&S performance throughout the loan lifecycle.', checked: false },
];


// --- UI Components ---

const Header = () => (
  <header className="bg-white shadow-sm p-4 flex justify-between items-center z-20 sticky top-0">
    <div className="flex items-center">
      <div className="bg-teal-600 p-2 rounded-lg mr-3">
        <ShieldCheck className="text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Comply<span className="text-teal-500">BD</span></h1>
    </div>
    <div className="flex items-center">
      <div className="relative mr-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 w-64" />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">First City Bank Ltd.</span>
        <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=FCB" alt="User Avatar" className="w-10 h-10 rounded-full" />
      </div>
    </div>
  </header>
);

const Sidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planning', label: 'Compliance & Planning', icon: Settings },
    { id: 'reporting', label: 'Reporting & Analytics', icon: FileText },
    { id: 'library', label: 'Regulatory Library', icon: Library },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col fixed h-full z-10">
      <nav className="mt-16">
        <ul>
          {navItems.map(item => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => setActivePage(item.id)}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activePage === item.id ? 'bg-teal-600 text-white' : 'hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-3" size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const Card = ({ title, children, icon, className }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md transition-all hover:shadow-lg ${className}`}>
        <div className="flex items-center text-gray-500 mb-4">
            {icon}
            <h3 className="font-bold text-lg ml-2">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);

// --- Page Components ---

const Dashboard = ({ csrData, greenData }) => {
    const csrPieData = [
        { name: 'Disaster Mgmt', value: csrData.expenditure.disasterManagement },
        { name: 'Environment', value: csrData.expenditure.environmentAndClimate },
        { name: 'Education', value: csrData.expenditure.education },
        { name: 'Health', value: csrData.expenditure.health },
        { name: 'Arts & Culture', value: csrData.expenditure.artsCultureSports },
        { name: 'Bangla-QR', value: csrData.expenditure.banglaQR },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

    const totalExpenditure = Object.values(csrData.expenditure).reduce((sum, val) => sum + val, 0);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card title="CSR Budget" icon={<DollarSign />}>
                    <p className="text-3xl font-bold text-gray-800">৳{csrData.totalBudget.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total for H1-2025</p>
                </Card>
                <Card title="Climate Risk Fund" icon={<AlertTriangle className="text-orange-500"/>}>
                    <p className="text-3xl font-bold text-gray-800">৳{csrData.climateRiskFundAllocation.toLocaleString()}</p>
                    <p className="text-sm text-green-600 font-semibold">{(csrData.climateRiskFundAllocation / csrData.totalBudget * 100).toFixed(1)}% of CSR Budget (Met)</p>
                </Card>
                <Card title="Green Finance" icon={<Target className="text-green-500"/>}>
                    <p className="text-3xl font-bold text-gray-800">{greenData.achieved}%</p>
                    <p className="text-sm text-gray-500">Target: {greenData.target}%</p>
                </Card>
                 <Card title="Total CSR Spent" icon={<DollarSign />}>
                    <p className="text-3xl font-bold text-gray-800">৳{totalExpenditure.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">of ৳{csrData.totalBudget.toLocaleString()}</p>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <div className="lg:col-span-3">
                    <Card title="Green Finance Performance" icon={<BarChart />}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[{ name: 'Green Finance', ...greenData }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis unit="%" />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                                <Bar dataKey="achieved" fill="#2dd4bf" name="Achieved" barSize={50} />
                                <Bar dataKey="target" fill="#cbd5e1" name="Target" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="CSR Expenditure by Sector" icon={<PieChart />}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={csrPieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                                    {csrPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip formatter={(value) => `৳${value.toLocaleString()}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const PlanningHub = ({ csrData, setCsrData, greenData, setGreenData, esrmItems, setEsrmItems }) => {
    const handleBudgetChange = (e) => {
        const newBudget = Number(e.target.value);
        const newClimateFund = newBudget * 0.10; // Enforce 10% rule
        setCsrData({ ...csrData, totalBudget: newBudget, climateRiskFundAllocation: newClimateFund });
    };

    const handleEsrmCheck = (id) => {
        setEsrmItems(esrmItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const climateFundPercentage = (csrData.climateRiskFundAllocation / csrData.totalBudget * 100).toFixed(2);
    const isClimateFundValid = climateFundPercentage >= 10;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Compliance & Planning Hub</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CSR Budgeting Section */}
                <Card title="CSR Budgeting & Allocation" icon={<DollarSign />}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="totalCsrBudget" className="block text-sm font-medium text-gray-700">Total Annual CSR Budget (BDT)</label>
                            <input
                                type="number"
                                id="totalCsrBudget"
                                value={csrData.totalBudget}
                                onChange={handleBudgetChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Climate Risk Fund Allocation</label>
                            <div className="mt-1 flex items-center p-3 bg-gray-100 rounded-md">
                                <span className="font-bold text-lg text-gray-800">৳{csrData.climateRiskFundAllocation.toLocaleString()}</span>
                                <span className={`ml-auto text-sm font-semibold px-2 py-1 rounded-full ${isClimateFundValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {climateFundPercentage}%
                                </span>
                            </div>
                            {!isClimateFundValid && <p className="text-xs text-red-600 mt-1">Allocation must be ≥10% of total CSR budget.</p>}
                             <p className="text-xs text-gray-500 mt-1">Automatically calculated as 10% of total budget as per GBCSRD Circular No. 04/2015.</p>
                        </div>
                        <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">Save Budget Plan</button>
                    </div>
                </Card>

                {/* Target Management Section */}
                <Card title="Target Management" icon={<Target />}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="greenFinanceTarget" className="block text-sm font-medium text-gray-700">Green Finance Target (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="greenFinanceTarget"
                                    value={greenData.target}
                                    onChange={(e) => setGreenData({ ...greenData, target: Number(e.target.value) })}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                            </div>
                             <p className="text-xs text-gray-500 mt-1">Minimum 5% as per GBCSRD Circular No. 04/2014.</p>
                        </div>
                        <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">Update Targets</button>
                    </div>
                </Card>

                {/* ESRM Framework Section */}
                <div className="lg:col-span-2">
                    <Card title="ESRM Framework Tool" icon={<ShieldCheck />}>
                        <p className="text-sm text-gray-600 mb-4">Operationalize ESRM guidelines for credit/loan applications. Attach this checklist to lending proposals.</p>
                        <div className="space-y-3">
                            {esrmItems.map(item => (
                                <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-md">
                                    <input
                                        id={item.id}
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => handleEsrmCheck(item.id)}
                                        className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    <label htmlFor={item.id} className="ml-3 block text-sm text-gray-800">{item.text}</label>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ReportingHub = ({ onGenerateReport }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Reporting & Analytics Hub</h2>
            <p className="text-gray-600 mb-8">Automate the generation of mandatory reports in the specific formats required by Bangladesh Bank.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Half-Yearly CSR Activities Report" icon={<FileText />}>
                    <p className="text-sm text-gray-600 mb-4">Generate the CSR report for H1-2025 as per SFD Circular Letter No. 01/2022.</p>
                    <button 
                        onClick={() => onGenerateReport('csr')}
                        className="w-full flex items-center justify-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                        <Download className="mr-2" size={18} />
                        Generate Report
                    </button>
                </Card>
                <Card title="Quarterly Sustainable Finance Report" icon={<FileText />}>
                    <p className="text-sm text-gray-600 mb-4">Generate the comprehensive Sustainable & Green Finance report for Q2-2025.</p>
                    <button 
                        onClick={() => onGenerateReport('sustainable_finance')}
                        className="w-full flex items-center justify-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                        <Download className="mr-2" size={18} />
                        Generate Report
                    </button>
                </Card>
            </div>
        </div>
    );
};

const RegulatoryLibrary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const filteredCirculars = useMemo(() => {
        return mockCirculars
            .filter(c => searchTerm === '' || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.circularNo.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(c => categoryFilter === 'All' || c.category === categoryFilter);
    }, [searchTerm, categoryFilter]);

    const categories = ['All', ...new Set(mockCirculars.map(c => c.category))];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Regulatory Library</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title or circular no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full md:w-48 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Circular Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Circular No.</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCirculars.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.circularNo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredCirculars.length === 0 && <p className="text-center p-8 text-gray-500">No circulars found.</p>}
            </div>
        </div>
    );
};

const ReportModal = ({ reportType, onClose, csrData }) => {
    if (!reportType) return null;

    const CsrReport = () => (
        <>
            <h3 className="text-xl font-bold mb-4">Half-Yearly CSR Activities Report (H1-2025)</h3>
            <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Total CSR Budget for the Period</p>
                    <p className="text-lg font-bold text-gray-800">৳{csrData.totalBudget.toLocaleString()}</p>
                </div>
                 <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Climate Risk Fund Allocation (≥10%)</p>
                    <p className="text-lg font-bold text-gray-800">৳{csrData.climateRiskFundAllocation.toLocaleString()} ({ (csrData.climateRiskFundAllocation / csrData.totalBudget * 100).toFixed(1) }%)</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Expenditure by Sector:</h4>
                    <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sector</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount (BDT)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(csrData.expenditure).map(([key, value]) => (
                                <tr key={key}>
                                    <td className="px-4 py-2 text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700 text-right font-mono">{value.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                           <tr>
                                <td className="px-4 py-2 text-sm font-bold text-gray-800">Total Expenditure</td>
                                <td className="px-4 py-2 text-sm font-bold text-gray-800 text-right font-mono">{Object.values(csrData.expenditure).reduce((a,b)=>a+b,0).toLocaleString()}</td>
                           </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );

    const SustainableFinanceReport = () => (
        <>
            <h3 className="text-xl font-bold mb-4">Quarterly Sustainable Finance Report (Q2-2025)</h3>
            <p className="text-gray-600">This report structure is a representation of the format required by Bangladesh Bank, populated with mock data.</p>
            <div className="mt-4 overflow-x-auto">
                <h4 className="font-semibold mb-2">Sustainable Agriculture</h4>
                <table className="min-w-full text-xs border">
                    {/* Table structure as per PRD */}
                    <thead className="bg-gray-100">
                       <tr>
                         <th rowSpan="2">Sl</th><th rowSpan="2">Areas/Sectors</th><th colSpan="2">Loan Sanctioned</th><th colSpan="2">Loan Disbursed</th><th colSpan="5">Outstanding</th><th rowSpan="2">Recovery</th><th rowSpan="2">Rescheduled</th>
                       </tr>
                       <tr>
                         <th>No.</th><th>Amt.</th><th>No.</th><th>Amt.</th><th>Std</th><th>SMA</th><th>SS</th><th>DF</th><th>BL</th>
                       </tr>
                    </thead>
                    <tbody>
                        <tr><td className="p-1 border text-center" colSpan="13">...Data for Crops, Irrigation, Livestock, etc...</td></tr>
                    </tbody>
                </table>
            </div>
             <div className="mt-4 overflow-x-auto">
                <h4 className="font-semibold mb-2">Total Sustainable Linked Finance by Gender</h4>
                <table className="min-w-full text-xs border">
                   <thead className="bg-gray-100">
                       <tr>
                         <th rowSpan="2">Sl</th><th rowSpan="2">Gender</th><th colSpan="2">Number</th><th colSpan="2">Amount</th><th rowSpan="2">Total</th>
                       </tr>
                       <tr>
                         <th>Rural</th><th>Urban</th><th>Rural</th><th>Urban</th>
                       </tr>
                    </thead>
                     <tbody>
                        <tr><td className="p-1 border text-center" colSpan="7">...Data for Men, Women, Third Gender...</td></tr>
                    </tbody>
                </table>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Generated Report Preview</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                {reportType === 'csr' && <CsrReport />}
                {reportType === 'sustainable_finance' && <SustainableFinanceReport />}
                 <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Close</button>
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center">
                        <Download size={18} className="mr-2"/>
                        Download as PDF
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [csrData, setCsrData] = useState(initialCsrData);
  const [greenData, setGreenData] = useState(greenFinanceData);
  const [esrmItems, setEsrmItems] = useState(esrmChecklistItems);
  const [activeReport, setActiveReport] = useState(null);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard csrData={csrData} greenData={greenData} />;
      case 'planning':
        return <PlanningHub csrData={csrData} setCsrData={setCsrData} greenData={greenData} setGreenData={setGreenData} esrmItems={esrmItems} setEsrmItems={setEsrmItems} />;
      case 'reporting':
        return <ReportingHub onGenerateReport={setActiveReport} />;
      case 'library':
        return <RegulatoryLibrary />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <div className="flex">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-grow p-8 ml-64 mt-16">
          {renderPage()}
        </main>
      </div>
      <ReportModal reportType={activeReport} onClose={() => setActiveReport(null)} csrData={csrData} />
    </div>
  );
}
