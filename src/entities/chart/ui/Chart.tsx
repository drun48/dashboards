import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  LineElement,
  Legend,
  Tooltip,
  PointElement,
} from "chart.js";
import { useMemo } from "react";
import { Chart as ChartEl } from "react-chartjs-2";

enum TypeChart {
  bar,
  line,
  pie,
  doughnut,
}

type Data = {
  lable?: string;
  data: string[] | number[];
  borderColor?: string;
  backgroundColor?: string;
  order?: number;
  type: TypeChart | keyof typeof TypeChart;
};

type Props = {
  labels: string[];
  data: Data[];
  showLegend?: boolean;
  title?: string;
};

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
);

export const Chart = ({ labels, data, showLegend, title }: Props) => {
  const dataSource = useMemo(
    () => ({
      labels,
      datasets: data,
    }),
    [labels, data],
  );
  return (
    <ChartEl
      data={dataSource}
      updateMode="none"
      options={{
        responsive: true,
        maintainAspectRatio: false,
        transitions: {
          resize: {
            animation: {
              duration: 0,
            },
          },
        },
      }}
    />
  );
};
