import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { server } from "./util/permalink";
import Cookies from "js-cookie";

const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    // const [cookie, setCookie] = useState(Cookies.get("fathers_day_sid"));

    useEffect(() => {
        window.addEventListener("beforeunload", async () => {
            // the method that will be used for both add and remove event
            // e.preventDefault();
            // e.returnValue = "";
            await fetch(server + "auth/logout", {
                method: "POST",
                credentials: "include",
            });
        });
    }, []);

    return (
        <div className="App">
            <Router>
                <Route
                    exact
                    path="/"
                    component={() => (
                        <Login
                            setLogin={() => {
                                // setCookie(Cookies.get("fathers_day_sid"));
                                setLoggedIn(!loggedIn);
                            }}
                        />
                    )}
                />
                <ProtectedRoute
                    exact={true}
                    isAuthenticated={loggedIn}
                    path="/home"
                    component={() => (
                        <Home
                            setLoggedIn={() => {
                                console.log(!loggedIn);
                                // setCookie(undefined);
                                setLoggedIn(!loggedIn);
                            }}
                        />
                    )}
                />
            </Router>
        </div>
    );
};

export default App;
