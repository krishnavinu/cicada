import React from "react";
import { FaListUl, FaCheckSquare, FaEnvelopeOpenText, FaChartBar, FaRobot, FaFile } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { RiArrowDownSFill, RiArrowUpSFill, RiPlayListAddLine, RiCalendarLine } from "react-icons/ri";
import { PiStudentDuotone } from "react-icons/pi";
import { FaIndustry } from "react-icons/fa6";
import { LiaIndustrySolid } from "react-icons/lia";


export const SidebarData = [
  {
    title: "Dashboard",
    path: "/tpo/dashboard",
    icon: <AiFillHome />,
    tutorialId: "dashboard"
  },
  {
    title: "Students",
    icon: <PiStudentDuotone />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "List All",
        path: "/tpo/students",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Approve",
        path: "/tpo/approve-student",
        icon: <FaCheckSquare />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Company",
    icon: <LiaIndustrySolid />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "List All",
        path: "/tpo/companys",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/tpo/add-company",
        icon: <RiPlayListAddLine />,
      },
    ],
  },
  {
    title: "Job Listings",
    icon: <FaIndustry />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "List All",
        path: "/tpo/job-listings",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Add New",
        path: "/tpo/post-job",
        icon: <RiPlayListAddLine />,
        tutorialId: "post-job"
      },
    ],
  },
  {
    title: "Notice",
    icon: <FaEnvelopeOpenText />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,

    subNav: [
      {
        title: "List All",
        path: "/tpo/all-notice",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Send New",
        path: "/tpo/send-notice",
        icon: <RiPlayListAddLine />,
      },
    ],
  },
  {
    title: "Placement Drives",
    icon: <RiCalendarLine />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "List All",
        path: "/tpo/placement-drives",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
      {
        title: "Create Drive",
        path: "/tpo/create-drive",
        icon: <RiPlayListAddLine />,
        cName: "sub-nav",
        tutorialId: "placement-drives"
      },
    ],
  },
  {
    title: "Reports",
    icon: <FaChartBar />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "Department-wise",
        path: "/tpo/reports/department",
        icon: <FaListUl />,
        cName: "sub-nav",
        tutorialId: "reports"
      },
      {
        title: "Offer-wise",
        path: "/tpo/reports/offers",
        icon: <FaListUl />,
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "Analytics",
    path: "/tpo/analytics",
    icon: <FaChartBar />,
  },
  {
    title: "AI Tools",
    icon: <FaRobot />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: "Email Generator",
        path: "/tpo/ai/email-generator",
        icon: <FaEnvelopeOpenText />,
        cName: "sub-nav",
      },
      {
        title: "Resume Filter",
        path: "/tpo/ai/resume-filter",
        icon: <FaFile />,
        cName: "sub-nav",
        tutorialId: "resume-filter"
      },
    ],
  },
];
