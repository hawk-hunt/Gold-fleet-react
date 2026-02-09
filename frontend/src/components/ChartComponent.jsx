import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function ChartComponent({ type = 'line', labels = [], datasets = [], options = {}, className = '' }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(ctx, {
      type,
      data: { labels, datasets },
      options: { responsive: true, maintainAspectRatio: false, ...options },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [type, labels, JSON.stringify(datasets), JSON.stringify(options)]);

  return (
    <div className={`w-full h-64 md:h-72 lg:h-[45vh] ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
