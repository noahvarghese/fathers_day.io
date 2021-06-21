import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Coupons from "./pages/Coupons";
import GiftCoupons from "./pages/GiftCoupons";
import Home from "./pages/Home";
import Family from "./pages/Family";
import AddFamily from "./pages/AddFamily";
import { server } from "./util/permalink";

const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userID, setUserID] = useState(-1);

    // const [cookie, setCookie] = useState(Cookies.get("fathers_day_sid"));

    useEffect(() => {
        window.addEventListener("beforeunload", async () => {
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
                                setLoggedIn(!loggedIn);
                            }}
                            setUserID={(id: number) => {
                                console.log(userID);
                                setUserID(id);
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
                                setLoggedIn(!loggedIn);
                            }}
                        />
                    )}
                />
                <ProtectedRoute
                    exact={true}
                    isAuthenticated={loggedIn}
                    path="/family"
                    component={() => (
                        <Family
                            setLoggedIn={() => {
                                setLoggedIn(!loggedIn);
                            }}
                        />
                    )}
                />
                <ProtectedRoute
                    exact={true}
                    isAuthenticated={loggedIn}
                    path="/family/add"
                    component={() => (
                        <AddFamily
                            setLoggedIn={() => {
                                setLoggedIn(!loggedIn);
                            }}
                        />
                    )}
                />
                <ProtectedRoute
                    exact={true}
                    isAuthenticated={loggedIn}
                    path="/coupons"
                    component={() => (
                        <Coupons
                            setLoggedIn={() => setLoggedIn(!loggedIn)}
                            userID={userID}
                        />
                    )}
                />
                <ProtectedRoute
                    exact={true}
                    isAuthenticated={loggedIn}
                    path="/coupons/gift"
                    component={() => (
                        <GiftCoupons
                            setLoggedIn={() => setLoggedIn(!loggedIn)}
                        />
                    )}
                />
            </Router>
        </div>
    );
};

export default App;
