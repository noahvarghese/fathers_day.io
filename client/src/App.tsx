import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";

function App() {
    return (
        <div className="App">
            <Router>
                <Route exact path="/" component={Login} />
            </Router>
        </div>
    );
}

export default App;
