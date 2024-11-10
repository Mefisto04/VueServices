export default {
  data: () => ({
    analyticsData: {
      topFreelancers: [],
      popularServices: [],
      userCount: 0,
      freelancerCount: 0,
    },
    charts: {},
  }),
  methods: {
    async fetchAnalyticsData() {
      try {
        const res = await fetch("/admin/analytics", { method: "GET" });
        if (!res.ok) throw new Error(`Error fetching analytics: ${res.status}`);

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const data = await res.json();
        this.analyticsData = data;
        this.initializeCharts();
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    },
    initializeCharts() {
      Object.values(this.charts).forEach((chart) => chart.destroy());

      // Top freelancers bar chart
      this.charts.topFreelancersChart = new Chart(
        document.getElementById("topFreelancersChart"),
        {
          type: "bar",
          data: {
            labels: this.analyticsData.topFreelancers.map((f) => f.name),
            datasets: [
              {
                label: "Rating",
                data: this.analyticsData.topFreelancers.map((f) => f.rating),
                backgroundColor: "#4caf50",
              },
            ],
          },
        }
      );

      // Popular services bar chart
      this.charts.popularServicesChart = new Chart(
        document.getElementById("popularServicesChart"),
        {
          type: "bar",
          data: {
            labels: this.analyticsData.popularServices.map((s) => s.service),
            datasets: [
              {
                label: "Bookings",
                data: this.analyticsData.popularServices.map((s) => s.count),
                backgroundColor: "#42a5f5",
              },
            ],
          },
        }
      );

      // User and freelancer count doughnut chart
      this.charts.userFreelancerCountChart = new Chart(
        document.getElementById("userFreelancerCountChart"),
        {
          type: "doughnut",
          data: {
            labels: ["Users", "Freelancers"],
            datasets: [
              {
                label: "Counts",
                data: [
                  this.analyticsData.userCount,
                  this.analyticsData.freelancerCount,
                ],
                backgroundColor: ["#ffca28", "#8e24aa"],
              },
            ],
          },
        }
      );
    },
  },
  created() {
    this.fetchAnalyticsData();
  },
  beforeDestroy() {
    Object.values(this.charts).forEach((chart) => chart.destroy());
  },
  template: `
    <div class="admin-analytics px-3 mt-3 pb-5">
      <h3>Admin Analytics Dashboard</h3>

      <div>
        <h4>Top 5 Rated Freelancers</h4>
        <canvas id="topFreelancersChart"></canvas>
      </div>

      <div>
        <h4>Most Booked Services</h4>
        <canvas id="popularServicesChart"></canvas>
      </div>

      <div>
        <h4>User and Freelancer Counts</h4>
        <canvas id="userFreelancerCountChart"></canvas>
      </div>
    </div>
  `,
};
