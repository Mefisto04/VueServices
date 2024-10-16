// export default {
//   data: () => ({
//     user: {
//       email: "",
//       name: "",
//       password: "",
//     },
//     error: "",
//   }),
//   methods: {
//     async register() {
//       try {
//         const res = await fetch("/user-register", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(this.user),
//         });
//         const data = await res.json(); // This will throw an error if the response is not JSON

//         if (res.ok) {
//           localStorage.setItem("user-id", data.user_id);
//           localStorage.setItem("auth-token", data.token);
//           localStorage.setItem("role", data.role);
//           this.$router.push({ path: "/" });
//         } else {
//           this.error = data.message || "An error occurred";
//         }
//       } catch (error) {
//         console.error("Error registering user:", error);
//         this.error = "An unexpected error occurred.";
//       }
//     },
//   },
//   template: `
//     <div class="row">
//         <div class="col-lg-6 pb-5" style="height:100vh;background:url('static/img/renaissance.jpg');background-size:cover;">
//         </div>
//         <div class="col-lg-6">
//         <div class="row justify-content-center">
//         <div class="col-lg-6">
//                 <div  style="margin-top: 140px">
//                 <h3>Register </h3>
//                 <div class="alert alert-danger" v-if="error!=''">
//                     {{error}}
//                 </div>
//                 <div class="form-group">
//                     <label>Full Name</label>
//                     <input type="text"  v-model="user.name" class="form-control"/>
//                 </div>
//                 <div class="form-group">
//                     <label>Email</label>
//                     <input type="email" v-model="user.email"  class="form-control"/>
//                 </div>
//                 <div class="form-group">
//                     <label>Password</label>
//                     <input type="password"  v-model="user.password" class="form-control"/>
//                 </div>
//                 <div class="form-group mt-3">
//                     <button class="btn btn-dark" @click="register">
//                         REGISTER
//                     </button>
//                 </div>
//                 <p class="mb-0 mt-2 ">Already a member ?</p>
//                 <router-link to="/login">Login</router-link>
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
      name: "",
      password: "",
    },
    error: "",
  }),
  methods: {
    async register() {
      try {
        const res = await fetch("/user-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
        });
        const data = await res.json(); // This will throw an error if the response is not JSON

        if (res.ok) {
          localStorage.setItem("user-id", data.user_id);
          localStorage.setItem("auth-token", data.token);
          localStorage.setItem("role", data.role);
          this.$router.push({ path: "/" });
        } else {
          this.error = data.message || "An error occurred";
        }
      } catch (error) {
        console.error("Error registering user:", error);
        this.error = "An unexpected error occurred.";
      }
    },
  },
  template: `
    <div class="container d-flex align-items-center justify-content-center" style="height: 100vh;">
      <div class="border p-5" style="background-color: white; border-radius: 10px; width: 100%; max-width: 400px;">
        <h3 class="text-center">Register</h3>
        <div class="alert alert-danger" v-if="error !== ''">
          {{ error }}
        </div>
        <div class="form-group mt-3">
          <label for="name">Full Name</label>
          <input type="text" v-model="user.name" class="form-control mt-2" id="name" placeholder="Enter your full name" />
        </div>
        <div class="form-group mt-3">
          <label for="email">Email</label>
          <input type="email" v-model="user.email" class="form-control mt-2" id="email" placeholder="Enter your email" />
        </div>
        <div class="form-group mt-3">
          <label for="password">Password</label>
          <input type="password" v-model="user.password" class="form-control mt-2" id="password" placeholder="Enter your password" />
        </div>
        <div class="form-group mt-4">
          <button class="btn btn-dark w-100" @click="register" style="transition: background-color 0.3s;">
            REGISTER
          </button>
        </div>
        <p class="mb-0 mt-2 text-center">Already a member?</p>
        <router-link to="/login" class="text-center d-block">Login</router-link>
      </div>
    </div>
    `,
};
