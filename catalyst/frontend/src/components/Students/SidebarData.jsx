// Filename - components/SidebarData.js

import React from "react";
import { AiFillHome } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import { RiArrowDownSFill, RiArrowUpSFill, RiPlayListAddLine, RiCalendarLine } from "react-icons/ri";
import { FaIndustry, FaListCheck, FaBuildingColumns, FaListUl, FaRegCalendarCheck } from "react-icons/fa6";
import { FaFile, FaMicrophone, FaChartLine, FaRocket, FaCog, FaDna, FaFileAlt } from "react-icons/fa";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/student/dashboard",
    icon: <AiFillHome />,
    tutorialId: "dashboard"
  },
  {
    title: "Applied Jobs",
    path: "/student/myjob",
    icon: <FaRegCalendarCheck />,
  },
  {
    title: "Placements",
    // path: "",
    icon: <FaIndustry />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "Placement Profile",
        path: "/student/placement-profile",
        icon: <ImProfile />,
        cName: "sub-nav",
      },
      {
        title: "Job Listings",
        path: "/student/job-listings",
        icon: <FaListCheck />,
        tutorialId: "job-listings"
      },
    ],
  },
  {
    title: "My Internship",
    icon: <FaBuildingColumns />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "List All",
        path: "/student/internship",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/student/add-internship",
        icon: <RiPlayListAddLine />,
      },
    ],
  },
  {
    title: "Resume Builder",
    path: "/student/resume-builder",
    icon: <FaFile />,
    tutorialId: "resume-builder"
  },
  {
    title: "Placement Drives",
    path: "/student/placement-drives",
    icon: <RiCalendarLine />,
    tutorialId: "placement-drives"
  },
  {
    title: "AI Interview Simulator",
    path: "/student/interview-simulator",
    icon: <FaMicrophone />,
    tutorialId: "interview-simulator"
  },
  {
    title: "Placement Prediction",
    path: "/student/prediction",
    icon: <FaChartLine />,
    tutorialId: "prediction"
  },
  {
    title: "PRS Dashboard",
    path: "/student/prs",
    icon: <FaRocket />,
    tutorialId: "prs-dashboard"
  },
  {
    title: "Intervention Engine",
    path: "/student/interventions",
    icon: <FaCog />,
    tutorialId: "interventions"
  },
  {
    title: "Career DNA",
    path: "/student/career-dna",
    icon: <FaDna />,
    tutorialId: "career-dna"
  },
  {
    title: "Publications",
    path: "/student/publications",
    icon: <FaFileAlt />,
  },
];
