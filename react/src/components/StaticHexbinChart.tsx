import { useEffect, useRef, useState } from "react";
import { Paper, Grid, Switch, Stack, Typography } from "@mui/material";
import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import { mesh } from "topojson-client";
import { legend } from "./ColorLegend";
import us from "us-atlas/states-albers-10m.json";
import { isEmpty } from "lodash-es";
import { colorDict } from "./ColorPalette";

import { VerticalPropertyPanel } from "./VerticalPropertyPanel";

import { styled } from "@mui/material/styles";

import { monthNames } from "./Options";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "primary",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

// Based on Hexbin Chart from Observable, attribution below
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/hexbin-map

// Constant values for scaling, aspectRatio, etc.
const width = 975;
const height = 610;
const stdMargin = 30;

const myHexbin = hexbin()
  .extent([
    [0, 0],
    [width, height],
  ])
  .radius(10);

const tickExtremes: { [key: string]: string[] | number[] } = {
  rating: ["Failed", "Excellent"],
  percent_poor: ["None in poor condition (%)", "All in poor condition (%)"],
  year_built: [1900, 2022],
  repair_cost_per_foot: ["$1,000", "$100,000"],
};

const getInterestValue = (plotType: string, hexValues: any) => {
  if (plotType === "percent_poor") {
    const histogram = hexValues.objHistogram;
    const numPoor =
      histogram[0].count +
      histogram[1].count +
      histogram[2].count +
      histogram[3].count +
      histogram[4].count;
    return Math.round((numPoor / hexValues.count) * 100);
  } else if (plotType === "future_date_of_inspection") {
    return hexValues.objKeyValues.mode;
  } else if (plotType === "average_daily_traffic || truck_traffic") {
    return hexValues.objKeyValues.avg;
  } else {
    return hexValues.objKeyValues.median;
  }
};

const getHexSize = (hexSize: number, radius: any, count: number) => {
  if (hexSize) {
    return d3.max([radius(count), 2]);
  } else {
    return 10;
  }
};

const getRadius = (hexBin: any) => {
  return d3.scaleSqrt(
    [0, d3.max(hexBin, (d: any) => d.count)],
    [0, myHexbin.radius() * Math.SQRT2]
  );
};

const getAttribution = (svg: any) => {
  if (!document.getElementById("attributionContainer")) {
    svg.append("g").attr("id", "attributionContainer");
  }
  return svg.select("#attributionContainer");
};

export const StaticHexbinChart: React.FC<{
  bridgeData: any;
  plotType: string;
  submitted: boolean;
}> = ({ bridgeData, plotType, submitted }) => {
  const [activeHex, setActiveHex] = useState({});
  const [totalValues, setTotalValues] = useState({});
  const [hexSelected, setHexSelected] = useState(false);
  const [hexSize, setHexSize] = useState(true);

  const d3Container = useRef(null);

  const handleSwitchChange = (event: any) => {
    setHexSize(!hexSize);
  };

  useEffect(() => {
    if (!isEmpty(bridgeData) && !submitted) {
      setTotalValues(bridgeData.totalValues);
    }
  }, [bridgeData]);

  useEffect(() => {
    if (!isEmpty(bridgeData) && d3Container.current && !submitted) {
      const svg = d3.select(d3Container.current);
      const hexBridge = {
        hexBin: bridgeData.hexBin,
        totalValues: bridgeData.totalValues,
      };

      const radius = getRadius(hexBridge.hexBin);
      const color = colorDict[plotType];

      const getLegend = () => {
        if (!document.getElementById("legendContainer")) {
          svg.append("g").attr("id", "legendContainer");
        }
        return svg.select("#legendContainer");
      };

      const legendNode = getLegend();
      legendNode.select("#legend").remove();

      // every other tick value
      const tickFormatting = (interval: any, i: any) => {
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
        .attr("transform", `translate(${0.6 * width}, ${stdMargin - 10})`)
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

      const getHex = () => {
        if (!document.getElementById("hexes")) {
          svg.append("g").attr("id", "hexes");
        }
        return svg.select("#hexes");
      };
      const hexNode = getHex();

      const hexBool = hexSize;

      // add hexes
      hexNode
        .selectAll("path")
        .data(hexBridge.hexBin)
        .join("path")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
        .attr("d", (d) =>
          myHexbin.hexagon(getHexSize(hexBool, radius, d.count))
        )
        .attr("fill", (d) => color(getInterestValue(plotType, d)))
        .attr("stroke", (d) =>
          d3.lab(color(getInterestValue(plotType, d))).darker()
        )
        .attr("stroke-width", "0.1em")
        .on("mouseover", function (event, d) {
          let data = d3.select(this).data()[0];
          // if (!heightCheck) {

          //   console.log("short");
          // }
          setActiveHex(data);
          setHexSelected(true);
          d3.select(this)
            .raise()
            .transition()
            .duration(200)
            .attr("d", (d) =>
              myHexbin.hexagon(d3.max([radius(d.count) * 1.5, 15]))
            )
            .attr("stroke-width", "0.2em");
        })
        .on("mouseout", function (event, d) {
          setHexSelected(false);
          d3.select(this)
            .transition()
            .duration(200)
            .attr("d", (d) =>
              myHexbin.hexagon(getHexSize(hexBool, radius, d.count))
            )
            .attr("stroke-width", "0.1em");
        });

      //add attribution
      const attrNode = getAttribution(svg);
      attrNode.select("#attribution").remove();

      attrNode
        .attr(
          "transform",
          `translate(${0.53 * width}, ${height - (stdMargin - 20)})`
        )
        .raise()
        .append("g")
        .attr("id", "attribution")
        .append("text")
        .attr("stroke", "#d3d3d3")
        .append("svg:a")
        .attr("xlink:href", "https://twitter.com/eng_mclare")
        .text("www.bridge.watch @eng_mclare");
    }
  }, [bridgeData, hexSize, plotType]);

  return (
    <Grid item container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ padding: [2, 2, 3], minHeight: { xs: 0, md: 600 } }}>
          <Grid container>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <AntSwitch
                  checked={hexSize}
                  onChange={handleSwitchChange}
                  inputProps={{ "aria-label": "ant design" }}
                />
                <Typography variant="caption">Scaled hex area</Typography>
              </Stack>
            </Grid>
          </Grid>
          <svg
            className="d3-component"
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            ref={d3Container}
          >
            <path
              fill="none"
              transform="translate(0, 0)"
              stroke="#777"
              strokeWidth="0.5"
              strokeLinejoin="round"
              d={d3.geoPath()(mesh(us, us.objects.states))}
            />
          </svg>
          <Typography style={{ textAlign: "center" }} variant="h6">
            Hover or click each hex to update the histogram.
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <VerticalPropertyPanel
          objSelected={hexSelected}
          objData={activeHex}
          initialHistData={totalValues}
          initialKeyData={bridgeData.keyData}
          field={bridgeData.field}
        />
      </Grid>
    </Grid>
  );
};
