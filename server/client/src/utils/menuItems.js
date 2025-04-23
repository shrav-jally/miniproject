import { dashboard, expenses, trend, comment, home } from "../utils/Icons";

export const menuItems = [
  {
    id: 1,
    title: "Home",
    icon: home,
    link: "/",
  },
  {
    id: 2,
    title: "Dashboard",
    icon: dashboard,
    link: "/dashboard",
  },
  {
    id: 3,
    title: "Incomes",
    icon: trend,
    link: "/income",
  },
  {
    id: 4,
    title: "Expenses",
    icon: expenses,
    link: "/expenses",
  },
  {
    id: 5,
    title: "Financial Advisor",
    icon: comment,
    link: "/financial-advisor",
  }
];
