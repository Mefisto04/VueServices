export default {
  data: () => ({
    user: {
      email: "",
    },
    isSubscribed: false,
    features: [
      {
        title: "Instant Service",
        description:
          "Get immediate assistance for your household needs with our quick response system.",
      },
      {
        title: "Trusted Providers",
        description:
          "Connect with highly rated and trusted service providers in your area.",
      },
      {
        title: "Flexible Scheduling",
        description:
          "Schedule services at your convenience, with flexible timing options.",
      },
    ],
  }),
  methods: {
    subscribe() {
      if (this.user.email) {
        // Handle subscription logic here
        this.isSubscribed = true;
        this.user.email = ""; // Reset the email input
      }
    },
  },
  template: `
  <main class="main-container">
    <!-- Header Section -->
    <div class="text-center header-section">
      <h1 class="heading-1">Your One-Stop Solution for Household Services</h1>
      <p class="text-lg">Connect with trusted service providers for all your household needs. Fast, reliable, and rated by your community.</p>
      <div class="button-group">
        <button class="button button-primary">Get Started</button>
        <button class="button button-outline">Learn More</button>
      </div>
    </div>

    <!-- Features Section -->
    <h2 class="heading-2 text-center">Our Features</h2>
    <div class="features-grid">
      <div class="card" v-for="(feature, index) in features" :key="index">
        <div class="card-header">
          <h3 class="heading-2">{{ feature.title }}</h3>
        </div>
        <div class="card-content">
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- Users Section -->
    <section id="users" class="section">
      <div class="container text-center">
        <h2 class="heading-2">For Users</h2>
        <p class="text-lg">Experience hassle-free household services at your fingertips. From cleaning to repairs, find trusted professionals for all your needs.</p>
        <ul class="feature-list">
          <li>Wide range of services</li>
          <li>Vetted and rated professionals</li>
          <li>Flexible scheduling</li>
        </ul>
        <button class="button button-primary">Book a Service</button>
      </div>
    </section>

    <!-- Subscription Section -->
    <div class="subscription text-center">
      <h2 class="heading-2">Join Our Platform Today</h2>
      <p class="text-lg">Whether you're looking for services or want to provide them, Collective is the platform for you.</p>
      <input type="email" placeholder="Your Email" class="input-email" v-model="user.email" />
      <button class="button button-primary" @click="subscribe">Subscribe to Newsletter</button>
      <div v-if="isSubscribed" class="text-success">Thank you for subscribing!</div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2024 Collective. All rights reserved.</p>
      <ul class="footer-links">
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>
    </footer>
  </main>
`,
};
