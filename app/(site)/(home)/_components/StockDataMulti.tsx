import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { SymbolData } from "@/schemas/nse/nse-type";
import { DataTable } from "./DataTable";
import { TableColumns } from "./TableColumns";
import Container from "@/components/Container";
import FullCandlestickChart from "./FullCandlestickChart";

ChartJS.register(
  TimeScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

const symbols = ["AAPL", "EUR/USD", "ETH/BTC"];

const StockDataMulti = () => {
  const [dataMap, setDataMap] = useState<Record<string, SymbolData>>({});
  const [error, setError] = useState<string | null>(null);
  const [mergedData, setMergedData] = useState<
    Array<{
      symbol: string;
      currency_base: string;
      type: string;
      datetime: string;
      open: string;
      close: string;
      volume: string;
    }>
  >([]);

  const API_KEY = process.env.REACT_APP_TWELVE_DATA_API_KEY || "85dcb5c2237d4691ae8b8318fb97c9b7";
  const API_URL = `https://api.twelvedata.com/time_series?symbol=${symbols
    .map(encodeURIComponent)
    .join(",")}&interval=1min&outputsize=40&apikey=${API_KEY}`;

  const fetchStockData = async () => {
    try {
      const response = await axios.get(API_URL);
      const responseData = response.data;

      const newDataMap: Record<string, SymbolData> = {};
      const newMergedData: Array<{
        symbol: string;
        currency_base: string;
        type: string;
        datetime: string;
        open: string;
        close: string;
        volume: string;
      }> = [];

      for (const symbol of symbols) {
        if (responseData[symbol]?.status === "ok") {
          newDataMap[symbol] = responseData[symbol];
          const meta = responseData[symbol].meta;
          const firstValue = responseData[symbol].values[0];
          if (firstValue) {
            newMergedData.push({
              symbol,
              currency_base: meta.currency_base || meta.currency || "—",
              type: meta.type || "—",
              datetime: firstValue.datetime,
              open: firstValue.open,
              close: firstValue.close,
              volume: firstValue.volume || "—",
            });
          }
        } else {
          setError(responseData[symbol]?.message || `Error loading ${symbol}`);
        }
      }

      setDataMap(newDataMap);
      setMergedData(
        newMergedData.sort(
          (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        )
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Container>
      <div className="text-2xl font-bold mb-6 text-center my-8">
        <h2 className="text-gray-700">Live NSE Financial Data</h2>
      </div>

      {/* Merged Table */}
      <div className="mt-6 rounded-xl border border-white/20 backdrop-blur-xl bg-white/60 p-2 shadow-[0px_3px_10px_rgba(0,0,0,0.2)]">
        <h2 className="my-3 text-gray-700 font-semibold p-4">Latest Financial Data</h2>
        <DataTable data={mergedData} columns={TableColumns(dataMap)} dataMap={dataMap} />
      </div>

      {/* Candlestick Charts */}
      {symbols.map((symbol) =>
        dataMap[symbol] ? (
          <div key={symbol} className="mb-8">
            <FullCandlestickChart symbol={symbol} data={dataMap[symbol].values} />
          </div>
        ) : (
          <Card key={symbol} className="mb-8">
            <CardContent className="text-center p-4">
              Loading {symbol}...
            </CardContent>
          </Card>
        )
      )}
    </Container>
  );
};

export default StockDataMulti;