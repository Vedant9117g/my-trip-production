import React from "react";
import { useNavigate } from "react-router-dom";
import SearchCard from "@/components/passanger/SearchCard";
import { Car, Users, MapPin, Clock } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-900 dark:to-gray-800 text-white dark:text-gray-200 flex flex-col items-center">
      {/* Hero Section */}
      <header className="w-full py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Crazy Rides</h1>
        <p className="text-lg font-medium">
          Your one-stop solution for finding and sharing rides. Travel smarter, faster, and cheaper!
        </p>
      </header>

      {/* Search Section */}
      <section className="w-full flex justify-center px-6">
        <SearchCard />
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-8">Why Choose Crazy Rides?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Car className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Convenient Rides</h3>
            <p className="text-center">
              Find rides that match your schedule and travel preferences. Whether you're a passenger or a driver, we've got you covered.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Users className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-center">
              Join a growing community of riders and drivers. Share rides, save costs, and make new connections.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Clock className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save Time & Money</h3>
            <p className="text-center">
              Enjoy affordable rides and reduce travel time with optimized routes and instant ride matching.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8">About Crazy Rides</h2>
          <p className="text-lg text-center mb-8">
            Crazy Rides is a modern ride-sharing platform designed to make travel easier and more affordable. Whether you're commuting to work, planning a road trip, or just need a quick ride, Crazy Rides connects you with the right people at the right time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <MapPin className="w-10 h-10 text-blue-500" />
              <p>Find rides to any destination with ease.</p>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-green-500" />
              <p>Join a community of trusted riders and drivers.</p>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-10 h-10 text-purple-500" />
              <p>Save time with instant ride matching.</p>
            </div>
            <div className="flex items-center gap-4">
              <Car className="w-10 h-10 text-amber-500" />
              <p>Choose from a variety of vehicles for your ride.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="w-full bg-indigo-700 dark:bg-gray-900 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Ride?</h2>
        <p className="text-lg mb-8">
          Join Crazy Rides today and experience the future of ride-sharing.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-200"
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;