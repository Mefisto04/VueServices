import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import LibrarianLogin from "./components/LibrarianLogin.js";
import AllBooks from "./components/AllBooks.js";
import AllSections from "./components/AllSections.js";
import BookRequests from "./components/BookRequests.js";
import ReadBook from "./components/ReadBook.js";
import SearchResult from "./components/SearchResult.js";
import ViewSection from "./components/ViewSection.js";
import EditBook from "./components/EditBook.js";
import AdminStat from "./components/AdminStat.js";
import MyRequests from "./components/MyRequests.js";
import FreelancerRegister from "./components/FreelancerRegister.js";
import FreelancerLogin from "./components/FreelancerLogin.js";
import AdminLogin from "./components/AdminLogin.js";
import Admin from "./components/Admin.js";
import Dashboard from "./components/Dashboard.js";
const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/user-login", component: Login, name: "Login" },
  { path: "/user-register", component: Register, name: "Register" },
  { path: "/lib-login", component: LibrarianLogin, name: "LibrarianLogin" },
  {
    path: "/freelancer-register",
    component: FreelancerRegister,
    name: "FreelancerRegister",
  },
  {
    path: "/freelancer-login",
    component: FreelancerLogin,
    name: "FreelancerLogin",
  },
  {
    path: "/admin-login",
    component: AdminLogin,
    name: "AdminLogin",
  },
  {
    path: "/admin",
    component: Admin,
    name: "Admin",
  },
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
  },
  { path: "/books", component: AllBooks, name: "AllBooks" },
  { path: "/sections", component: AllSections, name: "AllSection" },
  { path: "/requests", component: BookRequests, name: "BookRequests" },
  { path: "/read/:id", component: ReadBook, name: "ReadBook" },
  { path: "/section/:id", component: ViewSection, name: "ViewSection" },
  { path: "/edit-book/:id", component: EditBook, name: "EditBook" },
  { path: "/search-result", component: SearchResult, name: "SearchResult" },
  { path: "/admin-stat", component: AdminStat, name: "AdminStat" },
  { path: "/my-requests", component: MyRequests, name: "MyRequests" },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  let isLoggedIn = localStorage.getItem("auth-token");
  const loginPages = [
    "LibrarianLogin",
    "Register",
    "Login",
    "FreelancerRegister",
    "FreelancerLogin",
    "AdminLogin",
    "Admin",
    "Dashboard",
  ];
  if (loginPages.includes(to.name)) {
    if (isLoggedIn) {
      next({ name: "Home" });
    } else {
      next();
    }
  } else {
    if (isLoggedIn) {
      next();
    } else {
      next({ name: "Login" });
    }
  }
  // if (to.name !== "Login" && !localStorage.getItem("auth-token") ? true : false)
  //   next({ name: "Login" });
  // else next();
  // next()
});

export default router;
