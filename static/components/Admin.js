export default {
  data: () => ({
    userList: [],
    freelancerList: [],
    freelancerRequests: [],
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
          this.freelancerRequests = data.freelancerRequests;
          console.log("Fetched users:", this.userList);
          console.log("Fetched freelancers:", this.freelancerList);
          console.log("Fetched freelancer requests:", this.freelancerRequests);
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
        });
    },
    approveFreelancer(freelancerId) {
      fetch(`/api/freelancer/${freelancerId}/approve`, {
        method: "POST",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Error approving freelancer: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          console.log(data.message); // Show success message
          this.getAdminData(); // Refresh the data
        })
        .catch((error) => {
          console.error("Error approving freelancer:", error);
        });
    },
    async updateFreelancer(freelancerId, service) {
      try {
        const res = await fetch("/update_freelancer_by_admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            freelancerId: freelancerId, // Pass freelancerId
            service: service, // Pass service
          }),
        });

        const data = await res.json();

        if (res.ok) {
          this.success = "Profile updated successfully!";
          localStorage.setItem("service", service);
          this.getAdminData(); // Refresh data to reflect the change
          alert("Profile updated successfully!");
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error =
          "An error occurred while updating the profile. Please try again.";
      }
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
          <div>
            <button @click="$router.push('/admin-analytics')" class="btn btn-primary">
              View Analytics
            </button>
          </div>
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
                  <p class="card-text">Service: {{ freelancer.service }}</p>
                  <p class="card-text">Rating: {{ freelancer.rating }}</p>
                  <p class="card-text">Experience: {{ freelancer.experience }}</p>
                  <a v-if="freelancer.portfolio_url && freelancer.portfolio_url !== 'null'" 
                     :href="freelancer.portfolio_url" class="btn btn-primary" target="_blank">View Portfolio</a>
                  <form @submit.prevent="updateFreelancer( freelancer.email , freelancer.service)">
                    <div class="form-group">
                      <label for="service">Service</label>
                      <input v-model="freelancer.service" type="text" class="form-control" id="service" placeholder="Enter Service" required>
                    </div>
                    <button type="submit" class="btn btn-dark mt-3">Update</button>
                  </form>
                  <button @click="deleteFreelancer(freelancer.id)" class="btn btn-danger btn-sm mt-2">Delete</button>
                </div>
              </div>
            </div>
          </div>

          <h3>Freelancer Requests</h3>
          <div class="row justify-content-left">
            <div class="col-lg-2 mt-3" v-for="(freelancer, index) in freelancerRequests" :key="freelancer.id">
              <div class="card" style="border: 1px solid #ccc; border-radius: 5px; margin: 10px;">
                <div class="card-body" style="text-align: center;">
                  <h5 class="card-title">{{ freelancer.name }}</h5>
                  <p class="card-text">Email: {{ freelancer.email }}</p>
                  <p class="card-text">Service: {{ freelancer.service }}</p>
                  <p class="card-text">Experience: {{ freelancer.experience }}</p>
                  <a v-if="freelancer.portfolio_url" :href="freelancer.portfolio_url" target="_blank" class="btn btn-primary">View Portfolio</a>
                  <button @click="approveFreelancer(freelancer.id)" class="btn btn-success btn-sm mt-2">Approve</button>
                  <button @click="deleteFreelancer(freelancer.id)" class="btn btn-danger btn-sm mt-2">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
};
