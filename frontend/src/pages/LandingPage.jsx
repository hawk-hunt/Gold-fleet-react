import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import FleetImageCard from '../components/FleetImageCard';


/**
 * LandingPage Component
 * Modern, enterprise-grade SaaS welcome page for Fleet Management System
 * Clean, professional design with white background and strong typography
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const { token, loading, isInitialized } = useAuth();

  // Log auth state for debugging
  useEffect(() => {
    console.log('[LandingPage] Auth state:', { token, loading, isInitialized });
  }, [token, loading, isInitialized]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isInitialized && !loading && token) {
      console.log('[LandingPage] User is authenticated, redirecting to dashboard...');
      navigate('/main', { replace: true });
    }
  }, [token, loading, isInitialized, navigate]);

  // Show loading while auth is initializing
  if (loading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User is NOT authenticated, show landing page
  return (
    <div className="w-full">
      <Hero />

      {/* --- New split section with image & text content --- */}
      <section className="mt-16 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* left column: image card */}
          <div className="w-full md:w-1/2">
            <FleetImageCard
              src="/images/pexels-silveremeya-7381783.jpg"
              alt="Fleet management overview"
            />
          </div>

          {/* right column: text content */}
          <div className="w-full md:w-1/2 space-y-6">
            <p className="text-sm font-semibold uppercase text-amber-600">
              Optimize fleet operations
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Advanced fleet management software solutions
            </h2>
            <p className="text-gray-700">
              Track vehicles in the field, improve fleet operations, increase
              worker productivity and safe driving with Verizon Connect fleet
              management solutions. Choose from a range of customizable GPS
              tracking solutions that offer dashboards, reports and alerts.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>See driver and vehicle location in near real-time</li>
              <li>Track driver behavior like speeding, idling and harsh driving</li>
              <li>Reduce costs for vehicle maintenance and fuel consumption</li>
              <li>Improve dispatch, routing and visibility</li>
            </ul>
            <a
              href="#"
              className="inline-block text-amber-600 font-semibold hover:text-amber-700"
            >
              GPS fleet tracking →
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why choose our fleet management platform?
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature Card 1 */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F4F1EA', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img
                  src="/images/howz-nguyen-AAhnWrD_8vk-unsplash.jpg"
                  alt="Know where your vehicles are"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Know where your vehicles are 24/7
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '12px' }}>
                    Real-time vehicle tracking and live status updates
                  </p>
                  <a href="#" style={{ fontSize: '0.875rem', color: '#CA8A04', fontWeight: '600' }}>
                    Vehicle tracking
                  </a>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F4F1EA', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img
                  src="/images/pexels-enginakyurt-20500734.jpg"
                  alt="Save up to 20% on fuel & maintenance"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Save up to 20% on fuel & maintenance
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '12px' }}>
                    Monitor and analyze driving behavior to reduce costs
                  </p>
                  <a href="#" style={{ fontSize: '0.875rem', color: '#CA8A04', fontWeight: '600' }}>
                    Fleet optimization
                  </a>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F4F1EA', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img
                  src="/images/pexels-mikebirdy-244822.jpg"
                  alt="Easy integration with existing systems"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Easy integration with existing systems
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '12px' }}>
                    Seamlessly connects with current software and hardware
                  </p>
                  <a href="#" style={{ fontSize: '0.875rem', color: '#CA8A04', fontWeight: '600' }}>
                    System integration
                  </a>
                </div>
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
              {/* Feature Block 1 - Route Optimization Card with Image */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F4F1EA', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img
                  src="/images/pexels-vladimirsrajber-21407450.jpg"
                  alt="Route optimization and traffic-aware navigation"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Cut driving time & optimize routes
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '12px' }}>
                    Traffic-aware navigation and route optimization
                  </p>
                  <a href="#" style={{ fontSize: '0.875rem', color: '#CA8A04', fontWeight: '600' }}>
                    Route optimization
                  </a>
                </div>
              </div>

              {/* Feature Block 2 - Service Levels Card with Image */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#F4F1EA', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img
                  src="/images/pexels-pavel-danilyuk-6407388.jpg"
                  alt="Improve service levels with dynamic dispatching"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>
                    Improve service levels
                  </h3>
                  <p style={{ fontSize: '1rem', color: '#4a5568', marginBottom: '12px' }}>
                    Dynamic dispatching and real-time driver communication
                  </p>
                  <a href="#" style={{ fontSize: '0.875rem', color: '#CA8A04', fontWeight: '600' }}>
                    Service optimization
                  </a>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-24 sm:py-32 bg-white">
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
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">Ama Serwaa</div>
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
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">Michael Acheampong</div>
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
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">Nii </div>
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
            <h3 className="text-lg font-semibold">Are you ready to optimize your fleet?</h3>
            <p className="mt-2 text-gray-400">Join the list of companies already using Gold Fleet</p>
            <div className="mt-6 flex items-center justify-center gap-x-6">
              <a href="/login?tab=signup" className="rounded-md bg-yellow-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-yellow-700 transition-all duration-200 transform hover:scale-105">
                Sign up
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
