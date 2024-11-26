export default {
  data: () => ({
    showModal: false,
    professionalList: [],
    filteredProfessionalList: [],
    serviceDates: {},
    upcomingServices: [],
    pastServices: [],
    serviceRequests: [],
    showFeedback: false,
    feedbackProfessionalId: null,
    feedbackRating: null,
    feedbackComments: "",
    services: [],
    locations: [],
    selectedService: "",
    selectedLocation: "",
    selectedRating: null,
    searchQuery: "", // Added search query
    showEditModal: false,
    editServiceDate: null,
    editRequestId: null,
    serviceError: null,
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
    fetchLocations() {
      fetch("/api/locations", {
        // Create this endpoint in your backend
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to load locations");
          }
          return res.json();
        })
        .then((data) => {
          this.locations = data.locations;
        })
        .catch((error) => {
          console.error("Error fetching locations:", error);
        });
    },
    fetchServices() {
      fetch("/api/services", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to load services");
          }
          return res.json();
        })
        .then((data) => {
          // Store just the service names in the services array
          this.services = data.services.map((service) => service.name);
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
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
      const selectedServiceDate = this.serviceDates[professionalId];
      console.log("User ID:", userId);
      console.log("Selected service date:", selectedServiceDate);

      if (!selectedServiceDate || selectedServiceDate.trim() === "") {
        console.error("Service date is not set");
        return;
      }

      const requestPayload = {
        userId: userId,
        professional_id: professionalId,
        service_date: selectedServiceDate,
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
          if (res.status === 409) {
            return res.text().then((text) => {
              throw new Error(`Professional is busy: ${text}`);
            });
          } else if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(`Service request failed: ${text}`);
            });
          }
          return res.json();
        })
        .then((data) => {
          alert("Service request sent to professional!");
          console.log("Service request successful:", data);
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
          this.$set(this.serviceDates, professionalId, null);
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
    this.fetchServices();
    this.fetchLocations();
  },
  template: `
      <div class="px-3 mt-3 pb-5">
        <h3 class="mb-4">Filter Professionals</h3>
        <div class="row mb-4">
          <!-- Search Bar -->
          <div class="col-md-12">
            <label for="search">Search:</label>
            <input type="text" v-model="searchQuery" @input="filterProfessionals" class="form-control" placeholder="Search by name, location, or service"/>
          </div>
          <div class="col-md-4">
            <label for="service">Service Type:</label>
            <select v-model="selectedService" @change="filterProfessionals" class="form-control">
              <option value="">All Services</option>
              <option v-for="service in services" :key="service" :value="service">{{ service }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="location">Location:</label>
            <select v-model="selectedLocation" @change="filterProfessionals" class="form-control">
              <option value="">All Locations</option>
              <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="rating">Rating (≥):</label>
            <select v-model="selectedRating" @change="filterProfessionals" class="form-control">
              <option value="">Any Rating</option>
              <option v-for="rating in [1,2,3,4,5,6,7,8,9,10]" :key="rating" :value="rating">{{ rating }}</option>
            </select>
          </div>
        </div>
  
        <h3 class="mb-4">Professionals</h3>
        <div class="row">
          <div class="col-lg-3" v-for="(professional, j) in filteredProfessionalList" :key="professional.id" v-if="professional.is_approved">
            <div class="card shadow-sm mb-3" style="border-radius: 10px;">
              <div class="card-body text-center">
                <h5 class="card-title">{{ professional.name }}</h5>
                <p class="card-text">Rating: {{ professional.rating || 'Not rated yet' }}</p>
                <p class="card-text">Location: {{ professional.location }}</p>
                <p class="card-text">Service: {{ professional.service }}</p>
                <p class="card-text">Email: {{ professional.email }}</p>
                <p class="card-text">Experience: {{ professional.experience }}</p>
                <a v-if="professional.portfolio_url && professional.portfolio_url !== 'null'" 
                   :href="professional.portfolio_url" class="btn btn-primary mb-2" target="_blank">View Portfolio</a>
                <div class="form-group mt-2">
                  <label for="serviceDate">Select Date and Time:</label>
                  <input type="datetime-local" 
                    v-model="serviceDates[professional.id]" 
                    class="form-control mt-3" />
                </div>
                <div v-if="serviceError" class="alert alert-danger mt-3">
                  {{ serviceError }}
                </div>
                <button class="btn btn-success mt-3" @click="requestService(professional.id)">Request Service</button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
};
