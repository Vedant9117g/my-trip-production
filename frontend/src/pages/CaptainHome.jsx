import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Typewriter } from "react-simple-typewriter";
import { useDispatch } from "react-redux";
import { useLoadUserQuery } from "../features/api/authApi";
import { SocketContext } from "../context/SocketContext";
import { setRideDetails } from "@/features/api/rideSlice";
import { toast } from "sonner";
import axios from "axios";

import PublishRideCard from "@/components/captain/PublishRideCard";
import RideRequestPopup from "@/components/captain/RideRequestPopup";
import AIChatBot from "./AiChatBot";
import { features, steps, testimonials } from "./landingData";
import { FaGift, FaPercent, FaStar, FaBolt } from "react-icons/fa";

// Register GSAP plugin

const offers = [
  {
    title: "First Ride Free",
    desc: "Enjoy your first ride absolutely free up to ₹100!",
    icon: <FaGift className="text-pink-500 text-3xl" />,
    color: "from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800",
  },
  {
    title: "Refer & Earn",
    desc: "Refer friends and earn ₹50 ride credits for each signup.",
    icon: <FaPercent className="text-blue-500 text-3xl" />,
    color: "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
  },
  {
    title: "5-Star Cashback",
    desc: "Get 10% cashback on every 5-star rated ride.",
    icon: <FaStar className="text-yellow-400 text-3xl" />,
    color: "from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
  },
  {
    title: "Lightning Deals",
    desc: "Grab limited-time discounts on select routes every day.",
    icon: <FaBolt className="text-purple-500 text-3xl" />,
    color: "from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
  },
];

gsap.registerPlugin(ScrollTrigger);

function ScrollAnimatedSection({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);
  return <div ref={ref}>{children}</div>;
}

const CaptainHome = () => {
  const { socket } = useContext(SocketContext);
  const { data: userData, isLoading } = useLoadUserQuery();
  const [ride, setRide] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && userData?.user) {
      const userId = userData.user._id;
      if (userId && !socket.hasEmittedJoin) {
        socket.emit("join", { userId });
        socket.hasEmittedJoin = true;
      }
    }
    socket.on("joinSuccess", (msg) => console.log(msg));
    return () => socket.off("joinSuccess");
  }, [socket, isLoading, userData]);

  useEffect(() => {
    const handleNewRide = (data) => setRide(data);
    socket.off("new-ride");
    socket.on("new-ride", handleNewRide);
    return () => socket.off("new-ride", handleNewRide);
  }, [socket]);

  const handleAcceptRide = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/login");
      const res = await axios.post(
        `https://my-trip-production-1.onrender.com/api/rides/${ride._id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success("Ride accepted successfully!");
      dispatch(setRideDetails(res.data.ride));
      navigate("/instant-ride-detail");
      socket.emit("rideAccepted", {
        rideId: ride._id,
        captain: {
          name: userData.user.name,
          vehicleType: ride.vehicleType,
          phone: userData.user.phone,
        },
      });
      setRide(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept ride");
    }
  };

  const handleRejectRide = () => {
    toast.error("Ride rejected");
    setRide(null);
  };

  return (
    <div className="bg-gradient-to-b from-slate-100 to-blue-100 dark:from-gray-950 dark:to-gray-900 min-h-screen font-plus-jakarta-sans transition-colors duration-300">
      <section className="py-20 px-6 text-center bg-gradient-to-r from-[#e3eafc] to-[#b6c6e6] dark:from-gray-950 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold mb-4 dark:text-white">
            Welcome Captain,
            <span className="text-blue-600 dark:text-blue-400">
              <Typewriter
                words={["Publish Rides", "Accept Requests", "Earn Rewards"]}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </h1>
          <p className="text-lg text-blue-900 dark:text-blue-100 max-w-xl mx-auto">
            Manage your rides efficiently and earn while helping people commute
            safely.
          </p>
        </motion.div>
        <div className="mt-12 flex justify-center">
          <PublishRideCard />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {features.map((feature, idx) => (
          <ScrollAnimatedSection key={idx}>
            <div className="text-center bg-white/90 dark:bg-gray-950/90 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition border border-blue-100 dark:border-gray-800">
              <div className="text-4xl mb-3 animate-pulse">{feature.icon}</div>
              <h3 className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-1">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-blue-100 text-sm">
                {feature.desc}
              </p>
            </div>
          </ScrollAnimatedSection>
        ))}
      </section>

      {/* Offers Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white/90 to-blue-100/70 dark:from-gray-950 dark:to-gray-900">
        <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-100 mb-12">
          Exclusive Captain Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {offers.map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`rounded-2xl shadow-xl p-6 flex flex-col items-center text-center bg-gradient-to-br ${offer.color} border border-blue-100 dark:border-gray-800`}
            >
              <div className="mb-4">{offer.icon}</div>
              <h3 className="font-bold text-blue-700 dark:text-blue-200 text-lg mb-2">
                {offer.title}
              </h3>
              <p className="text-blue-900 dark:text-blue-100">{offer.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Chat Bot */}
      <AIChatBot />

      {/* Ride Request Popup */}
      <RideRequestPopup ride={ride} onAccept={handleAcceptRide} onReject={handleRejectRide} />

      <footer className="py-6 text-center text-sm text-blue-700 dark:text-blue-200 bg-white/90 dark:bg-gray-950/95 border-t border-blue-100 dark:border-gray-800">
        &copy; {new Date().getFullYear()} MyTrip. All rights reserved.
      </footer>
    </div>
  );
};

export default CaptainHome;
