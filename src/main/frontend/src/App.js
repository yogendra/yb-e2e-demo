import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import {createTheme, ThemeProvider} from "@mui/material/styles";
import Dashboard from "./Dashboard";
import About from "./About";
import DashboardMain from "./DashboardMain";

function App() {

  const theme = createTheme();

  return (

    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="" element={<Dashboard />}>
            <Route path="" element={<DashboardMain />}/>
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>

  );
}

export default App;
