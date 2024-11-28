export default {
  data: () => ({
    professional: {
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
      service: localStorage.getItem("service") || "",
      service_price: localStorage.getItem("service_price") || "",
      experience: localStorage.getItem("experience") || "",
      portfolio_url: localStorage.getItem("portfolioUrl") || "",
    },
    requests: [],
    error: "",
    success: "",
    services: [], // List of services fetched from the backend
    invalidServiceError: false, // Flag for invalid service error
  }),
  methods: {
    async fetchServices() {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();
        if (response.ok) {
          this.services = data.services;
          this.checkServiceValidity();
        } else {
          this.error = "Failed to load services.";
        }
      } catch (err) {
        this.error = "An error occurred while fetching services.";
      }
    },
    checkServiceValidity() {
      const isValidService = this.services.some(
        (service) => service.name === this.professional.service
      );
      if (!isValidService) {
        this.invalidServiceError = true;
        this.error =
          "The service you are using is no longer available. Please update your service as soon as possible.";
      } else {
        this.invalidServiceError = false;
        this.error = ""; // Clear error if the service is valid
      }
    },
    async updateProfessional() {
      const professionalId = localStorage.getItem("professionalId");
      if (!professionalId || professionalId === "undefined") {
        this.error = "Professional ID is missing. Please log in again.";
        return;
      }

      // Validate the selected service
      const selectedService = this.services.find(
        (service) => service.name === this.professional.service
      );
      if (!selectedService) {
        this.error =
          "The selected service is invalid. Please choose a valid service.";
        return;
      }

      try {
        const res = await fetch("/update_professional", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...this.professional, professionalId }),
        });

        const data = await res.json();

        if (res.ok) {
          this.success = "Profile updated successfully!";
          localStorage.setItem("name", this.professional.name);
          localStorage.setItem("email", this.professional.email);
          localStorage.setItem("service", this.professional.service);
          localStorage.setItem(
            "service_price",
            this.professional.service_price
          );
          localStorage.setItem("experience", this.professional.experience);
          localStorage.setItem("portfolioUrl", this.professional.portfolio_url);
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error =
          "An error occurred while updating the profile. Please try again.";
      }
    },
  },
  mounted() {
    this.fetchServices(); // Fetch services on component mount
  },
  template: `
      <div class="container my-4">
        <h2 class="text-center mb-4">Professional Dashboard</h2>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>
        <div class="border rounded shadow p-4 mb-4 animate__animated animate__fadeIn">
          <h3>Update Profile</h3>
          <form @submit.prevent="updateProfessional">
            <div class="form-group">
              <label for="name">Name</label>
              <input v-model="professional.name" type="text" class="form-control" id="name" placeholder="Enter name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input v-model="professional.email" type="email" class="form-control" id="email" placeholder="Enter email" required>
            </div>
            <div class="form-group">
              <label for="service">Service</label>
              <select v-model="professional.service" class="form-control" id="service" required>
                <option value="" disabled>Select a service</option>
                <option v-for="service in services" :key="service.id" :value="service.name">
                  {{ service.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="service_price">Service Price</label>
              <input v-model="professional.service_price" type="text" class="form-control" id="service_price" placeholder="Enter service price" required>
            </div>
            <div class="form-group">
              <label for="experience">Experience</label>
              <input v-model="professional.experience" type="text" class="form-control" id="experience" placeholder="Enter experience" required>
            </div>
            <div class="form-group">
              <label for="portfolio">Portfolio URL</label>
              <input v-model="professional.portfolio_url" type="url" class="form-control" id="portfolio" placeholder="Enter portfolio URL" required>
            </div>
            <button type="submit" class="btn btn-dark mt-3">Update</button>
          </form>
        </div>
      </div>
    `,
};
