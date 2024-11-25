// import Home from "./components/Home.js";
// import Login from "./components/Login.js";
// import Register from "./components/Register.js";
// import ProfessionalRegister from "./components/ProfessionalRegister.js";
// import ProfessionalLogin from "./components/ProfessionalLogin.js";
// import AdminLogin from "./components/AdminLogin.js";
// import Admin from "./components/Admin.js";
// import Dashboard from "./components/Dashboard.js";
// import Landing from "./components/Landing.js";
// import AdminAnalytics from "./components/AdminAnalytics.js";
// const routes = [
//   { path: "/home", component: Home, name: "Home" },
//   { path: "/user-login", component: Login, name: "Login" },
//   { path: "/user-register", component: Register, name: "Register" },
//   {
//     path: "/professional-register",
//     component: ProfessionalRegister,
//     name: "ProfessionalRegister",
//   },
//   {
//     path: "/professional-login",
//     component: ProfessionalLogin,
//     name: "ProfessionalLogin",
//   },
//   {
//     path: "/admin-login",
//     component: AdminLogin,
//     name: "AdminLogin",
//   },
//   {
//     path: "/admin",
//     component: Admin,
//     name: "Admin",
//   },
//   {
//     path: "/dashboard",
//     component: Dashboard,
//     name: "Dashboard",
//   },
//   {
//     path: "/",
//     component: Landing,
//     name: "Landing",
//   },
//   {
//     path: "/admin-analytics",
//     component: AdminAnalytics,
//     name: "AdminAnalytics",
//   },
// ];

// const router = new VueRouter({
//   routes,
// });

// router.beforeEach((to, from, next) => {
//   let isLoggedIn = localStorage.getItem("auth-token");
//   let role = localStorage.getItem("role");
//   console.log(isLoggedIn, role);
//   const loginPages = [
//     "LibrarianLogin",
//     "Register",
//     "Login",
//     "ProfessionalRegister",
//     "ProfessionalLogin",
//     "AdminLogin",
//     "Admin",
//     "Dashboard",
//     "Landing",
//     "AdminAnalytics",
//   ];
//   if (loginPages.includes(to.name)) {
//     if (isLoggedIn) {
//       next({ name: "Home" });
//     } else {
//       next();
//     }
//   } else {
//     if (isLoggedIn) {
//       next();
//     } else {
//       next({ name: "Landing" });
//     }
//   }
//   // if (to.name !== "Login" && !localStorage.getItem("auth-token") ? true : false)
//   //   next({ name: "Login" });
//   // else next();
//   // next()
// });

// export default router;

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
import UpdateProfile from "./components/UpdateProfile.js";
import ProfessionalRequests from "./components/ProfessionalRequests.js";
import AddServices from "./components/AddServices.js";
import FindProfessionals from "./components/FindProfessionals.js";
import PastServices from "./components/PastServices.js";

const routes = [
  {
    path: "/home",
    component: Home,
    name: "Home",
    meta: {
      requiresAuth: true,
      allowedRoles: ["User"],
    },
  },
  {
    path: "/user-login",
    component: Login,
    name: "Login",
    meta: {
      requiresAuth: false,
      allowedRoles: [],
    },
  },
  {
    path: "/user-register",
    component: Register,
    name: "Register",
    meta: {
      requiresAuth: false,
      allowedRoles: [],
    },
  },
  {
    path: "/professional-register",
    component: ProfessionalRegister,
    name: "ProfessionalRegister",
    meta: {
      requiresAuth: false,
      allowedRoles: [],
    },
  },
  {
    path: "/professional-login",
    component: ProfessionalLogin,
    name: "ProfessionalLogin",
    meta: {
      requiresAuth: false,
      allowedRoles: [],
    },
  },
  {
    path: "/admin-login",
    component: AdminLogin,
    name: "AdminLogin",
    meta: {
      requiresAuth: false,
      allowedRoles: [],
    },
  },
  {
    path: "/admin",
    component: Admin,
    name: "Admin",
    meta: {
      requiresAuth: true,
      allowedRoles: ["Admin"],
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    name: "Dashboard",
    meta: {
      requiresAuth: true,
      allowedRoles: ["Professional"],
    },
  },
  {
    path: "/",
    component: Landing,
    name: "Landing",
    meta: {
      requiresAuth: false,
      allowedRoles: [],
    },
  },
  {
    path: "/admin-analytics",
    component: AdminAnalytics,
    name: "AdminAnalytics",
    meta: {
      requiresAuth: true,
      allowedRoles: ["Admin"],
    },
  },
  {
    path: "/update-profile",
    component: UpdateProfile,
    name: "UpdateProfile",
    meta: {
      requiresAuth: true,
      allowedRoles: ["Professional"],
    },
  },
  {
    path: "/professional-requests",
    component: ProfessionalRequests,
    name: "ProfessionalRequests",
    meta: {
      requiresAuth: true,
      allowedRoles: ["Admin"],
    },
  },
  {
    path: "/add-services",
    component: AddServices,
    name: "AddServices",
    meta: {
      requiresAuth: true,
      allowedRoles: ["Admin"],
    },
  },
  {
    path: "/find-professionals",
    component: FindProfessionals,
    name: "FindProfessionals",
    meta: {
      requiresAuth: true,
      allowedRoles: ["User"],
    },
  },
  {
    path: "/past-services",
    component: PastServices,
    name: "PastServices",
    meta: {
      requiresAuth: true,
      allowedRoles: ["User"],
    },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem("auth-token");
  const userRole = localStorage.getItem("role");

  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    if (!authToken) {
      // If no auth token, redirect to landing page
      return next({ name: "Landing" });
    }

    // Check if user has the required role for the route
    if (to.meta.allowedRoles && to.meta.allowedRoles.length > 0) {
      if (!to.meta.allowedRoles.includes(userRole)) {
        // If user's role is not allowed, redirect to appropriate dashboard
        switch (userRole) {
          case "User":
            return next({ name: "Home" });
          case "Professional":
            return next({ name: "Dashboard" });
          case "Admin":
            return next({ name: "Admin" });
        }
      }
    }
  } else {
    // Handle login/register pages when user is already authenticated
    if (authToken) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case "User":
          return next({ name: "Home" });
        case "Professional":
          return next({ name: "Dashboard" });
        case "Admin":
          return next({ name: "Admin" });
        default:
          return next({ name: "Landing" });
      }
    }
  }

  // If none of the above conditions match, proceed normally
  next();
});

export default router;
