import React, { useState, useEffect } from 'react';
import { FileText, TrendingUp, Users, Activity, Upload, Search, Brain, Database } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getDashboardStats } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface DashboardStats {
  totalDocuments: number;
  documentsProcessedToday: number;
  entitiesExtracted: number;
  averageProcessingTime: number;
  processingHistory: Array<{ date: string; count: number }>;
  documentTypes: Array<{ type: string; count: number }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Documents',
      value: stats?.totalDocuments || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Processed Today',
      value: stats?.documentsProcessedToday || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Entities Extracted',
      value: stats?.entitiesExtracted || 0,
      icon: Brain,
      color: 'bg-purple-500',
      change: '+25%',
    },
    {
      title: 'Avg Processing Time',
      value: `${stats?.averageProcessingTime || 0}ms`,
      icon: Activity,
      color: 'bg-yellow-500',
      change: '-5%',
    },
  ];

  const processingChartData = {
    labels: stats?.processingHistory.map(item => item.date) || [],
    datasets: [
      {
        label: 'Documents Processed',
        data: stats?.processingHistory.map(item => item.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const documentTypesData = {
    labels: stats?.documentTypes.map(item => item.type) || [],
    datasets: [
      {
        label: 'Document Count',
        data: stats?.documentTypes.map(item => item.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 101, 101, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      },
    ],
  };

  const quickActions = [
    {
      title: 'Upload Documents',
      description: 'Add new documents for processing',
      icon: Upload,
      href: '/upload',
      color: 'bg-blue-500',
    },
    {
      title: 'Search Documents',
      description: 'Find and analyze documents',
      icon: Search,
      href: '/search',
      color: 'bg-green-500',
    },
    {
      title: 'Document Analysis',
      description: 'View detailed analysis results',
      icon: Brain,
      href: '/analysis',
      color: 'bg-purple-500',
    },
    {
      title: 'System Analytics',
      description: 'View system performance metrics',
      icon: Database,
      href: '/analytics',
      color: 'bg-yellow-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Document Intelligence Platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-green-600 font-medium">{card.change}</span>
              <span className="text-sm text-gray-600 ml-2">from last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing History</h3>
          <Line data={processingChartData} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Types</h3>
          <Bar data={documentTypesData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className={`${action.color} p-2 rounded-lg`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Document uploaded', file: 'contract_2024.pdf', time: '2 minutes ago' },
            { action: 'Analysis completed', file: 'financial_report.docx', time: '5 minutes ago' },
            { action: 'Entities extracted', file: 'meeting_notes.txt', time: '10 minutes ago' },
            { action: 'Document processed', file: 'presentation.pptx', time: '15 minutes ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.file}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;