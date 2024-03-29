import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { LayerSpecification } from "maplibre-gl";
import { HUD } from "./HUD";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../styles/Home.module.css";
import maptiler3dGl from "../assets/maptiler-3d-gl-style.json";

function MaplibreMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState({});
  const [hudVisible, setHudVisible] = useState(false);
  const mapFile = new PMTiles("/us.pmtiles");
  const bridgeMapFile = new PMTiles("/bridges2022.pmtiles");

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

      map.addLayer({
        id: "bridges2022_geopandas",
        type: "circle",
        source: "bridgemaptiles",
        "source-layer": "bridges2022_geopandas",
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
    });

    map.on("click", function (e) {
      const features = map.queryRenderedFeatures(e.point);
      const feature =
        features.filter(
          (feature) => feature?.sourceLayer === "bridges2022_geopandas"
        )[0] ?? null;
      if (feature) {
        console.log(feature.properties);
        setSelectedMarkerData(feature.properties);
        setHudVisible(true);
      } else {
        setSelectedMarkerData({});
        setHudVisible(false);
      }
    });
    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <div ref={mapContainerRef} className={styles.mapContainer}>
        <div ref={mapContainerRef}></div>
        {hudVisible && <HUD data={selectedMarkerData} />}
      </div>
    </>
  );
}

export default MaplibreMap;
