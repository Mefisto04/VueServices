// export default {
//   data: () => ({
//     user: {
//       email: "",
//       password: "",
//     },
//     error: "",
//   }),
//   methods: {
//     async login() {
//       fetch("/user-login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(this.user),
//       }).then(async (res) => {
//         const data = await res.json();
//         if (res.ok) {
//           localStorage.setItem("auth-token", data.token);
//           localStorage.setItem("role", data.role);
//           this.$router.push({ path: "/" });
//         } else {
//           this.error = data.message;
//         }
//       });
//     },
//   },
//   template: `
//     <div class="row">
//         <div class="col-lg-6 pb-5" style="height:100vh;background:url('static/img/reading-book-bw.jpg') center;background-size:cover;">

//         </div>
//         <div class="col-lg-6">
//         <div class="row justify-content-center">
//         <div class="col-lg-6">
//                 <div  style="margin-top: 140px">
//                 <h3>Login</h3>
//                 <div class="alert alert-danger" v-if="error!=''">
//                     {{error}}
//                 </div>
//                 <div class="form-group">
//                     <label>Email</label>
//                     <input type="email" v-model="user.email" class="form-control"/>
//                 </div>
//                 <div class="form-group">
//                     <label>Password</label>
//                     <input type="password" v-model="user.password" class="form-control"/>
//                 </div>
//                 <div class="form-group mt-3">
//                     <button class="btn btn-dark" @click="login">
//                         LOGIN
//                     </button>
//                 </div>
//                 <p class="mb-0 mt-2 ">Don't have an account yet ?</p>

//                 <router-link to="/user-register">Register</router-link>
//             </div>
//         </div>
//         </div>
//         </div>
//     </div>
//     `,
// };

export default {
  data: () => ({
    user: {
      email: "",
      password: "",
    },
    error: "",
  }),
  methods: {
    async login() {
      fetch("http://127.0.0.1:5000/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.user),
      }).then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("auth-token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("name", data.name);
          localStorage.setItem("Role", data.role);
          this.$router.push({ path: "/" });
          console.log("User ID saved to local storage:", data.userId);
        } else {
          this.error = data.message;
        }
      });
    },
  },
  template: `
    <div class="container d-flex align-items-center justify-content-center" style="height: 100vh;">
      <div class="border p-5" style="background-color: white; border-radius: 10px; width: 100%; max-width: 400px;">
        <h3 class="text-center">Login</h3>
        <div class="alert alert-danger" v-if="error !== ''">
          {{ error }}
        </div>
        <div class="form-group">
          <label for="email" class="mt-3">Email</label>
          <input type="email" v-model="user.email" class="form-control mt-2" id="email" placeholder="Enter your email"/>
        </div>
        <div class="form-group">
          <label for="password" class="mt-3">Password</label>
          <input type="password" v-model="user.password" class="form-control mt-2" id="password" placeholder="Enter your password"/>
        </div>
        <div class="form-group mt-4">
          <button class="btn btn-dark w-100" @click="login" style="transition: background-color 0.3s;">
            LOGIN
          </button>
        </div>
        <p class="mb-0 mt-2 text-center">Don't have an account yet?</p>
        <router-link to="/user-register" class="text-center d-block">Register</router-link>
      </div>
    </div>
    `,
};
