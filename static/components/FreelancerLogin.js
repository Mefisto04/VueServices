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
        const res = await fetch("/freelancer-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("freelancerId", data.freelancerId); // Ensure this is properly set
          localStorage.setItem("name", data.name);
          localStorage.setItem("experience", data.experience);
          localStorage.setItem("portfolioUrl", data.portfolioUrl);

          this.$router.push({ path: "/dashboard" });
          console.log("Login response data:", data);
          console.log(
            "Stored freelancerId:",
            localStorage.getItem("freelancerId")
          );
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error = "An error occurred while logging in. Please try again.";
      }
    },
  },

  template: `
          <div class="row">
              <div class="col-lg-6 pb-5" style="height:100vh;background:url('static/img/reading-book-bw.jpg') center;background-size:cover;">
              </div>
              <div class="col-lg-6">
              <div class="row justify-content-center">
              <div class="col-lg-6">
                      <div style="margin-top: 140px">
                      <h3>Freelancer Login</h3>
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
                          <button class="btn btn-dark" @click="login">
                              LOGIN
                          </button>
                      </div>
                      <p class="mb-0 mt-2">Don't have an account yet?</p>
                      <router-link to="/freelancer-register">Register</router-link>
                  </div>
              </div>
              </div>
              </div>
          </div>
    `,
};
