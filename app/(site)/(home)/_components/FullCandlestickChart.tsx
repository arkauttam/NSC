// components/charts/FullCandlestickChart.tsx
import { Chart } from 'react-chartjs-2';
import { StockValue } from '@/schemas/nsc/nsc-type';

interface FullCandlestickChartProps {
  symbol: string;
  data: StockValue[];
}

const FullCandlestickChart: React.FC<FullCandlestickChartProps> = ({ symbol, data }) => {
  const chartData = {
    datasets: [
      {
        label: symbol,
        data: data.map((d) => ({
          x: new Date(d.datetime).getTime(),
          o: parseFloat(d.open),
          h: parseFloat(d.high),
          l: parseFloat(d.low),
          c: parseFloat(d.close),
        })).reverse(),
        borderColor: data.map((d) =>
          parseFloat(d.close) >= parseFloat(d.open) ? '#00FF00' : '#FF0000'
        ),
        color: data.map((d) =>
          parseFloat(d.close) >= parseFloat(d.open) ? '#00FF00' : '#FF0000'
        ),
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Candlestick Chart - ${symbol}`,
        font: { size: 16 },
      },
      tooltip: {
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
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: { minute: 'HH:mm' },
          parser: 'yyyy-MM-dd HH:mm:ss',
        },
        title: { display: true, text: 'DateTime' },
      },
      y: {
        title: { display: true, text: 'Price' },
      },
    },
  };

  return (
    <div className="mt-6 rounded-xl border border-white/20 backdrop-blur-xl bg-white/60 p-2 shadow-[0px_3px_10px_rgba(0,0,0,0.2)]">
      <h2 className="my-3 text-gray-700 font-semibold p-4">
        {symbol} Candlestick Chart
      </h2>
      <Chart type="candlestick" data={chartData} options={chartOptions} />
    </div>
  );
};

export default FullCandlestickChart;
