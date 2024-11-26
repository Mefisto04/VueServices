export default {
  data: () => ({
    showModal: false,
    professionalList: [],
    filteredProfessionalList: [],
    serviceDate: null,
    upcomingServices: [],
    pastServices: [],
    serviceRequests: [],
    showFeedback: false,
    feedbackProfessionalId: null,
    feedbackRating: null,
    feedbackComments: "",
    services: [
      "Cleaning",
      "Gardening",
      "Plumbing",
      "Electrical Work",
      "Handyman",
      "Painting",
      "Moving",
      "Others",
    ],
    locations: [],
    selectedService: "",
    selectedLocation: "",
    selectedRating: null,
    searchQuery: "", // Added search query
    showEditModal: false,
    editServiceDate: null,
    editRequestId: null,
  }),
  methods: {
    getAllProfessionals() {
      fetch("/api/professional", {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Professional data:", data);
          this.professionalList = data;
          this.filteredProfessionalList = data; // Initialize filtered list
          console.log(this.professionalList);
        })
        .catch((error) => {
          console.error("Error fetching professionals:", error);
        });
    },
    filterProfessionals() {
      this.filteredProfessionalList = this.professionalList.filter(
        (professional) => {
          // Match by service, location, and rating
          const matchesService =
            !this.selectedService ||
            professional.service === this.selectedService;
          const matchesLocation =
            !this.selectedLocation ||
            professional.location === this.selectedLocation;
          const matchesRating =
            !this.selectedRating || professional.rating >= this.selectedRating;

          // Add search filtering for name, location, and service
          const matchesSearch =
            !this.searchQuery ||
            professional.name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            professional.location
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            professional.service
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase());

          return (
            matchesService && matchesLocation && matchesRating && matchesSearch
          );
        }
      );
    },
    requestService(professionalId) {
      const userId = localStorage.getItem("userId");
      console.log("User ID:", userId);
      console.log("Selected service date:", this.serviceDate);

      if (!this.serviceDate) {
        console.error("Service date is not set");
        return;
      }

      const requestPayload = {
        userId: userId,
        professional_id: professionalId,
        service_date: this.serviceDate,
      };

      console.log("Request Payload:", requestPayload);

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
          alert("Service request sent to professional!");
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
      this.feedbackProfessionalId = request.professional_id;
      this.serviceDate = request.service_date;
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
        professionalId: this.feedbackProfessionalId,
        rating: this.feedbackRating,
        comments: this.feedbackComments,
        service_date: this.serviceDate,
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
          this.getAllProfessionals();
        })
        .catch((error) => {
          console.error("Error submitting feedback:", error);
          alert("Error submitting feedback: " + error.message);
        });
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
          // Move the completed request from upcoming to past
          const requestIndex = this.serviceRequests.findIndex(
            (request) => request.id === requestId
          );
          if (requestIndex !== -1) {
            const request = this.serviceRequests.splice(requestIndex, 1)[0];
            request.status = status; // Update the status to 'completed'
            this.pastServices.push(request); // Add to past services
          }
        } else {
          this.error = data.error;
        }
      } catch (error) {
        this.error = "An error occurred while updating the request status.";
      }
    },
    openEditModal(requestId, currentServiceDate) {
      this.showEditModal = true;
      this.editServiceDate = currentServiceDate;
      this.editRequestId = requestId;
    },
    updateServiceRequestDate() {
      const updatedRequestPayload = {
        service_date: this.editServiceDate,
      };

      fetch(`/api/request-service-by-user/${this.editRequestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRequestPayload),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to update service date.");
          }
          return res.json();
        })
        .then((data) => {
          alert("Service date updated successfully!");
          this.getAllServiceRequests();
          this.showEditModal = false;
        })
        .catch((error) => {
          console.error("Error updating service date:", error);
          alert("Error updating service date: " + error.message);
        });
    },
    submitServiceDate(requestId, selectedDate) {
      if (!selectedDate) {
        alert("Please select a service date.");
        return;
      }

      const requestPayload = {
        service_date: selectedDate,
      };

      fetch(`/api/request-service-by-user/${requestId}`, {
        // Ensure requestId is passed, not professionalId
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(`Failed to submit service date: ${text}`);
            });
          }
          return res.json();
        })
        .then((data) => {
          console.log("Service date submitted successfully:", data);
          alert("Service date has been submitted successfully!");
          // Optionally refresh service requests or clear selected date after submission
          this.serviceDate = null;
          this.getAllServiceRequests();
        })
        .catch((error) => {
          console.error("Error submitting service date:", error);
          alert("Error submitting service date: " + error.message);
        });
    },

    getUserDashboard() {
      const userId = localStorage.getItem("userId");
      console.log("User ID:", userId);
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }

      fetch(`/api/user_dashboard/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`, // Authentication token
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch user dashboard data");
          }
          return res.json();
        })
        .then((data) => {
          this.userDashboard = data; // Store the response data in the userDashboard
          console.log("User Dashboard Data:", data);
        })
        .catch((error) => {
          console.error("Error fetching user dashboard:", error);
        });
    },

    // Existing method to filter professionals based on search, service, location, and rating
    filterProfessionals() {
      this.filteredProfessionalList = this.professionalList.filter(
        (professional) => {
          const matchesService =
            !this.selectedService ||
            professional.service === this.selectedService;
          const matchesLocation =
            !this.selectedLocation ||
            professional.location === this.selectedLocation;
          const matchesRating =
            !this.selectedRating || professional.rating >= this.selectedRating;
          const matchesSearch =
            !this.searchQuery ||
            professional.name
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            professional.location
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            professional.service
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase());

          return (
            matchesService && matchesLocation && matchesRating && matchesSearch
          );
        }
      );
    },

    // Button action to log user details
    logUserDetails() {
      console.log("User Dashboard Details:", this.userDashboard);
    },
  },
  created() {
    this.getAllProfessionals();
    this.getAllServiceRequests();
  },
  template: `
  <div class="px-3 mt-3 pb-5">
    <h3 class="mb-4" style="color: #333; font-weight: 600;">Past Services</h3>
    
    <!-- Service Cards -->
    <div class="row">
      <div class="col-lg-4" v-for="(request, k) in serviceRequests" :key="request.id" v-if="request.status == 'completed'">
        <div class="card mb-4" style="
          border: none;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
          background: white;
          overflow: hidden;
        "
        onmouseover="this.style.transform='translateY(-5px)'"
        onmouseout="this.style.transform='translateY(0)'">
          <div class="card-body" style="padding: 1.5rem;">
            <h5 class="card-title" style="
              color: #2c3e50;
              font-size: 1.1rem;
              font-weight: 600;
              margin-bottom: 1rem;
              text-align: center;
            ">Service Request to Professional ID: {{ request.professional_id }}</h5>
            
            <div style="
              background-color: #f8f9fa;
              padding: 0.8rem;
              border-radius: 8px;
              margin-bottom: 1rem;
            ">
              <p class="card-text" style="
                margin: 0;
                color: #6c757d;
                font-size: 0.9rem;
              ">Service Date: {{ new Date(request.service_date).toLocaleString() }}</p>
            </div>
            
            <div style="
              background-color: #e8f4ff;
              padding: 0.5rem;
              border-radius: 8px;
              margin-bottom: 1rem;
            ">
              <p class="card-text" style="
                margin: 0;
                color: #0056b3;
                font-weight: 500;
                text-align: center;
              ">Status: {{ request.status }}</p>
            </div>
            
            <button  v-if="!request.is_completed" class="btn btn-primary"  @click="showFeedbackForm(request)" style="
              width: 100%;
              background-color: #007bff;
              border: none;
              padding: 0.8rem;
              border-radius: 8px;
              font-weight: 500;
              transition: background-color 0.2s ease;
            "
            onmouseover="this.style.backgroundColor='#0056b3'"
            onmouseout="this.style.backgroundColor='#007bff'">
              Give Feedback
            </button>
          </div>
        </div>
      </div>
    </div>

    <hr style="margin: 2rem 0; border-color: #dee2e6;"/>

    <!-- Feedback Form Modal -->
    <div v-if="showFeedback" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    ">
      <div style="
        background: white;
        padding: 2rem;
        border-radius: 15px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      ">
        <h4 style="
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-weight: 600;
          text-align: center;
        ">Feedback for Professional ID: {{ feedbackProfessionalId }}</h4>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="
            display: block;
            margin-bottom: 0.5rem;
            color: #495057;
            font-weight: 500;
          ">Rating (0-10):</label>
          <input type="number" 
            v-model="feedbackRating" 
            min="0" 
            max="10" 
            style="
              width: 100%;
              padding: 0.8rem;
              border: 2px solid #dee2e6;
              border-radius: 8px;
              font-size: 1rem;
              transition: border-color 0.2s ease;
            "
            onmouseover="this.style.borderColor='#007bff'"
            onmouseout="this.style.borderColor='#dee2e6'"
          />
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="
            display: block;
            margin-bottom: 0.5rem;
            color: #495057;
            font-weight: 500;
          ">Comments:</label>
          <textarea 
            v-model="feedbackComments"
            style="
              width: 100%;
              padding: 0.8rem;
              border: 2px solid #dee2e6;
              border-radius: 8px;
              min-height: 100px;
              font-size: 1rem;
              resize: vertical;
              transition: border-color 0.2s ease;
            "
            onmouseover="this.style.borderColor='#007bff'"
            onmouseout="this.style.borderColor='#dee2e6'"
          ></textarea>
        </div>
        
        <div style="
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        ">
          <button class="btn btn-secondary" 
            @click="cancelFeedback"
            style="
              padding: 0.8rem 1.5rem;
              border-radius: 8px;
              font-weight: 500;
              border: none;
              transition: background-color 0.2s ease;
            "
          >Cancel</button>
          <button class="btn btn-success" 
            @click="submitFeedback"
            style="
              padding: 0.8rem 1.5rem;
              border-radius: 8px;
              font-weight: 500;
              border: none;
              background-color: #28a745;
              transition: background-color 0.2s ease;
            "
            onmouseover="this.style.backgroundColor='#218838'"
            onmouseout="this.style.backgroundColor='#28a745'"
          >Submit Feedback</button>
        </div>
      </div>
    </div>
  </div>
`,
};
