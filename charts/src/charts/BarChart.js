import React, { useState } from "react"
import { Bar } from "react-chartjs-2";
import { getMonthBarChartData, getWeekBarChartData, getYearBarChartData, getYearsBarChartData } from "../dataHelper";
const filters = {
    "Week": "Week",
    "Month": "Month",
    "Year": "Year",
    "10Years": "10Years"
}
const BarChart = ({ notSelectedLabels, makeData}) => {
    const [filterType, setFilterType] = useState(filters.Year)
    const getData = () => {
        let data = [];
        if (filterType === filters.Week) {
            data = getWeekBarChartData(notSelectedLabels, makeData || [])
        } else if (filterType === filters.Month) {
            data = getMonthBarChartData(notSelectedLabels, makeData || []);
           
        } else if (filterType === filters["10Years"]) {
            data = getYearsBarChartData(notSelectedLabels, makeData || [])
        } else {
            data = getYearBarChartData(notSelectedLabels, makeData || []);
        }
        return data;
    }

    const renderFilterBox = (text, type, selected) => {
        return (
            <button class={`btn ${selected ? 'active' : ''}`} onClick={() => setFilterType(type)}> {text}</button>
        )
    }

    let data = getData();
    console.log(data)
    return (
        <div style={{ marginTop: "1px", marginRight: "50px" }}>
          
            <div style={{ marginBottom: "5px", display: 'flex', flex: 1, justifyContent: 'space-around' }}>
                {renderFilterBox('7 Days Filter', filters.Week, filters.Week === filterType)}
                {renderFilterBox('30 Days Filter', filters.Month, filters.Month === filterType)}
                {renderFilterBox('Year Filter', filters.Year, filters.Year === filterType)}
                {renderFilterBox('Year Filter', filters["10Years"], filters["10Years"] === filterType)}
            </div>
            <Bar data={data} height={70} options={{

                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: {
                            display: true
                        }
                     
                    },
                    y: {
                        min: 0,
                        max: 10,
                        grid: {
                            display: true
                        }
                    }
                }
            }} />
        </div>
    )
}
export default BarChart;