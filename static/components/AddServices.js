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
    editingService: null, // To store the service being edited
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
    editService(service) {
      this.editingService = { ...service }; // Copy service details for editing
    },
    updateService() {
      fetch(`/admin/services/${this.editingService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.editingService),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Service updated successfully!");
            this.fetchServices(); // Refresh service list
            this.editingService = null; // Reset editing
          }
        })
        .catch((err) => console.error("Error updating service:", err));
    },
    deleteService(serviceId) {
      fetch(`/admin/services/${serviceId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Service deleted successfully!");
            this.fetchServices(); // Refresh service list
          }
        })
        .catch((err) => console.error("Error deleting service:", err));
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.id">
            <td>{{ service.id }}</td>
            <td>
              <input v-if="editingService && editingService.id === service.id" v-model="editingService.name" class="form-control" />
              <span v-else>{{ service.name }}</span>
            </td>
            <td>{{ service.numProfessionals }}</td>
            <td>
              <button v-if="editingService && editingService.id === service.id" class="btn btn-success btn-sm" @click="updateService">Save</button>
              <button v-else class="btn btn-warning btn-sm" @click="editService(service)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="deleteService(service.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};
