
import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
  ChartOptions
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailySales } from '@/types';

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

interface SalesChartProps {
  salesData: DailySales[];
}

export function SalesChart({ salesData }: SalesChartProps) {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });

  const [categoryChartData, setCategoryChartData] = useState<any>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (salesData.length === 0) return;

    // Sort data by date
    const sortedData = [...salesData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Format dates
    const formattedDates = sortedData.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // Extract data for main chart
    const salesAmounts = sortedData.map(day => day.totalAmount);
    const orderCounts = sortedData.map(day => day.orderCount);

    // Setup main chart data
    setChartData({
      labels: formattedDates,
      datasets: [
        {
          label: 'Sales (₹)',
          data: salesAmounts,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Orders',
          data: orderCounts,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y1',
        }
      ]
    });

    // Extract categories from the first day's data
    const categories = Object.keys(sortedData[0].categories);
    
    // Create datasets for each category
    const categoryDatasets = categories.map((category, index) => {
      // Generate a color based on index
      const hue = (index * 137) % 360; // Golden ratio to spread colors
      const color = `hsl(${hue}, 70%, 60%)`;
      
      return {
        label: category,
        data: sortedData.map(day => day.categories[category]?.totalAmount || 0),
        backgroundColor: color,
      };
    });

    setCategoryChartData({
      labels: formattedDates,
      datasets: categoryDatasets
    });

  }, [salesData]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales Amount (₹)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Order Count'
        }
      },
    },
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sales by Category'
      },
    },
  };

  return (
    <Card className="col-span-full fade-in">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line">
          <TabsList className="mb-4">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="category">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="line" className="h-80">
            <Line data={chartData} options={chartOptions} />
          </TabsContent>
          <TabsContent value="category" className="h-80">
            <Bar data={categoryChartData} options={categoryChartOptions} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
