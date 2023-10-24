import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { LayerSpecification } from "maplibre-gl";
import { Point } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../styles/Home.module.css";
import maptiler3dGl from "../assets/maptiler-3d-gl-style.json";

const colorMap: Map<string, string> = new Map([
  ["0", "#a50026"],
  ["1", "#be1827"],
  ["2", "#d73027"],
  ["3", "#f46d43"],
  ["4", "#fdae61"],
  ["5", "#fee090"],
  ["6", "#ffffbf"],
  ["7", "#e0f3f8"],
  ["8", "#74add1"],
  ["9", "#313695"],
  ["N", "#FFFFFF"],
  ["NULL", "#FFFFFF"],
]);

function createDonutChart(lowestRatings: string) {
  const offsets: number[] = [];
  const rawData: string[] = lowestRatings.split(",");
  const processedData: { [key: string]: number } = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
  };
  for (const point of rawData) {
    if (processedData[point] === undefined) {
      continue;
    } else {
      processedData[point] += 1;
    }
  }
  let total = 0;
  let keys = Object.keys(processedData);
  for (let i = 0; i < keys.length; i++) {
    offsets.push(total);
    total += processedData[keys[i]];
  }

  const fontSize =
    total > 10000
      ? 20
      : total >= 1000
      ? 18
      : total >= 100
      ? 18
      : total >= 10
      ? 14
      : 10;
  const radius =
    total > 10000
      ? 65
      : total >= 1000
      ? 50
      : total >= 100
      ? 30
      : total >= 10
      ? 20
      : 12;
  const r0 = Math.round(radius * 0.6);
  const w = radius * 2;

  let html =
    '<div><svg width="' +
    w +
    '" height="' +
    w +
    '" viewbox="0 0 ' +
    w +
    " " +
    w +
    '" text-anchor="middle" style="font: ' +
    fontSize +
    'px sans-serif; display: block">';

  const processedArray = Object.entries(processedData);
  for (let i = 0; i < processedArray.length; i++) {
    html += donutSegment(
      offsets[i] / total,
      (offsets[i] + processedArray[i][1]) / total,
      radius,
      r0,
      Array.from(colorMap.values())[i]
    );
  }

  html +=
    '<circle cx="' +
    radius +
    '" cy="' +
    radius +
    '" r="' +
    r0 +
    '" fill="white" opacity="0.7"/><text font-family="Noto Sans" font-weight=700 dominant-baseline="central" transform="translate(' +
    radius +
    ", " +
    radius +
    ')">' +
    total.toLocaleString() +
    "</text></svg></div>";

  const el = document.createElement("div");
  el.innerHTML = html;
  return el.firstChild;
}

function donutSegment(
  start: number,
  end: number,
  r: number,
  r0: number,
  color: string
) {
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0);
  const y0 = Math.sin(a0);
  const x1 = Math.cos(a1);
  const y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  return [
    '<path d="M',
    r + r0 * x0,
    r + r0 * y0,
    "L",
    r + r * x0,
    r + r * y0,
    "A",
    r,
    r,
    0,
    largeArc,
    1,
    r + r * x1,
    r + r * y1,
    "L",
    r + r0 * x1,
    r + r0 * y1,
    "A",
    r0,
    r0,
    0,
    largeArc,
    0,
    r + r0 * x0,
    r + r0 * y0,
    '" fill="' + color + '" opacity="0.7"/>',
  ].join(" ");
}

function MaplibreMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapFile = new PMTiles("/us.pmtiles");
  const bridgeMapFile = new PMTiles("/bridges_2022_clustered.pmtiles");

  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    protocol.add(mapFile);
    protocol.add(bridgeMapFile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      center: [-95.712891, 39.09024],
      pitch: 0,
      zoom: 4,
      maxBounds: [
        [-178, 10],
        [-50, 80],
      ],
      minZoom: 4,
      maxZoom: 17,
      maplibreLogo: true,
      logoPosition: "bottom-left",
      style: {
        version: 8,
        sources: {
          openmaptiles: {
            type: "vector",
            tiles: ["pmtiles://" + mapFile.source.getKey() + "/{z}/{x}/{y}"],
            minzoom: 4,
            maxzoom: 14,
          },
          bridgemaptiles: {
            type: "vector",
            tiles: [
              "pmtiles://" + bridgeMapFile.source.getKey() + "/{z}/{x}/{y}",
            ],
            minzoom: 4,
            maxzoom: 16,
          },
        },
        layers: maptiler3dGl.layers as LayerSpecification[],
        glyphs: "/{fontstack}/{range}.pbf",
      },
    });
    mapRef.current = map;

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: `<a href="https://protomaps.com">Protomaps</a> | <a href="https://openmaptiles.org">© OpenMapTiles</a> | <a href="http://www.openstreetmap.org/copyright"> © OpenStreetMap contributors</a>`,
      }),
      "bottom-left"
    );
    map.addControl(new maplibregl.NavigationControl({}), "bottom-right");

    map.on("load", function () {
      map.resize();

      let markers = {} as any;
      let markersOnScreen = {} as any;

      function updateMarkers() {
        const newMarkers = {} as any;
        const features = map.querySourceFeatures("bridgemaptiles", {
          sourceLayer: "bridgeSeries_cluster",
        });
        for (let i = 0; i < features.length; i++) {
          const point = features[i].geometry as Point;
          const coords = point.coordinates as [number, number];
          const props = features[i].properties;
          let marker;
          if (!props.clustered) continue;
          const id = props.features + "-" + props.point_count.toString();
          marker = markers[id];
          if (!marker) {
            const el = createDonutChart(props.lowest_rating);
            marker = markers[id] = new maplibregl.Marker({
              element: el as HTMLElement,
            }).setLngLat(coords);
          }
          newMarkers[id] = marker;
          if (id && marker && !markersOnScreen[id]) marker.addTo(map);
        }

        for (const id in markersOnScreen) {
          if (!newMarkers[id]) markersOnScreen[id].remove();
        }
        markersOnScreen = newMarkers;
      }

      updateMarkers();

      map.on("move", updateMarkers);
      map.on("moveEnd", updateMarkers);
    });

    return () => {
      map.remove();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div ref={mapContainerRef} className={styles.mapContainer}>
        <div ref={mapContainerRef}></div>
      </div>
    </>
  );
}

export default MaplibreMap;
