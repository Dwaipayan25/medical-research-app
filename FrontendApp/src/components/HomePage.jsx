import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title);

const HomePage = () => {
  // Sample data for charts
  const dataTypeDistribution = {
    labels: ['Genomic Data', 'Clinical Records', 'Imaging Data', 'Lab Results', 'Pharmaceutical'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#4F46E5', // Indigo
          '#7C3AED', // Purple
          '#06B6D4', // Cyan
          '#10B981', // Emerald
          '#F59E0B'  // Amber
        ],
        borderWidth: 0,
      },
    ],
  };

  const researchAccuracy = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Research Accuracy',
        data: [85, 87, 90, 88, 92, 94],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const collaborationStats = {
    labels: ['Active Researchers', 'Data Providers', 'AI Agents', 'Research Projects'],
    datasets: [
      {
        label: 'Count',
        data: [1245, 890, 567, 234],
        backgroundColor: [
          '#4F46E5',
          '#7C3AED', 
          '#06B6D4',
          '#10B981'
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 80,
        max: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Decentralized Medical Research
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering collaborative and privacy-preserving medical research through decentralized AI agents and data ownership
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Research Projects</p>
                <p className="text-3xl font-bold text-indigo-600">1,234</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">↗ +12% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active AI Agents</p>
                <p className="text-3xl font-bold text-purple-600">567</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">↗ +8% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Providers</p>
                <p className="text-3xl font-bold text-cyan-600">890</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏥</span>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">↗ +15% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Research Accuracy</p>
                <p className="text-3xl font-bold text-emerald-600">94%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">↗ +2% from last month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Data Type Distribution Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Data Type Distribution</h3>
            <div className="h-64">
              <Pie data={dataTypeDistribution} options={chartOptions} />
            </div>
          </div>

          {/* Research Accuracy Over Time */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Research Accuracy Over Time</h3>
            <div className="h-64">
              <Line data={researchAccuracy} options={lineChartOptions} />
            </div>
          </div>

          {/* Collaboration Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Statistics</h3>
            <div className="h-64">
              <Bar data={collaborationStats} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Research Activities</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">AI</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Cancer Research Initiative</p>
                  <p className="text-sm text-gray-600">AI Agent analyzed 50,000 genomic samples</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">ML</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Diabetes Prediction Model</p>
                  <p className="text-sm text-gray-600">New federated learning model deployed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">In Progress</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                  <span className="text-cyan-600 font-bold">DA</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">COVID-19 Variant Analysis</p>
                  <p className="text-sm text-gray-600">Cross-institutional data analysis started</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Contribute to Medical Research?</h3>
          <p className="text-lg mb-6 opacity-90">
            Join our decentralized network and help advance medical science while maintaining complete data privacy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Get Started
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
