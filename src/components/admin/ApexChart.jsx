import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ userCount = 0, productCount = 0, categoryCount = 0 }) => {
    const [state] = React.useState({
        series: [userCount, productCount, categoryCount],
        options: {
            chart: {
                type: 'donut',
            },
            labels: ['Users', 'Products', 'Categories'],
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
        },
    });

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={state.options} series={[userCount, productCount, categoryCount]} type="donut" />
            </div>
        </div>
    );
}
export default ApexChart