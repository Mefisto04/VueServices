export default {
  data: () => ({
    freelancer: {
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
      experience: localStorage.getItem("experience") || "",
      portfolio_url: localStorage.getItem("portfolioUrl") || "",
    },
    requests: [],
    error: "",
    success: "",
  }),
  methods: {
    async updateFreelancer() {
      const freelancerId = localStorage.getItem("freelancerId");
      console.log("Freelancer Uniquifier:", freelancerId);

      if (!freelancerId || freelancerId === "undefined") {
        this.error = "Freelancer ID is missing. Please log in again.";
        return;
      }

      try {
        const res = await fetch("/update_freelancer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...this.freelancer, freelancerId }),
        });

        const data = await res.json();

        if (res.ok) {
          this.success = "Profile updated successfully!";
          localStorage.setItem("name", this.freelancer.name);
          localStorage.setItem("email", this.freelancer.email);
          localStorage.setItem("experience", this.freelancer.experience);
          localStorage.setItem("portfolioUrl", this.freelancer.portfolio_url);
        } else {
          this.error = data.message;
        }
      } catch (error) {
        this.error =
          "An error occurred while updating the profile. Please try again.";
      }
    },
    async fetchServiceRequests() {
      const freelancerUniquifier = localStorage.getItem("freelancerId");
      console.log("Freelancer Uniquifier:", freelancerUniquifier);

      if (!freelancerUniquifier) {
        this.error = "Freelancer identifier is missing. Please log in again.";
        return;
      }

      try {
        const res = await fetch(
          `/api/service-requests/freelancer/${freelancerUniquifier}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch service requests");
        }
        const data = await res.json();
        this.requests = data;
      } catch (error) {
        this.error = "An error occurred while fetching service requests.";
        console.error(error);
      }
    },
    async updateRequestStatus(requestId, status) {
      try {
        const res = await fetch(`/api/request-service/${requestId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        const data = await res.json();

        if (res.ok) {
          this.success = `Request ${status} successfully!`;
          this.fetchServiceRequests(); // Refresh the requests after updating
        } else {
          this.error = data.error;
        }
      } catch (error) {
        this.error = "An error occurred while updating the request status.";
      }
    },
  },
  mounted() {
    this.fetchServiceRequests(); // Fetch requests on component mount
  },
  template: `
    <div class="container my-4">
      <h2 class="text-center mb-4">Freelancer Dashboard</h2>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <div class="border rounded shadow p-4 mb-4 animate__animated animate__fadeIn">
        <h3>Update Profile</h3>
        <form @submit.prevent="updateFreelancer">
          <div class="form-group">
            <label for="name">Name</label>
            <input v-model="freelancer.name" type="text" class="form-control" id="name" placeholder="Enter name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input v-model="freelancer.email" type="email" class="form-control" id="email" placeholder="Enter email" required>
          </div>
          <div class="form-group">
            <label for="experience">Experience</label>
            <input v-model="freelancer.experience" type="text" class="form-control" id="experience" placeholder="Enter experience" required>
          </div>
          <div class="form-group">
            <label for="portfolio">Portfolio URL</label>
            <input v-model="freelancer.portfolio_url" type="url" class="form-control" id="portfolio" placeholder="Enter portfolio URL" required>
          </div>
          <button type="submit" class="btn btn-dark mt-3">Update</button>
        </form>
      </div>

      <h3 class="mt-4">Service Requests</h3>
      <div v-if="requests.length === 0" class="alert alert-info">No service requests available.</div>
      <div class="alert alert-info">Request number: {{ requests.length }}</div>
      <div class="d-flex flex-wrap justify-content-start">
        <div class="cards m-2 p-3" v-for="request in requests" :key="request.request_id" style="width: 18rem; transition: transform 0.3s; border: 1px solid #ccc;">
          <div class="card-body">
            <h5 class="card-title">Request from: {{ request.user.user_name }}</h5>
            <p class="card-text">Email: {{ request.user.user_email }}</p>
            <p class="card-text">Status: <span :class="{ accepted: request.status === 'accepted', rejected: request.status === 'rejected' }">{{ request.status }}</span></p>
            <p class="card-text">Service Date: {{ new Date(request.service_date).toLocaleString() }}</p>
            <button v-if="request.status !== 'accepted'" class="btn btn-success btn-sm" @click="updateRequestStatus(request.request_id, 'accepted')">Accept</button>
            <button v-if="request.status !== 'rejected'" class="btn btn-danger btn-sm" @click="updateRequestStatus(request.request_id, 'rejected')">Reject</button>
          </div>
        </div>
      </div>
    </div>
  `,
};
