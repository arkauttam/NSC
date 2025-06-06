// components/charts/MiniCandlestickChart.tsx
import { Chart } from 'react-chartjs-2';

interface MiniCandlestickChartProps {
  symbol: string;
  data: {
    open: string;
    high: string;
    low: string;
    close: string;
  };
}

const MiniCandlestickChart: React.FC<MiniCandlestickChartProps> = ({ symbol, data }) => {
  const chartData = {
    datasets: [
      {
        label: symbol,
        data: [
          {
            x: 0,
            o: parseFloat(data.open),
            h: parseFloat(data.high),
            l: parseFloat(data.low),
            c: parseFloat(data.close),
          },
        ],
        borderColor: parseFloat(data.close) >= parseFloat(data.open) ? '#00FF00' : '#FF0000',
        color: parseFloat(data.close) >= parseFloat(data.open) ? '#00FF00' : '#FF0000',
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx: any) => {
            const d = ctx.raw;
            return `O: ${d.o.toFixed(4)}, H: ${d.h.toFixed(4)}, L: ${d.l.toFixed(4)}, C: ${d.c.toFixed(4)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        display: false,
        min: -0.5,
        max: 0.5,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="h-12 w-24">
      <Chart type="candlestick" data={chartData} options={chartOptions} />
    </div>
  );
};

export default MiniCandlestickChart;
