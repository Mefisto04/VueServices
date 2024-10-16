
export default {
  data: () => ({
    userList: [],
    freelancerList: [],
  }),
  methods: {
    getAdminData() {
      fetch("/admin/data", {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Error fetching admin data: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          this.userList = data.users; // Store the fetched users
          this.freelancerList = data.freelancers; // Store the fetched freelancers
          console.log("Fetched users:", this.userList);
          console.log("Fetched freelancers:", this.freelancerList);
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
        });
    },
    deleteUser(userId) {
      fetch(`/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Error deleting user: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          console.log(data.message); // Show success message
          this.getAdminData(); // Refresh the data
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    },
    deleteFreelancer(freelancerId) {
      fetch(`/api/freelancer/${freelancerId}`, {
        method: "DELETE",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Error deleting freelancer: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          console.log(data.message); // Show success message
          this.getAdminData(); // Refresh the data
        })
        .catch((error) => {
          console.error("Error deleting freelancer:", error);
        });
    },
  },
  created() {
    this.getAdminData(); // Fetch admin data (users and freelancers) when the component is created
  },
  template: `
        <div class="px-3 mt-3 pb-5">
          <h3>Admin Dashboard</h3>
          <h3>Users</h3>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in userList" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.active ? 'Yes' : 'No' }}</td>
                <td>
                  <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
    
          <h3>Freelancers</h3>
          <div class="row justify-content-left">
            <div class="col-lg-2 mt-3" v-for="(freelancer, j) in freelancerList" :key="j">
              <div class="card" style="border: 1px solid #ccc; border-radius: 5px; margin: 10px;">
                <div class="card-body" style="text-align: center;">
                  <h5 class="card-title">{{ freelancer.name }}</h5>
                  <p class="card-text">Email: {{ freelancer.email }}</p>
                  <p class="card-text">Experience: {{ freelancer.experience }}</p>
                  <a v-if="freelancer.portfolio_url && freelancer.portfolio_url !== 'null'" 
                     :href="freelancer.portfolio_url" class="btn btn-primary" target="_blank">View Portfolio</a>
                  <button @click="deleteFreelancer(freelancer.id)" class="btn btn-danger btn-sm mt-2">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
};
