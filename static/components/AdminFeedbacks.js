export default {
  data: () => ({
    feedbacks: [], // Stores feedback data
  }),
  methods: {
    fetchFeedbacks() {
      fetch("/admin/feedbacks", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          this.feedbacks = data.feedbacks;
        })
        .catch((err) => console.error("Error fetching feedbacks:", err));
    },
  },
  created() {
    this.fetchFeedbacks(); // Fetch feedback data on component creation
  },
  template: `
      <div class="px-3 mt-3 pb-5">
        <h3>All Feedbacks</h3>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Professional</th>
              <th>Service</th>
              <th>Service Date</th>
              <th>Rating</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feedback in feedbacks" :key="feedback.id">
              <td>{{ feedback.id }}</td>
              <td>{{ feedback.user }}</td>
              <td>{{ feedback.professional }}</td>
              <td>{{ feedback.service }}</td>
              <td>{{ feedback.service_date }}</td>
              <td>{{ feedback.rating }}</td>
              <td>{{ feedback.comments }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
};
