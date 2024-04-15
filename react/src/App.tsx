import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/system";
import styles from "./styles/Home.module.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import theme from "./components/theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./routes/about";
import { CountryBridges } from "./routes/national";
import StateBridges from "./routes/state";
import MaplibreMap from "./components/Map";
import ConditionBridges from "./routes/condition";

const THEME = createTheme(theme);

const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <div className="App">
        <header className="App-header">
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </header>
        <main className={styles.main}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<CountryBridges />} />
              <Route path="/about" element={<About />} />
              <Route path="/map" element={<MaplibreMap />} />
              {/* <BridgeTypes path="/bridge_types" /> */}
              {/* <BridgeMaterials path="/bridge_materials" /> */}
              <Route path="/country" element={<CountryBridges />} />
              <Route path="/state" element={<StateBridges />} />
              <Route path="/condition" element={<ConditionBridges />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
