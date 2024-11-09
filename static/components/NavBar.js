export default {
  data: () => ({
    searchValue: "",
  }),
  methods: {
    search() {
      if (this.$route.name !== "SearchResult") {
        this.$router.push({
          name: "SearchResult",
          query: { search_value: this.searchValue },
        });
      } else {
        const x = this.searchValue;
        this.$router.replace({ query: { search_value: x } });
      }
    },
    logOutUser() {
      let x = confirm("Are you sure to log out from the app?");
      if (!x) {
        return;
      }
      localStorage.removeItem("auth-token");
      localStorage.removeItem("role");
      this.$router.push({ name: "FreelancerRegister" });
    },
  },
  created() {
    this.searchValue = this.$route.query.search_value || "";
  },
  computed: {
    role() {
      return localStorage.getItem("role");
    },
    isLoggedIn() {
      return localStorage.getItem("auth-token");
    },
  },
  template: `
<div class="navbar">
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top"> 
        <h2 class="d-inline">Freelancer Hub</h2>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link to="/login" tag="a" class="nav-link">Member Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/freelancer-login" tag="a" class="nav-link">Freelancer Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin-login" tag="a" class="nav-link">Admin Login</router-link>
            </li>
          </template>
          <template v-if="isLoggedIn">
            <li class="nav-item">
              <router-link to="/" tag="a" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/projects" tag="a" class="nav-link">Projects</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/my-jobs" tag="a" class="nav-link">My Jobs</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/bookings" tag="a" class="nav-link">My Bookings</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/messages" tag="a" class="nav-link">Messages</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-danger btn-sm mt-2" @click="logOutUser()">Log Out</button>
            </li>
          </template>
        </ul>
      </div>
      <form class="d-flex" role="search" v-if="isLoggedIn">
        <input class="form-control me-2" type="search" placeholder="Search freelancers..." v-model="searchValue" aria-label="Search">
        <button type="button" class="btn btn-outline-dark" @click="search">Search</button>
      </form>
    </div>
  </nav>
</div>`,
  style: `
<style scoped>

</style>
`,
};
