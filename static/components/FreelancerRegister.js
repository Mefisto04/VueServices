export default {
  data: () => ({
    freelancer: {
      email: "",
      name: "",
      password: "",
      experience: "", // Added experience field
      portfolio_url: "", // Added portfolio URL field
    },
    error: "",
  }),
  methods: {
    async register() {
      fetch("/freelancer-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.freelancer),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            localStorage.setItem("auth-token", data.token);
            localStorage.setItem("role", data.role);
            this.$router.push({ path: "/dashboard" });
          } else {
            this.error = data.message;
          }
        })
        .catch((err) => {
          console.error("Error during registration:", err);
          this.error = "An error occurred. Please try again.";
        });
    },
  },
  template: `
            <div class="row">
                <div class="col-lg-6">
                    <div class="row justify-content-center">
                        <div class="col-lg-6">
                            <div style="margin-top: 140px">
                                <h3>Freelancer Register</h3>
                                <div class="alert alert-danger" v-if="error">
                                    {{ error }}
                                </div>
                                <div class="form-group">
                                    <label>Full Name</label>
                                    <input type="text" v-model="freelancer.name" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" v-model="freelancer.email" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Password</label>
                                    <input type="password" v-model="freelancer.password" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Experience</label>
                                    <input type="text" v-model="freelancer.experience" class="form-control" placeholder="Your experience..." />
                                </div>
                                <div class="form-group">
                                    <label>Portfolio URL</label>
                                    <input type="url" v-model="freelancer.portfolio_url" class="form-control" placeholder="Your portfolio URL..." />
                                </div>
                                <div class="form-group mt-3">
                                    <button class="btn btn-dark" @click="register">
                                        REGISTER
                                    </button>
                                </div>
                                <p class="mb-0 mt-2">Already a member?</p>
                                <router-link to="/freelancer-login">Login</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
};
