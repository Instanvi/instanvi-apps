'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@potta/components/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import pottaAnalyticsService from '@potta/services/analyticsService';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BudgetAnalyticsCardProps {
  title: string;
  description: string;
  chartType:
    | 'budget_overview'
    | 'budget_by_department'
    | 'budget_by_location'
    | 'budget_variance';
  timeGranularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

const BudgetAnalyticsCard: React.FC<BudgetAnalyticsCardProps> = ({
  title,
  description,
  chartType,
  timeGranularity = 'monthly',
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        let chartData;

        switch (chartType) {
          case 'budget_overview':
            // Fetch revenue data and create budget scenarios
            response = await pottaAnalyticsService.finance.getAnalytics(
              'revenue',
              {
                metrics: ['total_revenue'],
                dimensions: ['time'],
                time_granularity: timeGranularity,
                use_mock_data: true,
              }
            );

            if (response.data && response.data.length > 0) {
              const labels = response.data.map(
                (item: any) => item.time || 'Period'
              );
              const actualRevenue = response.data.map(
                (item: any) => item.total_revenue || 0
              );
              const budgetRevenue = actualRevenue.map(
                (val: number) => val * 0.9
              ); // 10% conservative budget
              const forecastRevenue = actualRevenue.map(
                (val: number) => val * 1.15
              ); // 15% optimistic forecast

              chartData = {
                labels,
                datasets: [
                  {
                    label: 'Actual Revenue',
                    data: actualRevenue,
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 2,
                  },
                  {
                    label: 'Budget Target',
                    data: budgetRevenue,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                  },
                  {
                    label: 'Forecast',
                    data: forecastRevenue,
                    backgroundColor: 'rgba(168, 85, 247, 0.8)',
                    borderColor: 'rgb(168, 85, 247)',
                    borderWidth: 2,
                  },
                ],
              };
            }
            break;

          case 'budget_by_department':
            // Fetch OPEX data and create department budget breakdown
            response = await pottaAnalyticsService.finance.getAnalytics(
              'opex',
              {
                metrics: ['total_opex_amount'],
                dimensions: ['time'],
                time_granularity: timeGranularity,
                use_mock_data: true,
              }
            );

            if (response.data && response.data.length > 0) {
              const labels = response.data.map(
                (item: any) => item.time || 'Period'
              );
              const totalOpex = response.data.map(
                (item: any) => item.total_opex_amount || 0
              );

              // Simulate department breakdown (40% R&D, 25% Sales, 20% G&A, 15% Marketing)
              const rndBudget = totalOpex.map((val: number) => val * 0.4);
              const salesBudget = totalOpex.map((val: number) => val * 0.25);
              const gaBudget = totalOpex.map((val: number) => val * 0.2);
              const marketingBudget = totalOpex.map(
                (val: number) => val * 0.15
              );

              chartData = {
                labels,
                datasets: [
                  {
                    label: 'R&D Budget',
                    data: rndBudget,
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Sales Budget',
                    data: salesBudget,
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderColor: 'rgb(245, 158, 11)',
                    borderWidth: 1,
                  },
                  {
                    label: 'G&A Budget',
                    data: gaBudget,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Marketing Budget',
                    data: marketingBudget,
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgb(99, 102, 241)',
                    borderWidth: 1,
                  },
                ],
              };
            }
            break;

          case 'budget_by_location':
            // Fetch COGS data and create location-based budget
            response = await pottaAnalyticsService.finance.getAnalytics(
              'cogs',
              {
                metrics: ['total_cost'],
                dimensions: ['time'],
                time_granularity: timeGranularity,
                use_mock_data: true,
              }
            );

            if (response.data && response.data.length > 0) {
              const labels = response.data.map(
                (item: any) => item.time || 'Period'
              );
              const totalCost = response.data.map(
                (item: any) => item.total_cost || 0
              );

              // Simulate location breakdown (50% HQ, 30% Regional, 20% Remote)
              const hqBudget = totalCost.map((val: number) => val * 0.5);
              const regionalBudget = totalCost.map((val: number) => val * 0.3);
              const remoteBudget = totalCost.map((val: number) => val * 0.2);

              chartData = {
                labels,
                datasets: [
                  {
                    label: 'HQ Budget',
                    data: hqBudget,
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Regional Budget',
                    data: regionalBudget,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Remote Budget',
                    data: remoteBudget,
                    backgroundColor: 'rgba(168, 85, 247, 0.8)',
                    borderColor: 'rgb(168, 85, 247)',
                    borderWidth: 1,
                  },
                ],
              };
            }
            break;

          case 'budget_variance':
            // Fetch net income data and create variance analysis
            response = await pottaAnalyticsService.finance.getAnalytics(
              'net_income',
              {
                metrics: ['net_income_after_tax'],
                dimensions: ['time'],
                time_granularity: timeGranularity,
                use_mock_data: true,
              }
            );

            if (response.data && response.data.length > 0) {
              const labels = response.data.map(
                (item: any) => item.time || 'Period'
              );
              const actualNetIncome = response.data.map(
                (item: any) => item.net_income_after_tax || 0
              );
              const budgetNetIncome = actualNetIncome.map(
                (val: number) => val * 0.85
              ); // 15% conservative budget
              const variance = actualNetIncome.map(
                (actual: number, index: number) => {
                  const budget = budgetNetIncome[index];
                  return ((actual - budget) / budget) * 100;
                }
              );

              chartData = {
                labels,
                datasets: [
                  {
                    label: 'Actual Net Income',
                    data: actualNetIncome,
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgb(34, 197, 94)',
                    borderWidth: 2,
                    yAxisID: 'y',
                  },
                  {
                    label: 'Budget Net Income',
                    data: budgetNetIncome,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                    yAxisID: 'y',
                  },
                  {
                    label: 'Variance %',
                    data: variance,
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2,
                    yAxisID: 'y1',
                    type: 'line' as const,
                  },
                ],
              };
            }
            break;
        }

        if (chartData) {
          setData(chartData);
        } else {
          throw new Error('No data available');
        }
      } catch (err) {
        console.error('Error fetching budget data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch budget data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [chartType, timeGranularity]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6b7280',
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { weight: 500, size: 12 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: {
          color: '#6b7280',
          font: { weight: 500, size: 12 },
          callback: function (value: any) {
            return `${value.toLocaleString()} FCFA`;
          },
        },
        beginAtZero: true,
      },
      ...(chartType === 'budget_variance' && {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          grid: { drawOnChartArea: false },
          ticks: {
            color: '#6b7280',
            font: { weight: 500, size: 12 },
            callback: function (value: any) {
              return `${value.toFixed(1)}%`;
            },
          },
        },
      }),
    },
  };

  if (loading) {
    return (
      <Card className="bg-white border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">
                Error Loading Data
              </div>
              <div className="text-gray-600">{error}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartType === 'budget_variance' ? (
            <Line data={data} options={chartOptions} />
          ) : (
            <Bar data={data} options={chartOptions} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetAnalyticsCard;
