import ReactApexChart from "react-apexcharts";

const ApexLine = ({ series = [], categories = [], title = "Statistics" }) => {
  const options = {
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: 5,
      curve: "smooth",
    },
    colors: ["#AEF6DE", "#B8C46B", "#203A43", "#FF6B6B"],
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    title: {
      text: title,
      align: "left",
      style: {
        fontSize: "16px",
        color: "#ffffff",
      },
    },
    legend: {
      labels: {
        colors: "#ffffff",
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

export default ApexLine;