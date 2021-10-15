import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import { select, csv } from "d3";
import { dropdownMenu } from "./svgComponents/dropdownMenu";
import { scatterPlot } from "./svgComponents/scatterPlot";

export default function App() {
  const svgRef = useRef(null);
  const [data, setData] = useState(null);
  const [xColumn, setXColumn] = useState(null);
  const [yColumn, setYColumn] = useState(null);

  const loadCSVData = () => {
    csv("https://vizhub.com/curran/datasets/auto-mpg.csv").then(
      (loadedData) => {
        const myData = loadedData;
        myData.forEach((d) => {
          d.mpg = +d.mpg;
          d.cylinders = +d.cylinders;
          d.displacement = +d.displacement;
          d.horsepower = +d.horsepower;
          d.weight = +d.weight;
          d.acceleration = +d.acceleration;
          d.year = +d.year;
        });
        console.log(myData);
        setData(myData);
        setXColumn(myData.columns[4]);
        setYColumn(myData.columns[0]);
        // render();
      }
    );
  };

  const onXColumnClicked = (column) => {
    setXColumn(column);
    // render();
  };

  const onYColumnClicked = (column) => {
    setYColumn(column);
    // render();
  };

  const render = () => {
    const { width, height } = svgRef.current.getBoundingClientRect();

    const svg = select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    select("#x-menu").call(dropdownMenu, {
      options: data.columns,
      onOptionClicked: onXColumnClicked,
      selectedOption: xColumn
    });

    select("#y-menu").call(dropdownMenu, {
      options: data.columns,
      onOptionClicked: onYColumnClicked,
      selectedOption: yColumn
    });

    svg.call(scatterPlot, {
      xValue: (d) => d[xColumn],
      xAxisLabel: xColumn,
      yValue: (d) => d[yColumn],
      circleRadius: 10,
      yAxisLabel: yColumn,
      margin: { top: 10, right: 40, bottom: 88, left: 150 },
      width,
      height,
      data
    });
  };

  useEffect(() => {
    if (!data && !xColumn && !yColumn) {
      loadCSVData();
      return;
    }

    if (data && xColumn && yColumn) {
      render();
    }
  }, [data, xColumn, yColumn]);

  return (
    <div className="App">
      <div id="menus">
        <span id="y-menu"></span>
        vs.
        <span id="x-menu"></span>
      </div>
      <svg ref={svgRef} width="960" height="450"></svg>
    </div>
  );
}
