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

    // Button action to log user details
    logUserDetails() {
      console.log("User Dashboard Details:", this.userDashboard);
    },
  },
  created() {
    this.getAllProfessionals();
  },
  template: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
      <!-- Hero Section -->
      <section style="text-align: center; padding: 40px; background-color:rgba(0, 123, 255, 0.42); color: black; border-radius: 8px;">
        <h1>Welcome to Our Professional Service Booking Platform</h1>
        <p style="font-size: 1.2em;">Find top-rated professionals for a wide range of services, all based on your location and preferences.</p>
      </section>

      <!-- How It Works Section -->
      <section style="text-align: center; margin-top: 60px; padding: 20px;">
        <h2>How It Works</h2>
        <p style="font-size: 1.2em;">Booking a service has never been easier. Just follow these simple steps:</p>
        
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <div style="flex: 1; margin: 0 20px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h4>Step 1: Choose Your Service</h4>
            <p>Select the service you need from our wide range of options.</p>
          </div>
          <div style="flex: 1; margin: 0 20px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h4>Step 2: Select Your Location</h4>
            <p>Enter your location to view professionals near you. Get the best service right at your doorstep.</p>
          </div>
          <div style="flex: 1; margin: 0 20px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h4>Step 3: Book Your Appointment</h4>
            <p>Choose the available time slot that works for you and confirm your booking with a few simple clicks!</p>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section style="margin-top: 60px; padding: 40px; background-color: #f1f1f1;">
        <h2 style="text-align: center;">What Our Users Say</h2>
        <div style="display: flex; justify-content: space-around; margin-top: 20px;">
          <div style="flex: 1; margin-right: 20px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <p style="font-style: italic;">"I found an amazing plumber right near my area. The service was excellent and timely!"</p>
            <p>- John D.</p>
          </div>
          
          <div style="flex: 1; margin-right: 20px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <p style="font-style: italic;">"Great experience with a top-rated electrician! Would definitely recommend this platform."</p>
            <p>- Sarah T.</p>
          </div>
          
          <div style="flex: 1; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <p style="font-style: italic;">"Easy to use, quick booking, and top-notch service. Highly recommended!"</p>
            <p>- Mike S.</p>
          </div>
        </div>
      </section>
    </div>
  `,
};
