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
  }),
  methods: {
    async updateProfessional() {
      const professionalId = localStorage.getItem("professionalId");
      console.log("Professional Uniquifier:", professionalId);

      if (!professionalId || professionalId === "undefined") {
        this.error = "Professional ID is missing. Please log in again.";
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
  mounted() {},
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
              <input v-model="professional.service" type="text" class="form-control" id="service" placeholder="Enter service" required>
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
