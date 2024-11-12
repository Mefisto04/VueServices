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
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("userId", data.userId); // Use "userId" consistently
          localStorage.setItem("auth-token", data.token);
          localStorage.setItem("Role", data.role);
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
