import React from "react";
import "./styles.css";
import { Link, NavLink, useLocation } from "react-router-dom";

const NavSideBar = () => {
  return (
    <>
      <div className="nav-container">
        <div className="nav-side-logo">
          <img src="../src/assets/android--.png" className="logo" alt="" />
          <div>
            <h2>SBS Classes</h2>
            <p>Manage your course Data</p>
          </div>
        </div>
        <div className="nav-menu">
          <NavLink
            to={"home"}
            className={({ isActive }) =>
              isActive ? "link-active-menu" : "link-menu"
            }
          >
            <i className="fa-solid fa-house"></i>Home
          </NavLink>
          <NavLink
            to={"courses"}
            className={({ isActive }) =>
              isActive ? "link-active-menu" : "link-menu"
            }
          >
            <i className="fa-solid fa-book"></i> All Courses
          </NavLink>
          <NavLink
            to={"add-courses"}
            className={({ isActive }) =>
              isActive ? "link-active-menu" : "link-menu"
            }
          >
            <i className="fa-solid fa-plus" /> Add Courses
          </NavLink>
          <NavLink
            to={"students"}
            className={({ isActive }) =>
              isActive ? "link-active-menu" : "link-menu"
            }
          >
            <i className="fa-regular fa-circle-user"></i> All Students
          </NavLink>
          <NavLink
            to={"add-student"}
            className={({ isActive }) =>
              isActive ? "link-active-menu" : "link-menu"
            }
          >
            <i className="fa-solid fa-user-plus"></i>Add Student
          </NavLink>
          <NavLink
            to={"add-fee"}
            className={({ isActive }) =>
              isActive ? "link-active-menu" : "link-menu"
            }
          >
            <i className="fa-solid fa-credit-card"></i> Fee Payment
          </NavLink>
          <NavLink
            to={"fee-history"}
            className={({ isActive }) =>
              isActive ? "link-active-menu" : "link-menu"
            }
          >
            <i className="fa-solid fa-file-invoice"></i> Payment History
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default NavSideBar;
