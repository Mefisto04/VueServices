export default {
  data() {
    return {
      topProfessionals: [],
      popularServices: [],
      userCounts: { user_count: 0, professional_count: 0 },
      professionalChartImg: null,
      serviceChartImg: null,
    };
  },
  methods: {
    async fetchAnalyticsData() {
      try {
        // Fetch top professionals data and chart
        const professionalResponse = await fetch(
          "/api/top-rated-professionals"
        );
        const professionalData = await professionalResponse.json();
        this.topProfessionals = professionalData.data;
        this.professionalChartImg = professionalData.chart;

        // Fetch most booked services data and chart
        const servicesResponse = await fetch("/api/most-booked-services");
        const servicesData = await servicesResponse.json();
        this.popularServices = servicesData.data;
        this.serviceChartImg = servicesData.chart;

        // Fetch user counts
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
        <button @click="downloadCSV" class="btn btn-primary">Download Completed Services CSV</button>
      </div>

      <!-- Chart for Top 5 Rated Professionals -->
      <div class="mt-4">
        <h4>Top 5 Rated Professionals</h4>
        <div class="mt-3">
          <h5>Data:</h5>
          <ul>
            <li v-for="prof in topProfessionals" :key="prof.name">
              {{ prof.name }}: {{ prof.rating }} stars
            </li>
          </ul>
        </div>
      </div>

      <!-- Chart for Most Booked Services -->
      <div class="mt-4">
        <h4>Most Booked Services</h4>
        <img v-if="serviceChartImg" 
             :src="'data:image/png;base64,' + serviceChartImg" 
             alt="Services Chart"
             class="img-fluid"
        />
        <div class="mt-3">
          <h5>Data:</h5>
          <ul>
            <li v-for="service in popularServices" :key="service.service">
              {{ service.service }}: {{ service.count }} bookings
            </li>
          </ul>
        </div>
      </div>

      <!-- User and Professional Counts -->
      <div class="mt-4">
        <h4>User and Professional Counts</h4>
        <div class="card p-3 shadow-sm">
          <p><strong>Total Users:</strong> {{ userCounts.user_count }}</p>
          <p><strong>Total Professionals:</strong> {{ userCounts.professional_count }}</p>
        </div>
      </div>
    </div>
  `,
};
