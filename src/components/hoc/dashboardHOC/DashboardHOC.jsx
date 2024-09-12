import React, { useEffect, useState } from "react";

// CSS
import "./DashboardHOC.css";

// Components
import Sidebar from "../../sidebar/Sidebar";

// Constants
import { adminSidebarLinks } from "../../../libs/constants";
import Loader from "../../loader/Loader";

const DashboardHOC = (Component) =>
  function HOC() {

    const [loading, setLoading] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
    const [rowCount, setRowCount] = useState(() => {
      if (viewportHeight >= 1024) {
        return 10;
      } else if (viewportHeight < 1024 && viewportHeight > 768) {
        return 8;
      } else {
        return 5;
      }
    })

  useEffect(() => {
  
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (viewportHeight >= 1024) {
      setRowCount(10);
    } else if (viewportHeight < 1024 && viewportHeight > 768) {
      setRowCount(8);
    } else {
      setRowCount(5);
    }
  }, [viewportHeight]);


    return (
      <>
        {loading && <Loader />}
        <div className="dashboard-hoc">
            <Sidebar sidebarLinks={adminSidebarLinks} />
          <div className="dash-area">
            <Component loading={loading} setLoading={setLoading} rowCount={rowCount} />
          </div>
        </div>
      </>
    );
  };

export default DashboardHOC;
