import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import styles from "./AppRouter.module.css";
import DisplayAttack from "../components/displayAttack/DisplayAttack";
import DisplayRegion from "../components/displayRegions/DisplayRegion";
import DisplayTime from "../components/displayTime/DisplayTima";
import DisplayOrganization from "../components/displayOrganizations/DisplayOrganizations ";

const AppRouter: React.FC = () => {
  return (
    <div>
      <nav className={styles.nav}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/attacks">Attacks</NavLink>
        <NavLink to="/regions">Regions</NavLink>
        <NavLink to="/time">Time</NavLink>
        <NavLink to="/organizations">Organizations</NavLink>
      </nav>

      <Routes>
        <Route path="/attacks" element={<DisplayAttack />} />
        <Route path="/regions" element={<DisplayRegion />} />
        <Route path="/time" element={<DisplayTime />} />
        <Route path="/organizations" element={<DisplayOrganization />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
