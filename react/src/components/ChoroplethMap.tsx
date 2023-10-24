import { useEffect, useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";

import * as d3 from "d3";
import { feature } from "topojson-client";
import { legend } from "./ColorLegend";
import us from "us-atlas/counties-albers-10m.json";
import { isEmpty } from "lodash-es";
import { colorDict } from "./ColorPalette";
import { HorizontalPropertyPanel } from "./HorizontalPropertyPanel";

import { stateOptions, monthNames } from "./Options";

// Based on Choropleth Chart from Observable, attribution below
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/choropleth

// Constant values for scaling, aspectRatio, etc.
const width = 975;
const height = 610;
const stdMargin = 30;

const tickExtremes: { [key: string]: string[] | number[] } = {
  rating: ["Failed", "Excellent"],
  percent_poor: ["None in poor condition (%)", "All in poor condition (%)"],
  year_built: [1900, 2022],
  repair_cost_per_foot: ["$1,000", "$100,000"],
};

const getInterestValue = (plotType: string, countyValues: any) => {
  if (plotType === "percent_poor") {
    const histogram = countyValues.objHistogram;
    const numPoor =
      histogram[0].count +
      histogram[1].count +
      histogram[2].count +
      histogram[3].count +
      histogram[4].count;
    const value = Math.round((numPoor / countyValues.count) * 100);
    const stringDescription = "Rated below 4: " + value + "%";
    return { stringDescription: stringDescription, value: value };
  } else if (plotType === "future_date_of_inspection") {
    const value = countyValues.objKeyValues.mode;
    const stringDescription =
      "Most common value: " +
      monthNames[value.getUTCMonth()] +
      "-" +
      value.getUTCFullYear();
    return { stringDescription: stringDescription, value: value };
  } else if (
    plotType === "average_daily_traffic" ||
    plotType === "truck_traffic"
  ) {
    const value = Math.round(countyValues.objKeyValues.avg);
    const stringDescription = "Average value: " + value;
    return { stringDescription: stringDescription, value: value };
  } else {
    return {
      stringDescription: `Median value: ${Math.round(
        countyValues.objKeyValues.median
      )}`,
      value: countyValues.objKeyValues.median,
    };
  }
};

function getSelectedStates(states: any, us: any) {
  // deep copy object to avoid overwriting it
  const newStates = JSON.parse(JSON.stringify(us));
  newStates.objects.states.geometries =
    newStates.objects.states.geometries.filter(function (d) {
      return states.includes(d.id.slice(0, 2));
    });
  newStates.objects.counties.geometries =
    newStates.objects.counties.geometries.filter(function (d) {
      return states.includes(d.id.slice(0, 2));
    });
  return newStates;
}

const getNodeById = (svg: any, id: string) => {
  if (svg.select("#" + id).empty()) {
    svg.append("g").attr("id", id);
  }
  return svg.select("#" + id);
};

export const ChoroplethMap: React.FC<{
  bridgeCountyData: any;
  displayStates: any;
  plotType: string;
  submitted: boolean;
}> = ({ bridgeCountyData, displayStates, plotType, submitted }) => {
  const [activeCounty, setActiveCounty] = useState<any>({});
  const [totalValues, setTotalValues] = useState<any>({});
  const [countySelected, setCountySelected] = useState<boolean>(false);
  const [titleSelected, setTitleSelected] = useState<string | string[]>("");
  const d3Container = useRef(null);

  const svg = d3.select(d3Container.current);
  const plotHeight = 600;

  useEffect(() => {
    if (!isEmpty(bridgeCountyData)) {
      setTotalValues(bridgeCountyData.totalValues);
    }
  }, [bridgeCountyData]);

  // Create county outline regardless of whether data exists or not
  useEffect(() => {
    if (displayStates.length !== 0 && !submitted) {
      const svg = d3.select(d3Container.current);

      const fipsStates = displayStates.map((d: string) => stateOptions[d]);
      const selectedStates = getSelectedStates(fipsStates, us);

      const selectedCounties = feature(
        selectedStates,
        selectedStates.objects.counties
      );
      const projection = d3.geoIdentity().fitExtent(
        [
          [stdMargin, stdMargin, stdMargin, stdMargin + 20],
          [width - stdMargin, height - stdMargin - 20],
        ],
        selectedCounties
      );
      const path = d3.geoPath(projection);

      const svgCounties = getNodeById(svg, "AllCounties");

      svgCounties
        .selectAll("path")
        .data(selectedCounties.features)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", "#777")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
    } else {
      const svg = d3.select(d3Container.current);
      const svgCounties = getNodeById(svg, "AllCounties");
      svg.remove(svgCounties);
    }
  }, [bridgeCountyData]);

  useEffect(() => {
    if (!isEmpty(bridgeCountyData) && d3Container.current && !submitted) {
      setTitleSelected(displayStates.sort());
    }
  }, [bridgeCountyData]);

  useEffect(() => {
    if (!isEmpty(bridgeCountyData) && d3Container.current && !submitted) {
      const svg = d3.select(d3Container.current);
      const color = colorDict[plotType];

      const fipsStates = displayStates.map((d) => stateOptions[d]);
      const selectedStates = getSelectedStates(fipsStates, us);

      const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .attr("class", "tooltip")
        .style("visibility", "hidden")
        .style("font-family", "Noto Sans")
        .style("font-size", "0.8rem");

      const selectedCounties = feature(
        selectedStates,
        selectedStates.objects.counties
      );
      const projection = d3.geoIdentity().fitExtent(
        [
          [stdMargin, stdMargin, stdMargin, stdMargin + 20],
          [width - stdMargin, height - stdMargin - 20],
        ],
        selectedCounties
      );
      const path = d3.geoPath(projection);

      // merge data array with geometry array
      let countyMerged = [];
      for (let i = 0; i < bridgeCountyData.countyBin.length; i++) {
        countyMerged.push({
          ...bridgeCountyData.countyBin[i],
          ...selectedCounties.features.find(
            (itmInner: any) =>
              itmInner.id === bridgeCountyData.countyBin[i].fips
          ),
        });
      }

      // add legend
      // const legendNode = getLegend(svg);
      const legendNode = getNodeById(svg, "LegendContainer");
      legendNode.select("#legend").remove();

      // every other tick value
      const tickFormatting = (interval: any, i: number) => {
        let modInterval;
        if (plotType === "future_date_of_inspection") {
          let modDate = new Date(interval);
          modInterval =
            monthNames[modDate.getMonth()] + "-" + modDate.getFullYear();
        } else {
          modInterval = interval;
        }
        return i % 2 !== 0 ? " " : modInterval;
      };

      legendNode
        .attr(
          "transform",
          `translate(${0.35 * width}, ${height - stdMargin - 10})`
        )
        .append(() =>
          legend({
            color: color,
            width: width * 0.3,
            tickFormat: tickFormatting,
            tickSize: 0,
            ticks: 8,
            tickExtremes: tickExtremes[plotType],
          })
        );

      // add counties with data
      // const svgCounties = getCountyNode(svg);
      const svgCounties = getNodeById(svg, "Counties");

      svgCounties
        .selectAll("path")
        .data(countyMerged)
        .join("path")
        .attr("fill", (d) => color(getInterestValue(plotType, d).value))
        .attr("stroke", "#000")
        .attr("stroke-width", "0.05em")
        .attr("stroke-linejoin", "round")
        .attr("d", path)
        .on("mouseover", function (e: any, d: any) {
          tooltip
            .style("visibility", "visible")
            .html(
              `${d.properties.name}<br>${
                getInterestValue(plotType, d).stringDescription
              }`
            );
          let data = d3.select(this).data()[0];
          setActiveCounty(data);
          setCountySelected(true);
          d3.select(this)
            .raise()
            .transition()
            .duration(200)
            .attr("stroke-width", "0.25em")
            .attr("stroke", "#fff");
        })
        .on("mousemove", function (e: any, d: any) {
          return tooltip
            .style("top", e.pageY - 20 + "px")
            .style("left", e.pageX + 20 + "px");
        })
        .on("mouseout", function (e: any, d: any) {
          tooltip.style("visibility", "hidden");
          setCountySelected(false);
          d3.select(this)
            .transition()
            .duration(200)
            .attr("stroke-width", "0.05em")
            .attr("stroke", "#000");
        });

      //add attribution
      const attrNode = getNodeById(svg, "AttributionContainer");
      attrNode.select("#attribution").remove();

      attrNode
        .attr(
          "transform",
          `translate(${0.7 * width}, ${height - stdMargin - 20})`
        )
        .raise()
        .append("g")
        .attr("id", "attribution")
        .append("text")
        .attr("stroke", "#d3d3d3")
        .append("svg:a")
        .attr("xlink:href", "https://twitter.com/eng_mclare")
        .text("www.bridge.watch @eng_mclare");
    } else if (displayStates.length === 0) {
      const svg = d3.select(d3Container.current);
      const svgCounties = getNodeById(svg, "Counties");
      svg.remove(svgCounties);
    }
  }, [bridgeCountyData, plotType]);

  let title;
  if (Array.isArray(titleSelected) && titleSelected.length > 1) {
    title = [
      titleSelected.slice(0, -1).join(", "),
      titleSelected.slice(-1)[0],
    ].join(titleSelected.length < 2 ? "" : " and ");
  } else if (titleSelected.length === 1) {
    title = titleSelected;
  }

  return (
    <>
      {displayStates.length !== 0 && !isEmpty(bridgeCountyData) ? (
        <>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
          </Grid>
          <Grid item sx={{ textAlign: "center", paddingTop: "0px" }} xs={12}>
            <Typography variant="h6">
              Hover or click each county to update the histogram.
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ paddingTop: "0px" }}>
            <svg
              className="d3-component"
              viewBox={`0 0 ${width} ${height}`}
              ref={d3Container}
            ></svg>
          </Grid>

          <Grid item xs={12}>
            <HorizontalPropertyPanel
              objSelected={countySelected}
              objData={activeCounty}
              initialHistData={totalValues}
              initialKeyData={bridgeCountyData.keyData}
              field={bridgeCountyData.field}
            />
          </Grid>
        </>
      ) : null}
    </>
  );
};
