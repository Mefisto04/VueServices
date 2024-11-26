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

        // Handle cases for is_approved
        if (res.ok) {
          if (data.is_approved === 1) {
            // Login successful
            console.log("Login successful:", data);
            localStorage.setItem("auth-token", data.token);
            localStorage.setItem("professionalId", data.professionalId);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", data.email);
            localStorage.setItem("service", data.service);
            localStorage.setItem("service_price", data.service_price);
            localStorage.setItem("experience", data.experience);
            localStorage.setItem("portfolioUrl", data.portfolioUrl);
            localStorage.setItem("role", data.role);

            this.$router.push({ path: "/dashboard" });
          } else if (data.is_approved === 0) {
            // Pending approval
            console.log(
              "Account is yet to be approved by admin, Please wait:",
              data.message
            );
            this.error =
              "Your account is pending approval by the admin. Please wait.";
          } else if (data.is_approved === -1) {
            // Rejected by admin
            console.log(
              "Account is rejected by admin, Please make a new account:",
              data.message
            );
            this.error =
              "Your account has been rejected by the admin. Please register a new account.";
          } else {
            console.log("Unexpected approval state:", data.is_approved);
            this.error = "Unexpected error. Please contact support.";
          }
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
