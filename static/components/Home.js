export default {
  data: () => ({
    showModal: false,
    freelancerList: [],
    serviceDate: null,
    upcomingServices: [],
    pastServices: [],
    serviceRequests: [],
    showFeedback: false,
    feedbackFreelancerId: null,
    feedbackRating: null,
    feedbackComments: "",
  }),
  methods: {
    getAllFreelancers() {
      fetch("/api/freelancer", {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Freelancer data:", data);
          this.freelancerList = data;
          console.log(this.freelancerList);
        })
        .catch((error) => {
          console.error("Error fetching freelancers:", error);
        });
    },
    requestService(freelancerId) {
      const userId = localStorage.getItem("userId");
      console.log("User ID:", userId);
      console.log("Selected service date:", this.serviceDate);

      if (!this.serviceDate) {
        console.error("Service date is not set");
        return;
      }

      const requestPayload = {
        userId: userId,
        freelancer_id: freelancerId,
        service_date: this.serviceDate,
      };

      console.log("Request Payload:", requestPayload); // Log the payload

      fetch("/api/request-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(`Service request failed: ${text}`);
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log("Service request successful:", data);
          alert("Service request sent to freelancer!");
        })
        .catch((error) => {
          console.error("Error sending service request:", error);
          alert("Error sending service request: " + error.message);
        });
    },
    getAllServiceRequests() {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID is not available. Please log in again.");
        return;
      }
      console.log("Fetching service requests for user:", userId);
      fetch(`/api/service-requests/${userId}`, {
        method: "GET",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch service requests");
          }
          return res.json();
        })
        .then((data) => {
          this.serviceRequests = data;
          console.log(this.serviceRequests);
        })
        .catch((error) => {
          console.error("Error fetching service requests:", error);
        });
    },
    showFeedbackForm(request) {
      this.showFeedback = true;
      this.feedbackFreelancerId = request.freelancer_id;
    },
    cancelFeedback() {
      this.showFeedback = false;
      this.feedbackRating = null;
      this.feedbackComments = "";
    },
    submitFeedback() {
      const userId = localStorage.getItem("userId");
      const feedbackPayload = {
        userId: userId,
        freelancerId: this.feedbackFreelancerId,
        rating: this.feedbackRating,
        comments: this.feedbackComments,
      };

      fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackPayload),
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(`Feedback submission failed: ${text}`);
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log("Feedback submitted successfully:", data);
          alert("Feedback submitted successfully!");
          this.cancelFeedback();
          this.getAllFreelancers();
        })
        .catch((error) => {
          console.error("Error submitting feedback:", error);
          alert("Error submitting feedback: " + error.message);
        });
    },
  },
  created() {
    this.getAllFreelancers();
    this.getAllServiceRequests();
  },
  template: `
    <div class="px-3 mt-3 pb-5">
  <h3 class="mb-4">Upcoming Services</h3>
  <div class="row">
    <div class="col-lg-4" v-for="(request, k) in serviceRequests" :key="request.id" v-if="new Date(request.service_date) > new Date()">
      <div class="card shadow-sm mb-3" style="border-radius: 10px;">
        <div class="card-body text-center">
          <h5 class="card-title">Service Request to Freelancer ID: {{ request.freelancer_id }}</h5>
          <p class="card-text">Service Date: {{ new Date(request.service_date).toLocaleString() }}</p>
          <p class="card-text">Status: {{ request.status }}</p>
        </div>
      </div>
    </div>
  </div>
  <hr/>
  
  <!-- Past Services Section -->
  <h3 class="mb-4">Past Services</h3>
  <div class="row">
    <div class="col-lg-4" v-for="(request, k) in serviceRequests" :key="request.id" v-if="new Date(request.service_date) <= new Date()">
      <div class="card shadow-sm mb-3" style="border-radius: 10px;">
        <div class="card-body text-center">
          <h5 class="card-title">Service Request to Freelancer ID: {{ request.freelancer_id }}</h5>
          <p class="card-text">Service Date: {{ new Date(request.service_date).toLocaleString() }}</p>
          <p class="card-text">Status: {{ request.status }}</p>
          <button class="btn btn-primary" @click="showFeedbackForm(request)">Give Feedback</button>
        </div>
      </div>
    </div>
  </div>
  
  <hr/>

  <!-- Feedback Form -->
  <div v-if="showFeedback" class="feedback-form">
    <h4>Feedback for Freelancer ID: {{ feedbackFreelancerId }}</h4>
    <div>
      <label>Rating (0-10):</label>
      <input type="number" v-model="feedbackRating" min="0" max="10" />
    </div>
    <div>
      <label>Comments:</label>
      <textarea v-model="feedbackComments"></textarea>
    </div>
    <button class="btn btn-success" @click="submitFeedback">Submit Feedback</button>
    <button class="btn btn-secondary" @click="cancelFeedback">Cancel</button>
  </div>
  <hr/>
  <h3 class="mb-4">Freelancers</h3>
  <div class="row">
    <div class="col-lg-4" v-for="(freelancer, j) in freelancerList" :key="freelancer.id" v-if="freelancer.is_approved">
      <div class="card shadow-sm mb-3" style="border-radius: 10px;">
        <div class="card-body text-center">
          <h5 class="card-title">{{ freelancer.name }}</h5>
          <p class="card-text">Rating: {{ freelancer.rating || 'Not rated yet' }}</p>
          <p class="card-text">Service: {{ freelancer.service }}</p>
          <p class="card-text">Email: {{ freelancer.email }}</p>
          <p class="card-text">Experience: {{ freelancer.experience }}</p>
          <a v-if="freelancer.portfolio_url && freelancer.portfolio_url !== 'null'" 
             :href="freelancer.portfolio_url" class="btn btn-primary mb-2" target="_blank">View Portfolio</a>
          <div class="form-group mt-2">
            <label for="serviceDate">Select Date and Time:</label>
            <input type="datetime-local" v-model="serviceDate" class="form-control mt-3" />
          </div>
          <button class="btn btn-success mt-3" @click="requestService(freelancer.id)">Request Service</button>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
};
