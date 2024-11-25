export default {
  data: () => ({
    professional: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
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
      if (this.professional.password !== this.professional.confirmPassword) {
        this.error = "Passwords do not match!";
        return;
      }

      fetch("/professional-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.professional),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            // localStorage.setItem("auth-token", data.token);
            localStorage.setItem("professionalId", data.professionalId);
            localStorage.setItem("role", data.role);
            localStorage.setItem("name", this.professional.name);
            localStorage.setItem("email", this.professional.email);
            localStorage.setItem("experience", this.professional.experience);
            localStorage.setItem("role", data.role);
            localStorage.setItem(
              "portfolioUrl",
              this.professional.portfolio_url
            );
            // this.$router.push({ path: "/dashboard" });
            console.log(
              "Waiting for account is yet to be approved by admin. Please wait:",
              data.message
            );
            alert(
              "Waiting for account is yet to be approved by admin. Please wait:" +
                data.message
            );
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
                                <h3>Professional Register</h3>
                                <div class="alert alert-danger" v-if="error">
                                    {{ error }}
                                </div>
                                <div class="form-group">
                                    <label>Full Name</label>
                                    <input type="text" v-model="professional.name" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" v-model="professional.email" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Password</label>
                                    <input type="password" v-model="professional.password" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Confirm Password</label>
                                    <input type="password" v-model="professional.confirmPassword" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label>Experience</label>
                                    <input type="text" v-model="professional.experience" class="form-control" placeholder="Your experience..." />
                                </div>
                                <div class="form-group">
                                    <label>Location</label>
                                    <input type="text" v-model="professional.location" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label>Portfolio URL</label>
                                    <input type="url" v-model="professional.portfolio_url" class="form-control" placeholder="Your portfolio URL..." />
                                </div>
                                 <div class="form-group">
                                    <label>Services Offered</label>
                                    <select v-model="professional.service" class="form-control">
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
                                <router-link to="/professional-login">Login</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
};
