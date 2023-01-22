import Highcharts, { AxisLabelsFormatterContextObject } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useRef, useState } from "react";
import JSONStats from "../stats.json";
import { NoData } from "./components/NoData";
import "./style.css";
import { DataType, SortBy, Stats } from "./types";
import { blue, green, orange } from "./utils/common";

const filters: SortBy[] = [
  "total",
  "alphabetical",
  "cycling",
  "running",
  "swimming",
];

const dataTypes: DataType[] = ["activity", "distance", "time", "drop"];

const dataTypeLabels: { [key in DataType]: string } = {
  activity: "Number of activities",
  distance: "Distance (km)",
  time: "Time (h)",
  drop: "Drop (m)",
};

const sortByLabels: { [key in SortBy]: React.ReactNode } = {
  total: "Total",
  alphabetical: "Alphabetical",
  cycling: (
    <span className="bullet-label">
      <div className="cyclingBackground bullet" />
      Cycling
    </span>
  ),
  running: (
    <span className="bullet-label">
      <div className="runningBackground bullet" />
      Running
    </span>
  ),
  swimming: (
    <span className="bullet-label">
      <div className="swimmingBackground bullet" />
      Swimming
    </span>
  ),
};

const Highchart: React.FC = () => {
  const [dataType, setDataType] = useState<DataType>("time");
  const [sortBy, setSortBy] = useState<SortBy>("total");
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const handleRadioChangeType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setDataType(value as DataType);
  };

  const handleRadioChangeSortBy = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setSortBy(value as SortBy);
  };

  const stats = JSONStats as Stats[];

  if (!stats) {
    return <NoData />;
  }

  // convert meter (swwimming) in kilometer
  const statsKm = stats.map((e) => ({
    ...e,
    activity: {
      ...e.activity,
      cycling: e.activity.cycling || 0,
      running: e.activity.running || 0,
      swimming: e.activity.swimming || 0,
    },
    time: {
      ...e.time,
      cycling: e.time.cycling || 0,
      running: e.time.running || 0,
      swimming: e.time.swimming || 0,
    },
    distance: {
      ...e.distance,
      cycling: e.distance.cycling || 0,
      running: e.distance.running || 0,
      swimming: e.distance.swimming / 1000 || 0,
    },
    drop: {
      ...e.drop,
      cycling: e.drop.cycling || 0,
      running: e.drop.running || 0,
      swimming: 0,
    },
  }));

  // descending order, sum cycling + running + swimming
  const getSortedStats = (stats: Stats[]) => {
    switch (sortBy) {
      case "total":
        return stats.sort(
          (a, b) =>
            b[dataType].cycling +
            b[dataType].running +
            b[dataType].swimming -
            (a[dataType].cycling + a[dataType].running + a[dataType].swimming)
        );
      case "alphabetical":
        return stats.sort((a, b) => a.name.localeCompare(b.name));
      case "cycling":
        return stats.sort((a, b) => b[dataType].cycling - a[dataType].cycling);
      case "running":
        return stats.sort((a, b) => b[dataType].running - a[dataType].running);
      case "swimming":
        return stats.sort(
          (a, b) => b[dataType].swimming - a[dataType].swimming
        );
    }
  };

  const sortedStats = getSortedStats([...statsKm]);

  const cyclingData = sortedStats.map((e) => e[dataType].cycling);
  const runningData = sortedStats.map((e) => e[dataType].running);
  const swimmingData = sortedStats.map((e) => e[dataType].swimming);

  const names = sortedStats.map((e) => e.name);

  //  Highcharts.Options
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Comparaison du volume d'entrainement des abonnés",
    },
    xAxis: {
      categories: names,
      labels: {
        useHTML: true,
        formatter: (ctx: AxisLabelsFormatterContextObject) => {
          return ctx.value === "Benoit GRASSET"
            ? `<strong class="me">${ctx.value}</strong>`
            : `<span>${ctx.value}</span>`;
        },
        style: {
          opacity: 1,
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: dataType,
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: "bold",
          color:
            // theme
            (Highcharts.defaultOptions.title?.style &&
              Highcharts.defaultOptions.title.style.color) ||
            "gray",
          textOutline: "none",
        },
      },
    },
    legend: {
      align: "left",
      x: 70,
      verticalAlign: "top",
      y: 70,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend?.backgroundColor || "white",
      borderColor: "#CCC",
      borderWidth: 1,
      shadow: false,
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{series.name}: {point.y}<br/>total: {point.stackTotal}",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
      },
    },
    credits: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 800,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
            plotOptions: {
              column: {
                dataLabels: {
                  enabled: false,
                },
              },
            },
          },
        },
      ],
    },
    series: [
      {
        name: "cycling",
        data: cyclingData,
        color: orange,
      },
      {
        name: "running",
        data: runningData,
        color: green,
      },
      {
        name: "swimming",
        data: swimmingData,
        color: blue,
      },
    ],
  };

  return (
    <div id="dashboard">
      <div className="options">
        <div className="radioButtonsContainer">
          <div className="radioButtons">
            <span>
              <b>Type of data:</b>
            </span>
            {dataTypes.map((value, index) => (
              <>
                <input
                  type="radio"
                  id={value}
                  name="dataType"
                  value={value}
                  checked={dataType === value}
                  onChange={handleRadioChangeType}
                  key={`input-${index}`}
                />
                <label htmlFor={value} key={`label-${index}`}>
                  {dataTypeLabels[value]}
                </label>
              </>
            ))}
          </div>
          <div className="radioButtons">
            <span>
              <b>Sort by:</b>
            </span>
            {filters.map((value, index) => (
              <>
                <input
                  type="radio"
                  id={value}
                  name="filter"
                  value={value}
                  checked={sortBy === value}
                  onChange={handleRadioChangeSortBy}
                  key={`input-${index}`}
                />
                <label htmlFor={value} key={`label-${index}`} className={value}>
                  {sortByLabels[value]}
                </label>
              </>
            ))}
          </div>
        </div>
      </div>

      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
        containerProps={{ className: "chartContainer" }}
      />
    </div>
  );
};

export default Highchart;
