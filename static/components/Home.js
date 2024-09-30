import Book from "./Partials/Book.js";
import BookDetailsModal from "./Partials/BookDetailsModal.js";

export default {
  data: () => ({
    showModal: false,
    bookList: [],
    freelancerList: [],
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
      console.log("Sending request with:", {
        freelancerId: freelancerId,
        userId: localStorage.getItem("user-id"),
      });

      fetch("/api/request-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          freelancerId: freelancerId,
          userId: localStorage.getItem("user-id"),
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Service request failed.");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Service request successful:", data);
          alert("Service request sent to freelancer!");
        })
        .catch((error) => {
          console.error("Error sending service request:", error);
        });
    },
    showBookDetail(book) {
      this.$refs.bookModal.viewModal(book);
    },
  },
  created() {
    this.getAllBooks();
    this.getAllFreelancers(); 
  },
  template: `
    <div class="px-3 mt-3 pb-5">
        <div class="row justify-content-left">
            <div class="col-lg-2 mt-3" v-for="(book, i) in bookList" :key="i">
                <div class="text-center justify-content-centre pt-3 pb-3 px-2  border border-2 border-secondary">  
                    <div class="mx-auto border border-2 border-secondary" 
                    :style='imagePath'
                    >
            </div> 
            <h6 class="mt-2 mb-0 fs-regular fw-bold" style="white-space: break-spaces; min-height: 40px">{{book.title}}</h6>
            <p class="text-muted fst-italic mb-0">{{book.author}}</p>
            <button class="btn btn-sm btn-warning mt-2" @click="showDetail(book)">View Details</button>
        </div>
            </div>
            <BookDetailsModal ref="bookModal"/>
        </div>

        <h3 class="mb-0 mt-4">Freelancers</h3>
        <div class="row justify-content-left">
            <div class="col-lg-2 mt-3" v-for="(freelancer, j) in freelancerList" :key="j">
                <div class="card" style="border: 1px solid #ccc; border-radius: 5px; margin: 10px;">
                    <div class="card-body" style="text-align: center;">
                        <h5 class="card-title">{{ freelancer.name }}</h5>
                        <p class="card-text">Email: {{ freelancer.email }}</p>
                        <p class="card-text">Experience: {{ freelancer.experience }}</p>
                        <a v-if="freelancer.portfolio_url && freelancer.portfolio_url !== 'null'" 
                           :href="freelancer.portfolio_url" class="btn btn-primary" target="_blank">View Portfolio</a>
                         <button class="btn btn-success mt-2" @click="requestService(freelancer.id)">Request Service</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
  components: { Book, BookDetailsModal },
};
