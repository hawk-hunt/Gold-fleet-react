import React from 'react';

/**
 * LandingPage Component
 * Modern, enterprise-grade SaaS welcome page for Fleet Management System
 * Clean, professional design with white background and strong typography
 */
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Background Video/Image */}
        <video autoPlay muted loop poster="/background-image/maxresdefault-3490897627.jpg" className="absolute inset-0 w-full h-full object-cover">
          <source src="/background-video/13197481_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Track your company vehicles & save like a Pro
            </h1>
            <p className="mt-6 text-lg leading-8 text-yellow-200 sm:text-xl">
              Cloud-based vehicle tracking and fleet management software
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a href="/login" className="rounded-md bg-yellow-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-yellow-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 transition-all duration-200 transform hover:scale-105">
                Login
              </a>
              <button className="text-base font-semibold leading-6 text-white hover:text-yellow-200 transition-colors">
                Contact sales <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why choose our fleet management platform?
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature Card 1 */}
              <div className="flex flex-col items-start">
                {/* Icon Placeholder */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-600">
                  {/* TODO: Replace with actual icon */}
                  {/* Icon placeholder - GPS/tracking icon */}
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.458-7.5 11.458s-7.5-4.316-7.5-11.458a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Know where your vehicles are 24/7
                </dt>
                <dd className="mt-1 text-base leading-7 text-amber-700">
                  Real-time vehicle tracking and live status updates
                </dd>
                <a href="#" className="mt-4 text-sm font-semibold leading-6 text-yellow-600 hover:text-yellow-700 transition-colors">
                  Vehicle tracking <span aria-hidden="true">→</span>
                </a>
              </div>

              {/* Feature Card 2 */}
              <div className="flex flex-col items-start">
                {/* Icon Placeholder */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-amber-600">
                  {/* TODO: Replace with actual icon */}
                  {/* Icon placeholder - savings/money icon */}
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Save up to 20% on fuel & maintenance
                </dt>
                <dd className="mt-1 text-base leading-7 text-amber-700">
                  Monitor and analyze driving behavior to reduce costs
                </dd>
                <a href="#" className="mt-4 text-sm font-semibold leading-6 text-amber-600 hover:text-amber-700 transition-colors">
                  Fleet optimization <span aria-hidden="true">→</span>
                </a>
              </div>

              {/* Feature Card 3 */}
              <div className="flex flex-col items-start">
                {/* Icon Placeholder */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-yellow-700">
                  {/* TODO: Replace with actual icon */}
                  {/* Icon placeholder - integration/connection icon */}
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </div>
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Easy integration with existing systems
                </dt>
                <dd className="mt-1 text-base leading-7 text-amber-700">
                  Seamlessly connects with current software and hardware
                </dd>
                <a href="#" className="mt-4 text-sm font-semibold leading-6 text-yellow-700 hover:text-yellow-800 transition-colors">
                  System integration <span aria-hidden="true">→</span>
                </a>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Optimization & Performance Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-amber-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Optimize performance and reduce costs
            </h2>
            <p className="mt-4 text-lg leading-8 text-amber-700">
              Advanced features to maximize your fleet efficiency
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {/* Feature Block 1 */}
              <div className="flex flex-col">
                {/* Icon Placeholder */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-600">
                  {/* TODO: Replace with actual icon */}
                  {/* Icon placeholder - route/navigation icon */}
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V11.535c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Cut driving time & optimize routes
                </dt>
                <dd className="mt-2 text-base leading-7 text-amber-700">
                  Traffic-aware navigation and route optimization
                </dd>
              </div>

              {/* Feature Block 2 */}
              <div className="flex flex-col">
                {/* Icon Placeholder */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600">
                  {/* TODO: Replace with actual icon */}
                  {/* Icon placeholder - service/communication icon */}
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-4.125 4.125c1.036 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 01-1.875-1.875v-.75c0-1.036.84-1.875 1.875-1.875h4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 10.5h3m-3 3h3m-3 3h3m3-9h.008v.008H16.5V7.5z" />
                  </svg>
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Improve service levels
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Dynamic dispatching and real-time driver communication
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What our customers say
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Testimonial Card 1 */}
            <div className="flex flex-col justify-between bg-white p-8 shadow-lg ring-1 ring-gray-200 rounded-lg">
              <div>
                {/* Customer Image Placeholder */}
                <div className="mb-4 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {/* TODO: Replace with actual customer image */}
                    {/* Customer image placeholder - will be replaced with actual photo */}
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-600">Operations Manager</div>
                  </div>
                </div>
                <blockquote className="text-gray-900">
                  <p>"Gold Fleet has transformed our logistics operations. We've reduced fuel costs by 18% and improved delivery times significantly."</p>
                </blockquote>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-600">Transportation Solutions Inc.</div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="flex flex-col justify-between bg-white p-8 shadow-lg ring-1 ring-gray-200 rounded-lg">
              <div>
                {/* Customer Image Placeholder */}
                <div className="mb-4 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {/* TODO: Replace with actual customer image */}
                    {/* Customer image placeholder - will be replaced with actual photo */}
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">Michael Chen</div>
                    <div className="text-sm text-gray-600">Fleet Director</div>
                  </div>
                </div>
                <blockquote className="text-gray-900">
                  <p>"The real-time tracking and maintenance alerts have been game-changers. Our vehicle downtime has decreased by 40%."</p>
                </blockquote>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-600">Metro Delivery Services</div>
              </div>
            </div>

            {/* Testimonial Card 3 */}
            <div className="flex flex-col justify-between bg-white p-8 shadow-lg ring-1 ring-gray-200 rounded-lg">
              <div>
                {/* Customer Image Placeholder */}
                <div className="mb-4 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    {/* TODO: Replace with actual customer image */}
                    {/* Customer image placeholder - will be replaced with actual photo */}
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">Emily Rodriguez</div>
                    <div className="text-sm text-gray-600">Logistics Coordinator</div>
                  </div>
                </div>
                <blockquote className="text-gray-900">
                  <p>"Easy integration with our existing systems and excellent customer support. Gold Fleet pays for itself within months."</p>
                </blockquote>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-600">Global Transport Group</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Ready to optimize your fleet?</h3>
            <p className="mt-2 text-gray-400">Join thousands of companies already using Gold Fleet</p>
            <div className="mt-6 flex items-center justify-center gap-x-6">
              <button className="rounded-md bg-yellow-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105">
                Start free trial
              </button>
              <button className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
                Schedule demo <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;