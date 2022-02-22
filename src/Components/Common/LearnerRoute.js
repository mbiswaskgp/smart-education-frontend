import React from 'react';
import { Route, Redirect } from "react-router";
import { useSelector } from "react-redux";

import Login from "../Auth/Login";

export function LearnerRoute({ children, ...rest }) {
    const { isLoggedIn, userRoleData } = useSelector(state => state.auth);
    return (
        <Route
            {...rest}
            render={() =>
                (isLoggedIn && userRoleData===3) ? (
                    children
                ) : <Redirect to="/login" />
            }
        />
    );
}