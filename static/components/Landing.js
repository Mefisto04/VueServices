export default {
  data: () => ({
    user: {
      email: "",
    },
    isSubscribed: false,
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
      <main class="flex-1">
        <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div class="container px-4 md:px-6">
            <div class="flex flex-col items-center space-y-4 text-center">
              <div class="space-y-2">
                <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your One-Stop Solution for Household Services
                </h1>
                <p class="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Connect with trusted service providers for all your household needs. Fast, reliable, and rated by your community.
                </p>
              </div>
              <div class="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
  
        <section id="features" class="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div class="container px-4 md:px-6">
            <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center space-x-2">
                    <Clock class="h-6 w-6" />
                    <span>Instant Service</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Get immediate assistance for your household needs with our quick response system.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center space-x-2">
                    <Star class="h-6 w-6" />
                    <span>Rating Based</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Choose from top-rated service providers trusted by your community.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center space-x-2">
                    <MapPin class="h-6 w-6" />
                    <span>Location Based</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Find nearby service providers for quicker and more convenient service.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
  
        <section id="users" class="w-full py-12 md:py-24 lg:py-32">
          <div class="container px-4 md:px-6">
            <div class="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <img
                alt="Household services"
                class="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/placeholder.svg"
                width="550"
              />
              <div class="flex flex-col justify-center space-y-4">
                <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">For Users</h2>
                <p class="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Experience hassle-free household services at your fingertips. From cleaning to repairs, find trusted professionals for all your needs.
                </p>
                <ul class="grid gap-2 py-4">
                  <li class="flex items-center gap-2">
                    <Users class="h-4 w-4" /> Wide range of services
                  </li>
                  <li class="flex items-center gap-2">
                    <Star class="h-4 w-4" /> Vetted and rated professionals
                  </li>
                  <li class="flex items-center gap-2">
                    <Clock class="h-4 w-4" /> Flexible scheduling
                  </li>
                </ul>
                <Button class="w-fit">Book a Service</Button>
              </div>
            </div>
          </div>
        </section>
  
        <section id="providers" class="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div class="container px-4 md:px-6">
            <div class="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-12 xl:grid-cols-[600px_1fr]">
              <img
                alt="Service provider"
                class="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                height="310"
                src="/placeholder.svg"
                width="550"
              />
              <div class="flex flex-col justify-center space-y-4">
                <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">For Service Providers</h2>
                <p class="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join our platform to expand your client base and grow your business. We provide the tools and support you need to succeed.
                </p>
                <ul class="grid gap-2 py-4">
                  <li class="flex items-center gap-2">
                    <Users class="h-4 w-4" /> Access to a large customer base
                  </li>
                  <li class="flex items-center gap-2">
                    <Briefcase class="h-4 w-4" /> Flexible work opportunities
                  </li>
                  <li class="flex items-center gap-2">
                    <Star class="h-4 w-4" /> Build your reputation through ratings
                  </li>
                </ul>
                <Button class="w-fit">Become a Provider</Button>
              </div>
            </div>
          </div>
        </section>
  
        <section id="admin" class="w-full py-12 md:py-24 lg:py-32">
          <div class="container px-4 md:px-6">
            <div class="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <img
                alt="Admin dashboard"
                class="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/placeholder.svg"
                width="550"
              />
              <div class="flex flex-col justify-center space-y-4">
                <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">For Admins</h2>
                <p class="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Manage and oversee the entire platform with our powerful admin tools. Ensure quality service and user satisfaction.
                </p>
                <ul class="grid gap-2 py-4">
                  <li class="flex items-center gap-2">
                    <ShieldCheck class="h-4 w-4" /> Comprehensive oversight
                  </li>
                  <li class="flex items-center gap-2">
                    <Users class="h-4 w-4" /> User and provider management
                  </li>
                  <li class="flex items-center gap-2">
                    <Star class="h-4 w-4" /> Quality control and ratings management
                  </li>
                </ul>
                <Button class="w-fit">Admin Login</Button>
              </div>
            </div>
          </div>
        </section>
  
        <section class="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div class="container px-4 md:px-6">
            <div class="flex flex-col items-center space-y-4 text-center">
              <div class="space-y-2">
                <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Platform Today</h2>
                <p class="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Whether you're looking for services or want to provide them, Collective is the platform for you.
                </p>
              </div>
              <div class="flex flex-col items-center space-y-2">
                <input
                  type="email"
                  placeholder="Your Email"
                  class="w-full max-w-xs rounded-md border border-gray-300 px-4 py-2 dark:border-gray-700"
                  v-model="user.email"
                />
                <Button @click="subscribe" class="w-fit">Subscribe to Newsletter</Button>
                <div v-if="isSubscribed" class="text-green-500">Thank you for subscribing!</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    `,
};
