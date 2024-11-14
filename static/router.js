import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import ProfessionalRegister from "./components/ProfessionalRegister.js";
import ProfessionalLogin from "./components/ProfessionalLogin.js";
import AdminLogin from "./components/AdminLogin.js";
import Admin from "./components/Admin.js";
import Dashboard from "./components/Dashboard.js";
import Landing from "./components/Landing.js";
import AdminAnalytics from "./components/AdminAnalytics.js";
const routes = [
  { path: "/home", component: Home, name: "Home" },
  { path: "/user-login", component: Login, name: "Login" },
  { path: "/user-register", component: Register, name: "Register" },
  {
    path: "/professional-register",
    component: ProfessionalRegister,
    name: "ProfessionalRegister",
  },
  {
    path: "/professional-login",
    component: ProfessionalLogin,
    name: "ProfessionalLogin",
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
  {
    path: "/",
    component: Landing,
    name: "Landing",
  },
  {
    path: "/admin-analytics",
    component: AdminAnalytics,
    name: "AdminAnalytics",
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  let isLoggedIn = localStorage.getItem("auth-token");
  let role = localStorage.getItem("role");
  const loginPages = [
    "LibrarianLogin",
    "Register",
    "Login",
    "ProfessionalRegister",
    "ProfessionalLogin",
    "AdminLogin",
    "Admin",
    "Dashboard",
    "Landing",
    "AdminAnalytics",
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
      next({ name: "Landing" });
    }
  }
  // if (to.name !== "Login" && !localStorage.getItem("auth-token") ? true : false)
  //   next({ name: "Login" });
  // else next();
  // next()
});

export default router;
