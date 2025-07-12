import React from 'react';
import { BarChart3, TrendingUp, FileText, Clock, Users, Activity } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Analytics: React.FC = () => {
  // Mock data for analytics
  const processingVolumeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Documents Processed',
        data: [120, 190, 300, 500, 200, 300],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const processingTimeData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Avg Processing Time (ms)',
        data: [1200, 1100, 950, 800],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const documentTypesData = {
    labels: ['PDF', 'Word', 'Text', 'Image', 'Other'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const entityTypesData = {
    labels: ['Person', 'Organization', 'Location', 'Date', 'Money'],
    datasets: [
      {
        label: 'Entities Extracted',
        data: [3200, 2800, 1900, 2100, 1200],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const stats = [
    {
      title: 'Total Documents',
      value: '12,847',
      change: '+12.5%',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Processing Speed',
      value: '1.2s',
      change: '-8.2%',
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+23.1%',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'API Calls',
      value: '45,231',
      change: '+15.3%',
      icon: Activity,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">
          Monitor system performance and document processing metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-600 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Processing Volume */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Processing Volume</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Bar data={processingVolumeData} options={chartOptions} />
          </div>
        </div>

        {/* Processing Time Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Processing Time Trend</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Line data={processingTimeData} options={chartOptions} />
          </div>
        </div>

        {/* Document Types Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Document Types</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Doughnut data={documentTypesData} options={chartOptions} />
          </div>
        </div>

        {/* Entity Types */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Entity Types Extracted</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Bar data={entityTypesData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                <span className="text-sm text-gray-900">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '42%' }} />
                </div>
                <span className="text-sm text-gray-900">42%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disk Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }} />
                </div>
                <span className="text-sm text-gray-900">78%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Rates</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Upload Errors</span>
              <span className="text-sm font-medium text-green-600">0.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Processing Errors</span>
              <span className="text-sm font-medium text-yellow-600">1.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Errors</span>
              <span className="text-sm font-medium text-green-600">0.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">System Errors</span>
              <span className="text-sm font-medium text-green-600">0.1%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Processed Types</h3>
          <div className="space-y-3">
            {[
              { type: 'Financial Reports', count: 1247, color: 'bg-blue-500' },
              { type: 'Contracts', count: 892, color: 'bg-green-500' },
              { type: 'Meeting Notes', count: 634, color: 'bg-yellow-500' },
              { type: 'Presentations', count: 423, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700">{item.type}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;