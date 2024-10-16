// import Book from "./Partials/Book.js";
// import BookDetailsModal from "./Partials/BookDetailsModal.js";

// export default {
//   data: () => ({
//     showModal: false,
//     bookList: [],
//     freelancerList: [],
//     serviceDate: null,
//     upcomingServices: [],
//     pastServices: [],
//     serviceRequests: [],
//   }),
//   methods: {
//     getAllBooks() {
//       fetch("/api/book", {
//         method: "GET",
//         headers: {
//           "Authentication-Token": localStorage.getItem("auth-token"),
//         },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           this.bookList = data;
//           console.log(this.bookList);
//         });
//     },
//     getAllFreelancers() {
//       fetch("/api/freelancer", {
//         method: "GET",
//       })
//         .then((res) => {
//           if (!res.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return res.json();
//         })
//         .then((data) => {
//           this.freelancerList = data;
//           console.log(this.freelancerList);
//         })
//         .catch((error) => {
//           console.error("Error fetching freelancers:", error);
//         });
//     },
//     requestService(freelancerId) {
//       const userId = localStorage.getItem("user-id");
//       console.log("User ID:", userId);

//       if (!this.serviceDate) {
//         console.error("Service date is not set");
//         return;
//       }

//       fetch("/api/request-service", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           user_id: userId, // Use userId from local storage
//           freelancer_id: freelancerId,
//           service_date: this.serviceDate,
//         }),
//       })
//         .then((res) => {
//           if (!res.ok) {
//             return res.text().then((text) => {
//               throw new Error(`Service request failed: ${text}`);
//             });
//           }
//           return res.json();
//         })
//         .then((data) => {
//           console.log("Service request successful:", data);
//           alert("Service request sent to freelancer!");
//         })
//         .catch((error) => {
//           console.error("Error sending service request:", error);
//           alert("Error sending service request: " + error.message);
//         });
//       // console.log("Selected service date:", this.serviceDate);
//     },
//     getAllServiceRequests() {
//       const userId = localStorage.getItem("user-id");
//       fetch(`/api/service-requests/${userId}`, {
//         method: "GET",
//         headers: {
//           "Authentication-Token": localStorage.getItem("auth-token"),
//         },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           this.serviceRequests = data;
//           console.log(this.serviceRequests);
//         })
//         .catch((error) => {
//           console.error("Error fetching service requests:", error);
//         });
//     },

//     showBookDetail(book) {
//       this.$refs.bookModal.viewModal(book);
//     },
//   },
//   created() {
//     this.getAllBooks();
//     this.getAllFreelancers();
//     this.getAllServiceRequests();
//   },
//   template: `
//     <div class="px-3 mt-3 pb-5">
//         <h3 class="mb-0 mt-4">Upcoming Services</h3>
//         <div class="row justify-content-left">
//             <div class="col-lg-2 mt-3" v-for="(request, k) in serviceRequests" :key="k" v-if="new Date(request.service_date) > new Date()">
//                 <div class="card" style="border: 1px solid #ccc; border-radius: 5px; margin: 10px;">
//                     <div class="card-body" style="text-align: center;">
//                         <h5 class="card-title">Service Request to Freelancer ID: {{ request.freelancer_id }}</h5>
//                         <p class="card-text">Service Date: {{ new Date(request.service_date).toLocaleString() }}</p>
//                         <p class="card-text">Status: {{ request.status }}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <!-- Past Services Section -->
//         <h3 class="mb-0 mt-4">Past Services</h3>
//         <div class="row justify-content-left">
//             <div class="col-lg-2 mt-3" v-for="(request, k) in serviceRequests" :key="k" v-if="new Date(request.service_date) <= new Date()">
//                 <div class="card" style="border: 1px solid #ccc; border-radius: 5px; margin: 10px;">
//                     <div class="card-body" style="text-align: center;">
//                         <h5 class="card-title">Service Request to Freelancer ID: {{ request.freelancer_id }}</h5>
//                         <p class="card-text">Service Date: {{ new Date(request.service_date).toLocaleString() }}</p>
//                         <p class="card-text">Status: {{ request.status }}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <h3 class="mb-0 mt-4">Freelancers</h3>
//         <div class="row justify-content-left">
//             <div class="col-lg-2 mt-3" v-for="(freelancer, j) in freelancerList" :key="j">
//                 <div class="card" style="border: 1px solid #ccc; border-radius: 5px; margin: 10px;">
//                     <div class="card-body" style="text-align: center;">
//                         <h5 class="card-title">{{ freelancer.name }}</h5>
//                         <p class="card-text">Email: {{ freelancer.email }}</p>
//                         <p class="card-text">Experience: {{ freelancer.experience }}</p>
//                         <a v-if="freelancer.portfolio_url && freelancer.portfolio_url !== 'null'"
//                            :href="freelancer.portfolio_url" class="btn btn-primary" target="_blank">View Portfolio</a>
//                         <label for="serviceDate">Select Date and Time:</label>
//                         <input type="datetime-local" v-model="serviceDate" />
//                         <button class="btn btn-success mt-2" @click="requestService(freelancer.id)">Request Service</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//   `,
//   components: { Book, BookDetailsModal },
// };

export default {
  data: () => ({
    showModal: false,
    bookList: [],
    freelancerList: [],
    serviceDate: null,
    upcomingServices: [],
    pastServices: [],
    serviceRequests: [],
  }),
  methods: {
    getAllBooks() {
      fetch("/api/book", {
        method: "GET",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.bookList = data;
          console.log(this.bookList);
        });
    },
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
          this.freelancerList = data;
          console.log(this.freelancerList);
        })
        .catch((error) => {
          console.error("Error fetching freelancers:", error);
        });
    },
    requestService(freelancerId) {
      const userId = localStorage.getItem("user-id");
      console.log("User ID:", userId);

      if (!this.serviceDate) {
        console.error("Service date is not set");
        return;
      }

      fetch("/api/request-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId, // Use userId from local storage
          freelancer_id: freelancerId,
          service_date: this.serviceDate,
        }),
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
      // console.log("Selected service date:", this.serviceDate);
    },
    getAllServiceRequests() {
      const userId = localStorage.getItem("user-id");
      fetch(`/api/service-requests/${userId}`, {
        method: "GET",
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.serviceRequests = data;
          console.log(this.serviceRequests);
        })
        .catch((error) => {
          console.error("Error fetching service requests:", error);
        });
    },
    showBookDetail(book) {
      this.$refs.bookModal.viewModal(book);
    },
  },
  created() {
    this.getAllBooks();
    this.getAllFreelancers();
    this.getAllServiceRequests();
  },
  template: `
    <div class="px-3 mt-3 pb-5">
        <h3 class="mb-4">Upcoming Services</h3>
        <div class="row">
            <div class="col-lg-4" v-for="(request, k) in serviceRequests" :key="k" v-if="new Date(request.service_date) > new Date()">
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
            <div class="col-lg-4" v-for="(request, k) in serviceRequests" :key="k" v-if="new Date(request.service_date) <= new Date()">
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
        <h3 class="mb-4">Freelancers</h3>
        <div class="row">
            <div class="col-lg-4" v-for="(freelancer, j) in freelancerList" :key="j">
                <div class="card shadow-sm mb-3" style="border-radius: 10px;">
                    <div class="card-body text-center">
                        <h5 class="card-title">{{ freelancer.name }}</h5>
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
