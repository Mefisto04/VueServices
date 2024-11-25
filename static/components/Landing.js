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
  setup() {
    const bgImage = new URL("./Bg.jpg", import.meta.url).href;
    return {
      bgImage,
    };
  },
  template: `
  <main class="main-container">
    <!-- Header Section -->
     <div class="header-section">
    <div class="image-container">
      <img :src="bgImage" alt="Household" />
    </div>
    <div class="text-container">
      <h1>Your One-Stop Solution for Household Services</h1>
      <p>Connect with trusted service providers for all your household needs. Fast, reliable, and rated by your community.</p>
      <div class="button-group">
        <button  class="button button-primary">Get Started</button>
      </div>
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
      <div class=" text-center">
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
  </main>
`,
};
