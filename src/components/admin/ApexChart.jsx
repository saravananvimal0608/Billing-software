import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ totalRevenue = 0, productCount = 0, categoryCount = 0 }) => {

    const series = [
        Math.round(totalRevenue / 1000),
        productCount,
        categoryCount
    ];

    const options = {
        chart: {
            type: 'donut',
        },
        labels: ['Revenue (k)', 'Products', 'Categories'],
        colors: ['#AEF6DE', '#B8C46B', '#203A43'],
        legend: {
            position: 'bottom',
            labels: {
                colors: '#ffffff'
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series}
                type="donut"
            />
        </div>
    );
}

export default ApexChart;