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
      try {
        console.log("Attempting login with:", this.user);
        const res = await fetch("/professional-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
        });

        const data = await res.json();

        if (res.ok) {
          if (data.is_approved) {
            console.log("Login successful:", data);
            // localStorage.setItem("auth-token", data.token);
            localStorage.setItem("professionalId", data.professionalId);
            localStorage.setItem("name", data.name);
            localStorage.setItem("experience", data.experience);
            localStorage.setItem("portfolioUrl", data.portfolioUrl);
            localStorage.setItem("role", data.role);

            this.$router.push({ path: "/dashboard" });
          } else {
            console.log(
              "Account is yet to be approved by admin. Please wait:",
              data.message
            );
            this.error =
              "Your account is not yet approved by the admin. Please wait for approval.";
          }
        } else if (data.is_approved == false) {
          console.log(
            "Account is yet to be approved by admin, Please wait:",
            data.message
          );
          this.error = data.message;
        } else {
          console.log("Login failed:", data.message);
          this.error = data.message;
        }
      } catch (error) {
        console.error("An error occurred during login:", error);
        this.error = "An error occurred while logging in. Please try again.";
      }
    },
  },
  template: `
    <div class="container d-flex align-items-center justify-content-center" style="height: 100vh;">
      <div class="col-lg-6">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div style="margin-top: 140px">
              <h3>Professional Login</h3>
              <div class="alert alert-danger" v-if="error!=''">
                {{error}}
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="user.email" class="form-control"/>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" v-model="user.password" class="form-control"/>
              </div>
              <div class="form-group mt-3">
                <button class="btn btn-dark" @click="login">LOGIN</button>
              </div>
              <p class="mb-0 mt-2">Don't have an account yet?</p>
              <router-link to="/professional-register">Register</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
