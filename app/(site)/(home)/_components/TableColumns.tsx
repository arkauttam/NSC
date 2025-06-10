import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown } from "react-icons/lu";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { StockValue } from "@/schemas/nse/nse-type";

ChartJS.register(...registerables);

// Define the type for the data used in the table
interface FinancialData {
  symbol: string;
  currency_base: string;
  type: string;
  datetime: string;
  open: string;
  close: string;
  volume: string;
}

const getHistoricalData = (
  symbol: string,
  datetime: string,
  dataMap: Record<string, { values: StockValue[] }>
) => {
  if (!dataMap[symbol]?.values) return [];
  return dataMap[symbol].values
    .filter((item) => new Date(item.datetime) <= new Date(datetime))
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
    .slice(-15);
};

export const TableColumns = (
  dataMap: Record<string, { values: StockValue[] }>
): ColumnDef<FinancialData>[] => [
  {
    accessorKey: "symbol",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-1"
      >
        Symbol
        <LuArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "currency_base",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-1"
      >
        Currency Base
      </Button>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-1"
      >
        Type
      </Button>
    ),
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-1"
      >
        DateTime
        <LuArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <p>
          {format(new Date(row.original.datetime), "LLL dd, yyyy HH:mm", {
            locale: enUS,
          })}
        </p>
      );
    },
  },
  {
    accessorKey: "open",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-1"
      >
        Open
      </Button>
    ),
    cell: ({ row }) => {
      return <p>{parseFloat(row.original.open).toFixed(4)}</p>;
    },
  },
  {
    accessorKey: "close",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-1"
      >
        Close
      </Button>
    ),
    cell: ({ row }) => {
      return <p>{parseFloat(row.original.close).toFixed(4)}</p>;
    },
  },
  {
    accessorKey: "volume",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-1"
      >
        Volume
        <LuArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "chart",
    header: "Trend",
    cell: ({ row }) => {
      const historicalData = getHistoricalData(
        row.original.symbol,
        row.original.datetime,
        dataMap
      );

      if (historicalData.length === 0) {
        return <p className="text-center text-gray-500">No data</p>;
      }

      const chartData = {
        labels: historicalData.map((item) =>
          format(new Date(item.datetime), "HH:mm")
        ),
        datasets: [
          {
            label: `${row.original.symbol} Close`,
            data: historicalData.map((item) => parseFloat(item.close)),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (ctx: any) => `Close: ${ctx.raw.toFixed(4)}`,
            },
          },
        },
      };

      return (
        <div className="h-16 w-24">
          <Line data={chartData} options={chartOptions} />
        </div>
      );
    },
  },
];