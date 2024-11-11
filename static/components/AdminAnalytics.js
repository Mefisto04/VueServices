export default {
  data() {
    return {
      topFreelancers: [],
      popularServices: [],
      userCounts: { user_count: 0, freelancer_count: 0 },
    };
  },
  methods: {
    async fetchAnalyticsData() {
      try {
        const freelancerResponse = await fetch("/api/top-rated-freelancers");
        this.topFreelancers = await freelancerResponse.json();

        const servicesResponse = await fetch("/api/most-booked-services");
        this.popularServices = await servicesResponse.json();

        const countsResponse = await fetch("/api/user-freelancer-counts");
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
        <h4>Top 5 Rated Freelancers</h4>
        <div class="freelancer-cards">
          <div v-for="freelancer in topFreelancers" :key="freelancer.name" class="card mb-3 p-3 shadow-sm">
            <h5>{{ freelancer.name }}</h5>
            <p>Rating: {{ freelancer.rating.toFixed(1) }}</p>
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
        <h4>User and Freelancer Counts</h4>
        <div class="card p-3 shadow-sm">
          <p><strong>Total Users:</strong> {{ userCounts.user_count }}</p>
          <p><strong>Total Freelancers:</strong> {{ userCounts.freelancer_count }}</p>
        </div>
      </div>

      <!-- Button to download CSV -->
      <div class="mt-4">
        <button @click="downloadCSV" class="btn btn-primary">Download Completed Services CSV</button>
      </div>
    </div>
  `,
};
