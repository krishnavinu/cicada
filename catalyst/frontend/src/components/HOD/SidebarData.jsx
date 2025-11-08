import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaUserCheck, FaUsers, FaChartBar, FaFileDownload } from "react-icons/fa";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/hod/dashboard",
    icon: <AiFillHome />,
    tutorialId: "dashboard"
  },
  {
    title: "Approve Students",
    path: "/hod/approve-students",
    icon: <FaUserCheck />,
    tutorialId: "approve-students"
  },
  {
    title: "Department Students",
    path: "/hod/students",
    icon: <FaUsers />,
    tutorialId: "department-students"
  },
  {
    title: "Department Reports",
    path: "/hod/reports",
    icon: <FaChartBar />,
    tutorialId: "reports"
  }
];

