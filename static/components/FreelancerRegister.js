export default {
  data: () => ({
    freelancer: {
      email: "",
      name: "",
      password: "",
      service: "",
      experience: "", // Added experience field
      portfolio_url: "", // Added portfolio URL field
    },
    services: [
      "Cleaning",
      "Gardening",
      "Plumbing",
      "Electrical Work",
      "Handyman",
      "Painting",
      "Moving",
      "Others",
    ],
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
            localStorage.setItem("freelancerId", data.freelancerId);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", this.freelancer.name);
            localStorage.setItem("email", this.freelancer.email);
            localStorage.setItem("experience", this.freelancer.experience);
            localStorage.setItem("portfolioUrl", this.freelancer.portfolio_url);
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
                                 <div class="form-group">
                                    <label>Services Offered</label>
                                    <select v-model="freelancer.service" class="form-control">
                                        <option v-for="service in services" :key="service" :value="service">
                                            {{ service }}
                                        </option>
                                    </select>
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
