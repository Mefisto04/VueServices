export default {
  data: () => ({
    admin: {
      email: "",
      password: "",
    },
    error: "",
  }),
  methods: {
    async login() {
      try {
        const res = await fetch("/admin-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.admin),
        });

        const data = await res.json();
        console.log(data);
        if (res.ok) {
          // localStorage.setItem("role", data.role);
          console.log("Login successful, navigating to /admin");
          console.log("Current route before navigation:", this.$route.path);
          // localStorage.setItem("auth-token", data.token);
          localStorage.setItem("role", data.role);
          this.$router.push({ path: "/admin" });
        } else {
          this.error = data.message; // Display error message from server
        }
      } catch (error) {
        this.error = "Network error occurred. Please try again."; // Handle network errors
      }
    },
  },
  template: `
            <div class="container d-flex align-items-center justify-content-center" style="height: 100vh;">
                <div class="col-lg-6 pb-5" style="height:100vh;background:url('static/img/reading-book-bw.jpg') center;background-size:cover;">
                </div>
                <div class="col-lg-6">
                    <div class="row justify-content-center">
                        <div class="col-lg-6">
                            <div style="margin-top: 140px">
                                <h3>Admin Login</h3>
                                <div class="alert alert-danger" v-if="error!=''">
                                    {{error}}
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" v-model="admin.email" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Password</label>
                                    <input type="password" v-model="admin.password" class="form-control" />
                                </div>
                                <div class="form-group mt-3">
                                    <button class="btn btn-dark" @click="login">
                                        LOGIN
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
};
