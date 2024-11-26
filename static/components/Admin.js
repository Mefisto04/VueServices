export default {
  data: () => ({
    userList: [],
    professionalList: [],
    professionalRequests: [],
    services: [],
    newService: {
      name: "",
      numProfessionals: 0,
    },
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
          this.professionalList = data.professionals; // Store the fetched professionals
          this.professionalRequests = data.professionalRequests;
          console.log("Fetched users:", this.userList);
          console.log("Fetched professionals:", this.professionalList);
          console.log(
            "Fetched professional requests:",
            this.professionalRequests
          );
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
        });
    },
    approveProfessional(professionalId) {
      fetch(`/api/professional/${professionalId}/approve`, {
        method: "POST",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Error approving professional: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          console.log(data.message); // Show success message
          this.getAdminData(); // Refresh the data
        })
        .catch((error) => {
          console.error("Error approving professional:", error);
        });
    },
    async updateProfessional(professionalId, service) {
      try {
        const res = await fetch("/update_professional_by_admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            professionalId: professionalId, // Pass professionalId
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
    deleteProfessional(professionalId) {
      fetch(`/api/professional/${professionalId}`, {
        method: "DELETE",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `Error deleting professional: ${res.status} ${res.statusText}`
            );
          }
          return res.json();
        })
        .then((data) => {
          console.log(data.message); // Show success message
          this.getAdminData(); // Refresh the data
        })
        .catch((error) => {
          console.error("Error deleting professional:", error);
        });
    },
  },
  created() {
    this.getAdminData(); // Fetch admin data (users and professionals) when the component is created
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
    
          <h3>Professionals</h3>
          <div class="row justify-content-left">
            <div class="col-lg-2 mt-3" v-for="(professional, j) in professionalList" :key="j">
              <div class="card" style="border: 1px solid #ccc; border-radius: 5px; margin: 10px;">
                <div class="card-body" style="text-align: center;">
                  <h5 class="card-title">{{ professional.name }}</h5>
                  <p class="card-text">Email: {{ professional.email }}</p>
                  <p class="card-text">Service: {{ professional.service }}</p>
                  <p class="card-text">Service Price: {{ professional.service_price }}</p>
                  <p class="card-text">Rating: {{ professional.rating }}</p>
                  <p class="card-text">Experience: {{ professional.experience }}</p>
                  <a v-if="professional.portfolio_url && professional.portfolio_url !== 'null'" 
                     :href="professional.portfolio_url" class="btn btn-primary" target="_blank">View Portfolio</a>
                  <form @submit.prevent="updateProfessional( professional.email , professional.service)">
                    <div class="form-group">
                      <label for="service">Service</label>
                      <input v-model="professional.service" type="text" class="form-control" id="service" placeholder="Enter Service" required>
                    </div>
                    <button type="submit" class="btn btn-dark mt-3">Update</button>
                  </form>
                  <button @click="deleteProfessional(professional.id)" class="btn btn-danger btn-sm mt-2">Delete</button>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      `,
};
