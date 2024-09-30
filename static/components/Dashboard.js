// export default {
//   data: () => ({
//     freelancer: {
//       name: localStorage.getItem("name") || "",
//       email: localStorage.getItem("email") || "",
//       experience: localStorage.getItem("experience") || "",
//       portfolio_url: localStorage.getItem("portfolioUrl") || "",
//     },
//     error: "",
//     success: "",
//   }),
//   methods: {
//     async updateFreelancer() {
//       const freelancerId = localStorage.getItem("freelancerId");
//       console.log("Freelancer ID from localStorage:", freelancerId);

//       // Check if freelancerId exists
//       if (!freelancerId || freelancerId === "undefined") {
//         this.error = "Freelancer ID is missing. Please log in again.";
//         return;
//       }

//       try {
//         const res = await fetch("/update_freelancer", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ ...this.freelancer, freelancerId }),
//         });

//         const data = await res.json();

//         if (res.ok) {
//           this.success = "Profile updated successfully!";
//           // Update localStorage values after successful update
//           localStorage.setItem("name", this.freelancer.name);
//           localStorage.setItem("experience", this.freelancer.experience);
//           localStorage.setItem("portfolioUrl", this.freelancer.portfolio_url);
//         } else {
//           this.error = data.message;
//         }
//       } catch (error) {
//         this.error =
//           "An error occurred while updating the profile. Please try again.";
//       }
//     },
//   },
//   template: `
//       <div class="container">
//         <h2>Freelancer Dashboard</h2>
//         <div v-if="error" class="alert alert-danger">
//           {{ error }}
//         </div>
//         <div v-if="success" class="alert alert-success">
//           {{ success }}
//         </div>

//         <form @submit.prevent="updateFreelancer">
//           <div class="form-group">
//             <label for="name">Name</label>
//             <input v-model="freelancer.name" type="text" class="form-control" id="name" placeholder="Enter name">
//           </div>

//           <div class="form-group">
//             <label for="email">Email</label>
//             <input v-model="freelancer.email" type="email" class="form-control" id="email" placeholder="Enter email">
//           </div>

//           <div class="form-group">
//             <label for="experience">Experience</label>
//             <input v-model="freelancer.experience" type="text" class="form-control" id="experience" placeholder="Enter experience">
//           </div>

//           <div class="form-group">
//             <label for="portfolio">Portfolio URL</label>
//             <input v-model="freelancer.portfolio_url" type="url" class="form-control" id="portfolio" placeholder="Enter portfolio URL">
//           </div>

//           <button type="submit" class="btn btn-dark mt-3">Update</button>
//         </form>
//       </div>
//     `,
// };

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
      console.log("Freelancer ID from localStorage:", freelancerId);

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
      const freelancerUniquifier = localStorage.getItem("fs_uniquifier"); // Assuming you're storing it in localStorage
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
        this.serviceRequests = data; // Assuming you have a serviceRequests array in your data
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
          // Refresh the requests after updating
          this.fetchServiceRequests();
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
    <div class="container">
      <h2>Freelancer Dashboard</h2>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <form @submit.prevent="updateFreelancer">
        <!-- Existing form fields for freelancer information -->
        <div class="form-group">
          <label for="name">Name</label>
          <input v-model="freelancer.name" type="text" class="form-control" id="name" placeholder="Enter name">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="freelancer.email" type="email" class="form-control" id="email" placeholder="Enter email">
        </div>
        <div class="form-group">
          <label for="experience">Experience</label>
          <input v-model="freelancer.experience" type="text" class="form-control" id="experience" placeholder="Enter experience">
        </div>
        <div class="form-group">
          <label for="portfolio">Portfolio URL</label>
          <input v-model="freelancer.portfolio_url" type="url" class="form-control" id="portfolio" placeholder="Enter portfolio URL">
        </div>
        <button type="submit" class="btn btn-dark mt-3">Update</button>
      </form>

      <h3 class="mt-4">Service Requests</h3>
      <div v-if="requests.length === 0" class="alert alert-info">No service requests available.</div>
      <ul v-else>
        <li v-for="request in requests" :key="request.request_id">
          Request from User ID: {{ request.user_id }} - Status: {{ request.status }}
          <button class="btn btn-success btn-sm ml-2" @click="updateRequestStatus(request.request_id, 'accepted')">Accept</button>
          <button class="btn btn-danger btn-sm ml-2" @click="updateRequestStatus(request.request_id, 'rejected')">Reject</button>
        </li>
      </ul>
    </div>
  `,
};
