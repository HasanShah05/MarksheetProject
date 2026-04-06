import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar-cointainer">
      <NavLink className={"nav-link"} to="/">Marksheets</NavLink>
      <NavLink className={"nav-link"} to="/student">Students</NavLink>
      <NavLink className={"nav-link"} to="/entermarks">Enter Marks</NavLink>
      <NavLink className={"nav-link"} to="/consolidation">Consolidation</NavLink>
      <NavLink className={"nav-link"} to="/configuration">Configuration</NavLink>
    </nav>
  );
}