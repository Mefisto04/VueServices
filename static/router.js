import Home from "./components/Home.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import FreelancerRegister from "./components/FreelancerRegister.js";
import FreelancerLogin from "./components/FreelancerLogin.js";
import AdminLogin from "./components/AdminLogin.js";
import Admin from "./components/Admin.js";
import Dashboard from "./components/Dashboard.js";
const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/user-login", component: Login, name: "Login" },
  { path: "/user-register", component: Register, name: "Register" },
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
