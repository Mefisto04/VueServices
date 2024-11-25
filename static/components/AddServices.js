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
    fetchServices() {
      fetch("/admin/services")
        .then((res) => res.json())
        .then((data) => {
          this.services = data.services;
        })
        .catch((err) => console.error("Error fetching services:", err));
    },
    addService() {
      fetch("/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.newService),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Service added successfully!");
            this.newService = { name: "" }; // Reset form
            this.fetchServices(); // Refresh service list
          }
        })
        .catch((err) => console.error("Error adding service:", err));
    },
  },
  created() {
    this.fetchServices();
  },
  template: `
          <div class="px-3 mt-3 pb-5">
            <h3>Manage Services</h3>
            <div>
              <form @submit.prevent="addService">
                <div class="form-group">
                  <label for="service-name">Service Name:</label>
                  <input v-model="newService.name" type="text" id="service-name" class="form-control" placeholder="Enter Service Name" required />
                </div>
                <button type="submit" class="btn btn-primary mt-3">Add Service</button>
              </form>
            </div>
  
            <h4 class="mt-4">Existing Services</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>No. of Professionals</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in services" :key="service.id">
                  <td>{{ service.id }}</td>
                  <td>{{ service.name }}</td>
                  <td>{{ service.numProfessionals }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
};
