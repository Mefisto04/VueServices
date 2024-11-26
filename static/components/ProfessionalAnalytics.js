export default {
  data: () => ({
    analytics: {
      total_requests: 0,
      pending_requests: 0,
      accepted_requests: 0,
      rejected_requests: 0,
      completed_requests: 0,
      average_rating: 0,
      feedbacks: [],
      bookings_by_city: [],
    },
    error: "",
    loading: false,
  }),
  methods: {
    async fetchAnalytics() {
      const professionalId = localStorage.getItem("professionalId");

      if (!professionalId) {
        this.error = "Professional ID is missing. Please log in again.";
        return;
      }

      this.loading = true;

      try {
        const response = await fetch(
          `/api/professional/analytics/${professionalId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data.");
        }
        const data = await response.json();
        this.analytics = data;
      } catch (error) {
        this.error = "An error occurred while fetching analytics.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchAnalytics();
  },
  template: `
      <div class="container my-4">
        <h2 class="text-center mb-4">Professional Analytics</h2>
  
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="loading" class="alert alert-info">Loading analytics...</div>
  
        <div v-else class="analytics-container">
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="card p-3 text-center">
                <h5>Total Requests</h5>
                <h3>{{ analytics.total_requests }}</h3>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card p-3 text-center">
                <h5>Pending Requests</h5>
                <h3>{{ analytics.pending_requests }}</h3>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card p-3 text-center">
                <h5>Accepted Requests</h5>
                <h3>{{ analytics.accepted_requests }}</h3>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card p-3 text-center">
                <h5>Rejected Requests</h5>
                <h3>{{ analytics.rejected_requests }}</h3>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card p-3 text-center">
                <h5>Completed Requests</h5>
                <h3>{{ analytics.completed_requests }}</h3>
              </div>
            </div>
          </div>
        </div>

        <h3 class="mt-4">Feedbacks</h3>
        <div v-if="analytics.feedbacks.length === 0" class="alert alert-info">
            No feedbacks available.
        </div>
        <div v-else>
            <table class="table table-striped">
            <thead>
                <tr>
                <th>User ID</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="feedback in analytics.feedbacks" :key="feedback.user_id">
                <td>{{ feedback.user_id }}</td>
                \t<td>{{ feedback.rating }}</td>
                <td>{{ feedback.comments }}</td>
                <td>{{ new Date(feedback.created_at).toLocaleString() }}</td>
                </tr>
            </tbody>
            </table>
        </div>
      </div>`,
};
