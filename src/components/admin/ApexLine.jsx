import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexLine = ({ userCount = 0, productCount = 0, categoryCount = 0 }) => {
    const [state] = React.useState({
        series: [
            {
                name: 'Users',
                data: [userCount]
            },
            {
                name: 'Products',
                data: [productCount]
            },
            {
                name: 'Categories',
                data: [categoryCount]
            }
        ],
        options: {
            chart: {
                height: 350,
                type: 'line',
            },
            stroke: {
                width: 5,
                curve: 'smooth'
            },
            colors: ['#AEF6DE', '#B8C46B', '#203A43'],
            xaxis: {
                categories: ['Count'],
                labels: {
                    style: {
                        colors: '#ffffff'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#ffffff'
                    }
                }
            },
            title: {
                text: 'Statistics Overview',
                align: 'left',
                style: {
                    fontSize: "16px",
                    color: '#ffffff'
                }
            },
            legend: {
                labels: {
                    colors: '#ffffff'
                }
            }
        },
    });

    return (
        <div>
            <div id="chart">
                <ReactApexChart 
                    options={state.options} 
                    series={[
                        { name: 'Users', data: [userCount] },
                        { name: 'Products', data: [productCount] },
                        { name: 'Categories', data: [categoryCount] }
                    ]} 
                    type="line" 
                    height={350} 
                />
            </div>
        </div>
    );
}
export default ApexLine