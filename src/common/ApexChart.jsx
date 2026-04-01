import ReactApexChart from "react-apexcharts";

const ApexChart = ({ series = [], labels = [] }) => {
  const options = {
    chart: {
      type: "donut",
    },
    labels: labels,
    colors: ["#AEF6DE", "#B8C46B", "#203A43", "#FF6B6B", "#4D96FF"],
    legend: {
      position: "bottom",
      labels: {
        colors: "#ffffff",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="donut" />
    </div>
  );
};

export default ApexChart;