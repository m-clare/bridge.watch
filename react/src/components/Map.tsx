import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import Box from "@mui/material/Box";
import { PMTiles, Protocol } from "pmtiles";
import { LayerSpecification } from "maplibre-gl";
import { HUD } from "./HUD";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../styles/Home.module.css";
import maptiler3dGl from "../assets/maptiler-3d-gl-style.json";
import hexbins from "../assets/bridges2023hexes.json";
import MapLegend from "./MapLegend";
import { GeocodingControl } from "@maptiler/geocoding-control/react";
import { createMapLibreGlMapController } from "@maptiler/geocoding-control/maplibregl-controller";
import type { MapController } from "@maptiler/geocoding-control/types";
import "@maptiler/geocoding-control/style.css";

const API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

function MaplibreMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState({});
  const [hudVisible, setHudVisible] = useState(false);
  const [mapController, setMapController] = useState<MapController>();
  const mapFile = new PMTiles("/us.pmtiles");
  const bridgeMapFile = new PMTiles("/bridges2023.pmtiles");

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    protocol.add(mapFile);
    protocol.add(bridgeMapFile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      center: [-95.712891, 33.09024],
      pitch: 30,
      zoom: 4,
      maxBounds: [
        [-200, 10],
        [-50, 71.5],
      ],
      maxPitch: 30,
      minZoom: 4,
      maxZoom: 14.9,
      maplibreLogo: true,
      logoPosition: "bottom-left",
      style: {
        version: 8,
        sources: {
          openmaptiles: {
            type: "vector",
            tiles: ["pmtiles://" + mapFile.source.getKey() + "/{z}/{x}/{y}"],
            minzoom: 4,
            maxzoom: 15,
          },
          bridgemaptiles: {
            type: "vector",
            tiles: [
              "pmtiles://" + bridgeMapFile.source.getKey() + "/{z}/{x}/{y}",
            ],
            minzoom: 4,
            maxzoom: 15,
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
    map.addControl(new maplibregl.NavigationControl({}), "top-right");
    setMapController(createMapLibreGlMapController(map, maplibregl));

    map.on("load", function () {
      map.resize();

      map.addSource("hexes", {
        type: "geojson",
        data: hexbins,
      });

      map.addLayer({
        id: "bridges_2023",
        type: "circle",
        source: "bridgemaptiles",
        "source-layer": "bridges_2023",
        minzoom: 10,
        paint: {
          "circle-color": [
            "match",
            ["get", "lowest_rating"],
            "0",
            "#a50026",
            "1",
            "#be1827",
            "2",
            "#d73027",
            "3",
            "#f46d43",
            "4",
            "#fdae61",
            "5",
            "#fee090",
            "6",
            "#ffffbf",
            "7",
            "#e0f3f8",
            "8",
            "#74add1",
            "9",
            "#313695",
            "#FFFFFF",
          ],
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 2, 16, 8],
        },
        filter: ["==", ["geometry-type"], "Point"],
      });
      map.addLayer({
        id: "hexbins",
        type: "fill-extrusion",
        source: "hexes",
        maxzoom: 10,
        paint: {
          // See the MapLibre Style Specification for details on data expressions.
          // https://maplibre.org/maplibre-style-spec/expressions/

          // Get the fill-extrusion-color from the source 'color' property.
          "fill-extrusion-color": [
            "match",
            ["get", "rating"],
            0,
            "#a50026",
            1,
            "#be1827",
            2,
            "#d73027",
            3,
            "#f46d43",
            4,
            "#fdae61",
            5,
            "#fee090",
            6,
            "#ffffbf",
            7,
            "#e0f3f8",
            8,
            "#74add1",
            9,
            "#313695",
            "#FFFFFF",
          ],

          // Get fill-extrusion-height from the source 'height' property.
          "fill-extrusion-height": ["*", ["get", "height"], 100],

          // Get fill-extrusion-base from the source 'base_height' property.
          "fill-extrusion-base": ["get", "base_height"],

          "fill-extrusion-opacity": 0.8,
        },
      });
    });

    map.on("click", function (e) {
      const features = map.queryRenderedFeatures(e.point);
      const feature =
        features.filter(
          (feature) => feature?.sourceLayer === "bridges_2023"
        )[0] ?? null;
      if (feature) {
        setSelectedMarkerData(feature.properties);
        setHudVisible(true);
      } else {
        setSelectedMarkerData({});
        setHudVisible(false);
      }
    });
  }, []);

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <div ref={mapContainerRef} className={styles.mapContainer}>
        {hudVisible && <HUD data={selectedMarkerData} />}
      </div>
      <div
        className="geocoding"
        style={{
          position: "absolute",
          top: "108px",
          right: "48px",
        }}
      >
        <GeocodingControl
          apiKey={API_KEY}
          mapController={mapController}
          debounceSearch={1000}
        />
      </div>
      <MapLegend />
    </Box>
  );
}

export default MaplibreMap;
