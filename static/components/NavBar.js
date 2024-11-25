export default {
  data: () => ({
    searchValue: "",
    // role: localStorage.getItem("role") || null,
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
      localStorage.clear();
      this.$router.push({ name: "Landing" });
    },
  },
  watch: {
    // Watch for route changes to refresh the role dynamically
    $route() {
      this.role = localStorage.getItem("role");
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
      <a class="navbar-brand" href="/">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Logo" width="30" height="30" class="d-inline-block align-text-top"> 
        <h2 class="d-inline">Servicefy</h2>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <template v-if="!role">
            <li class="nav-item">
              <router-link to="/user-login" tag="a" class="nav-link">Member Login</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/professional-login" tag="a" class="nav-link">Professional Login</router-link>
            </li>
          </template>
          <template v-else>
            <!-- For User Role -->
            <template v-if="role === 'User'">
              <li class="nav-item">
                <router-link to="/home" tag="a" class="nav-link">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/find-professionals" tag="a" class="nav-link">Find Professionals</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/services" tag="a" class="nav-link">Services</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/past-services" tag="a" class="nav-link">Past Services</router-link>
              </li>

            </template>

            <!-- For Professional Role -->
            <template v-if="role === 'Professional'">
              <li class="nav-item">
                <router-link to="/dashboard" tag="a" class="nav-link">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/update-profile" tag="a" class="nav-link">Update Profile</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/requests" tag="a" class="nav-link">Requests</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/professional-analytics" tag="a" class="nav-link">Analytics</router-link>
              </li>
            </template>

            <!-- For Admin Role -->
            <template v-if="role === 'admin'">
              <li class="nav-item">
                <router-link to="/admin" tag="a" class="nav-link">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/professional-requests" tag="a" class="nav-link">Requests</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/add-services" tag="a" class="nav-link">Add Services</router-link>
              </li>
              
              <li class="nav-item">
                <router-link to="/admin-analytics" tag="a" class="nav-link">Analytics</router-link>
              </li>
            </template>

            <li class="nav-item">
              <button class="btn btn-outline-danger btn-sm mt-2" @click="logOutUser()">Log Out</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</div>`,
  style: `
<style scoped>
</style>
`,
};
