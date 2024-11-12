export default {
  data() {
    return {
      topProfessionals: [],
      popularServices: [],
      userCounts: { user_count: 0, professional_count: 0 },
    };
  },
  methods: {
    async fetchAnalyticsData() {
      try {
        const professionalResponse = await fetch(
          "/api/top-rated-professionals"
        );
        this.topProfessionals = await professionalResponse.json();

        const servicesResponse = await fetch("/api/most-booked-services");
        this.popularServices = await servicesResponse.json();

        const countsResponse = await fetch("/api/user-professional-counts");
        this.userCounts = await countsResponse.json();
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    },
    downloadCSV() {
      // Trigger the download by creating a temporary link
      const link = document.createElement("a");
      link.href = "/api/export-completed-services"; // The route that generates the CSV
      link.download = "completed_services.csv"; // Filename for the downloaded file
      link.click();
    },
  },
  created() {
    this.fetchAnalyticsData();
  },
  template: `
    <div class="admin-analytics px-3 mt-3 pb-5">
      <h3>Admin Analytics Dashboard</h3>

      <div class="mt-4">
        <h4>Top 5 Rated Professionals</h4>
        <div class="professional-cards">
          <div v-for="professional in topProfessionals" :key="professional.name" class="card mb-3 p-3 shadow-sm">
            <h5>{{ professional.name }}</h5>
            <p>Rating: {{ professional.rating.toFixed(1) }}</p>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4>Most Booked Services</h4>
        <div class="service-cards">
          <div v-for="service in popularServices" :key="service.service" class="card mb-3 p-3 shadow-sm">
            <h5>{{ service.service }}</h5>
            <p>Bookings: {{ service.count }}</p>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4>User and Professional Counts</h4>
        <div class="card p-3 shadow-sm">
          <p><strong>Total Users:</strong> {{ userCounts.user_count }}</p>
          <p><strong>Total Professionals:</strong> {{ userCounts.professional_count }}</p>
        </div>
      </div>

      <!-- Button to download CSV -->
      <div class="mt-4">
        <button @click="downloadCSV" class="btn btn-primary">Download Completed Services CSV</button>
      </div>
    </div>
  `,
};
