import React from "react";
import {
  FiBarChart,
  FiUser,
  FiCreditCard,
  FiStar,
  FiShoppingCart,
} from "react-icons/fi";
import {
  BsFillClipboardCheckFill,
  BsKanban,
  BsRobot,
  BsBoxSeam,
  BsCurrencyDollar,
  BsShield,
  BsChatLeft,
  BsDatabaseFill,
} from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";

export const links = [
  {
    title: "Pages",
    links: [
      {
        name: "Upload Questions",
        icon: <TbDeviceDesktopAnalytics />,
        link: "upload-question",
      },
      {
        name: "Evaluate Answers",
        icon: <BsFillClipboardCheckFill />,
        link: "evaluate-answer",
      },
    ],
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];
