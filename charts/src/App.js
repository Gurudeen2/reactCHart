import React, { useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "./App.css";
import BarChart from "./charts/BarChart";
import { transformRawDataToPieChart } from "./dataHelper";
import DataTable from "./dataTable/DataTable";



function App({ makeData}) {
  let data = transformRawDataToPieChart(makeData)
  const [notSelectedLabels, setNotSelectedLabels] = useState([]);
  const myChart = useRef();
  const getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector("ul");
    if (!listContainer) {
      listContainer = document.createElement("ul");
      listContainer.style.display = "flex";
      listContainer.style.flexDirection = "column";
      listContainer.style.margin = 0;
      listContainer.style.padding = 0;
      legendContainer.appendChild(listContainer);
    }
    return listContainer;
  };
  const calculateTotal = () => {
    return data.datasets[0].data.reduce((a, b) => a + b, 0);
  }
  const labelUpdateCallback = (legendItems, item, firstTime) => {
    console.log("WORKING")
    let notSelected = [];
    // debugger
    legendItems.map((eachLabel, index) => {
      if (firstTime) {
        if (index !== item.index) {
          notSelected.push(legendItems[index].text);
        }
      } else {
        if (index === item.index) {
          if (!eachLabel.hidden) {
            notSelected.push(legendItems[index].text);
          }
        } else if (eachLabel.hidden) {
          notSelected.push(legendItems[index].text);
        }
      }
      return eachLabel;
    })
    if (legendItems.length === notSelected.length) {
      notSelected = []
    }
    setNotSelectedLabels(notSelected)
  }
  return (
    <div style={{ padding: 10, marginTop: 20 }}>
      <div style={{ display: "flex", flex: 1, justifyContent: 'space-between' }}>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', boxShadow: "1px 1px 1px 1px grey", padding: "5px", width: "48%" }}>
          <div style={{ width: "300px" }}>
            <h5>Operation Field Analysis</h5>
            <Doughnut
              ref={myChart}
              data={data}
              plugins={[
                {
                  id: "htmlLegend",
                  afterUpdate: (chart, args, options) => {
                    const ul = getOrCreateLegendList(chart, options.containerID);
                    while (ul.firstChild) {
                      ul.firstChild.remove();
                    }
                    // Reuse the built-in legendItems generator
                    const items = chart.options.plugins.legend.labels.generateLabels(chart);
                    let totalCalculate = calculateTotal()
                    items.forEach((item) => {
                      const li = document.createElement("li");
                      li.style.alignItems = "center";
                      li.style.cursor = "pointer";
                      li.style.display = "flex";
                      li.style.flexDirection = "row";
                      li.style.marginLeft = "10px";
                      li.style.marginBottom = "5px";
                      let legendItems = chart.legend.legendItems;
                      let count = 0;
                      let iValue = -1;
                      for (let i = 0; i < legendItems.length; i++) {
                        if (!legendItems[i].hidden) {
                          count = count + 1;
                          iValue = i;
                        }
                      }
                      let firstTime = count === legendItems.length ? true : false;
                      li.onclick = () => {
                        labelUpdateCallback(legendItems, item, firstTime)

                        const { type } = chart.config;
                        if (type === "pie" || type === "doughnut") {
                          for (let i = 0; i < legendItems.length; i++) {
                            if (firstTime) {
                              if (i !== item.index) {
                                chart.toggleDataVisibility(i);
                              }
                            }
                          }
                          if (!firstTime) {
                            chart.toggleDataVisibility(item.index);
                          }
                          if (count === 1 && iValue === item.index) {
                            for (let i = 0; i < legendItems.length; i++) {
                              chart.toggleDataVisibility(i);
                            }
                          }

                        }
                        chart.update();
                      };
                      // Color box
                      const boxSpan = document.createElement("span");
                      boxSpan.style.background = item.fillStyle;
                      boxSpan.style.borderColor = item.strokeStyle;
                      boxSpan.style.borderWidth = item.lineWidth + "px";
                      boxSpan.style.display = "inline-block";
                      boxSpan.style.height = "20px";
                      boxSpan.style.marginRight = "10px";
                      boxSpan.style.width = "20px";
                      // Text
                      let chartData = chart._metasets[0]._parsed;
                      const textContainer = document.createElement("p");
                      textContainer.style.color = item.fontColor;
                      textContainer.style.margin = 0;
                      textContainer.style.padding = 0;
                      textContainer.style.backgroundColor = firstTime ? item.hidden ? "red" : "" : item.hidden ? "" : "red";
                      textContainer.id = `label-${item.index}`
                      let text = ``;
                      let legends = chart.legend.legendItems;
                      let totalCount = 0;
                      for (let i = 0; i < legends.length; i++) {
                        if (!legends[i].hidden) {
                          totalCount += chartData[i];
                        } else {
                          let element = document.getElementById(`label-${i}`);
                          if (element) {
                            element.innerText = `${legends[i].text}: ${chartData[i]} (0%)`;
                          }
                        }
                      }
                      let percentage = totalCount === 0 ?
                        ((100 * (chartData[item.index] || 0)) / totalCalculate).toFixed(2) :
                        ((100 * (chartData[item.index] || 0)) / totalCount).toFixed(2)
                      text = document.createTextNode(`${item.text}: ${chartData[item.index]} (${percentage})%`)
                      textContainer.appendChild(text);
                      li.appendChild(boxSpan);
                      li.appendChild(textContainer);
                      ul.appendChild(li);
                    });
                  },
                }, {
                  beforeDraw(chart) {
                    var width = chart.width,
                      height = chart.height,
                      ctx = chart.ctx;
                    ctx.restore();
                    var fontSize = (height / 160).toFixed(2);
                    ctx.font = fontSize + "em sans-serif";
                    ctx.textBaseline = "top";
                    let chartData = myChart.current._metasets[0]._parsed;
                    let legends = myChart.current.legend.legendItems;
                    let totalCount = 0;
                    for (let i = 0; i < legends.length; i++) {
                      if (!legends[i].hidden) {
                        totalCount += chartData[i];
                      } else {
                        let element = document.getElementById(`label-${i}`);
                        if (element) {
                          element.innerText = `${legends[i].text}: ${chartData[i]} (0%)`;
                        }
                      }
                    }
                    var text = totalCount === 0 ? calculateTotal() : totalCount;
                    var textX = Math.round((width - ctx.measureText(text).width) / 2);
                    var textY = height / 2;
                    var text2 = 'Total';
                    var text2X = Math.round((width - ctx.measureText(text2).width) / 2);
                    var text2Y = height / 3;
                    ctx.fillText(text, textX, textY);
                    ctx.fillText(text2, text2X, text2Y);
                    ctx.save();
                  }
                }]}
              options={{
                plugins: {
                  htmlLegend: {
                    // ID of the container to put the legend in
                    containerID: "js-legend",
                  },

                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        let legends = myChart.current.legend.legendItems;
                        let chartData = myChart.current._metasets[0]._parsed;
                        let count = 0;
                        for (let i = 0; i < legends.length; i++) {
                          if (!legends[i].hidden) {
                            count += chartData[i];
                          }
                        }
                        let label = context.label || "";
                        let percentage = count === 0 ?
                          ((100 * (context.parsed || 0)) / calculateTotal()).toFixed(2) :
                          ((100 * (context.parsed || 0)) / count).toFixed(2)

                        label += `: ${context.parsed} (${percentage}%)`
                        return label;
                      },
                    },
                  },
                },
              }}
            />
          </div>
          <div id="js-legend" style={{ width: "250px" }} className="chart-legend"></div>
        </div>
        <div style={{ width: '51%', boxShadow: "1px 1px 1px 1px grey" }}>

          <h5>Operation Performed By Operator</h5>
          <DataTable notSelectedLabels={notSelectedLabels} makeData={makeData} />
        </div>
      </div>
      <div style={{ flex: 1, boxShadow: "1px 1px 1px 1px grey", padding: "5px", marginTop: "10px" }}>
        <h5>Weekly, Monthly And Yearly Analysis</h5>
        <BarChart notSelectedLabels={notSelectedLabels} makeData={makeData} />
        
      </div>
    </div>
  );
}

export default App;
