import React from "react";
import { Redirect, Route } from "react-router-dom";

interface ProtectedRouteProps {
    component: React.FC<any>;
    exact: boolean;
    path: string;
    isAuthenticated: boolean;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    component,
    isAuthenticated,
    exact,
    path,
    ...rest
}) => {
    if (isAuthenticated) {
        return (
            <Route {...rest} component={component} exact={exact} path={path} />
        );
    } else {
        return <Redirect to="/" />;
    }
};

export default ProtectedRoute;
