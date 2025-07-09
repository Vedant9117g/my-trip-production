import { useRef, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Typewriter } from "react-simple-typewriter";
import { features, steps, testimonials } from "./landingData";
import SearchCard from "@/components/passanger/SearchCard";
import { FaPercent, FaGift, FaStar, FaBolt } from "react-icons/fa";
import AIChatBot from "./AiChatBot";
import { SocketContext } from "@/context/SocketContext";
import { setRideDetails, clearRide } from "@/features/api/rideSlice";
import { useSelector, useDispatch } from "react-redux";

// Offers Data
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

// Register plugins
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

ScrollAnimatedSection.propTypes = {
  children: PropTypes.node.isRequired,
};

function OffersSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white/90 to-blue-100/70 dark:from-gray-950/95 dark:to-gray-900/90 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-100 mb-12">
        Exciting Offers For You
      </h2>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {offers.map((offer, i) => (
          <motion.div
            key={offer.title}
            initial={{ opacity: 0, y: 60, scale: 0.95, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15, type: "spring" }}
            whileHover={{
              scale: 1.08,
              rotate: [0, 2, -2, 0],
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
            }}
            className={`rounded-2xl shadow-xl p-6 flex flex-col items-center text-center border border-blue-100 dark:border-gray-800 bg-gradient-to-br ${offer.color} transition-all duration-300 cursor-pointer`}
          >
            <div className="mb-4 animate-bounce-slow">{offer.icon}</div>
            <h3 className="font-bold text-blue-700 dark:text-blue-200 text-lg mb-2">
              {offer.title}
            </h3>
            <p className="text-blue-900 dark:text-blue-100">{offer.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ScrollingTestimonials() {
  const row1 = testimonials.slice(0, 3);
  const row2 = testimonials.slice(3, 6);
  const row3 = testimonials.slice(6, 8).concat(testimonials.slice(0, 1));

  const duplicate = (arr, times = 3) => Array(times).fill(arr).flat();

  return (
    <div className="relative overflow-hidden py-16 bg-gradient-to-b from-blue-100/80 to-blue-200/60 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-100 mb-10">
        What Users Say
      </h2>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blue-100/95 via-blue-100/50 to-transparent dark:from-gray-950/95 dark:via-gray-950/50 dark:to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blue-100/95 via-blue-100/50 to-transparent dark:from-gray-950/95 dark:via-gray-950/50 dark:to-transparent z-10 pointer-events-none" />
      <div className="space-y-8">
        {[duplicate(row1, 4), duplicate(row2, 4), duplicate(row3, 4)].map(
          (row, rowIndex) => (
            <div className="relative w-full" key={rowIndex}>
              <motion.div
                className="flex gap-8"
                animate={{
                  x: rowIndex % 2 === 0 ? ["-50%", "0%"] : ["0%", "-50%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 50,
                  ease: "linear",
                }}
                style={{ width: "max-content" }}
              >
                {row.map((t, i) => (
                  <div
                    key={`${rowIndex}-${i}-${t.name}`}
                    className="bg-white/90 dark:bg-gray-950/90 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center min-w-[260px] hover:scale-105 transition border border-blue-100 dark:border-gray-800"
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-16 h-16 rounded-full mb-4 border-2 border-blue-200 dark:border-blue-700"
                    />
                    <p className="text-slate-700 dark:text-blue-100 italic mb-3">
                      &quot;{t.text}&quot;
                    </p>
                    <span className="font-bold text-blue-700 dark:text-blue-300">
                      {t.name}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

const Landing = () => {
  const { socket } = useContext(SocketContext);
  const { rideDetails } = useSelector((state) => state.ride);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isRideAccepted, setIsRideAccepted] = useState(false);
  const [isRideStarted, setIsRideStarted] = useState(false);
  const [isRideCompleted, setIsRideCompleted] = useState(false);
  const [isRideCanceled, setIsRideCanceled] = useState(false);

  // Rehydrate Redux state from localStorage on component mount
  useEffect(() => {
    if (!rideDetails) {
      const savedState = localStorage.getItem("rideState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        const savedRide = parsedState.rideDetails;

        dispatch(setRideDetails(parsedState.rideDetails));

        if (savedRide?.status === "accepted") setIsRideAccepted(true);
        if (savedRide?.status === "ongoing") setIsRideStarted(true);
        if (savedRide?.status === "completed") setIsRideCompleted(true);
        if (savedRide?.status === "canceled") setIsRideCanceled(true);
      } else {
        navigate("/");
      }
    } else {
      if (rideDetails.status === "accepted") setIsRideAccepted(true);
      if (rideDetails.status === "ongoing") setIsRideStarted(true);
      if (rideDetails.status === "completed") setIsRideCompleted(true);
      if (rideDetails.status === "canceled") setIsRideCanceled(true);
    }
  }, [rideDetails, dispatch, navigate]);

  useEffect(() => {
    if (!socket || typeof socket.on !== "function") return;

    // Listen for rideAccepted event
    socket.on("rideAccepted", (data) => {
      dispatch(setRideDetails(data));
      localStorage.setItem("rideState", JSON.stringify({ rideDetails: data }));
      setIsRideAccepted(true);
    });

    // Listen for rideStatusUpdate event (for ride started)
    socket.on("rideStatusUpdate", (data) => {
      dispatch(setRideDetails(data));
      localStorage.setItem("rideState", JSON.stringify({ rideDetails: data }));

      if (data.status === "ongoing") {
        setIsRideStarted(true);
        alert("Your ride has started!");
      } else if (data.status === "canceled") {
        alert("Your ride has been canceled by the driver.");
        navigate("/");
      }
    });

    socket.on("rideCompleted", (data) => {
      dispatch(clearRide());
      localStorage.removeItem("rideState");
      alert("Your ride has been completed!");
      navigate("/");
    });

    socket.on("rideCanceled", (data) => {
      dispatch(setRideDetails(data));
      localStorage.setItem("rideState", JSON.stringify({ rideDetails: data }));

      if (data.status === "canceled") {
        setIsRideCanceled(true);
        alert("Your ride has canceled!");
      } else {
        alert("failed to cancel.");
      }
    });

    return () => {
      socket.off("rideAccepted");
      socket.off("rideStatusUpdate");
      socket.off("rideCompleted");
      socket.off("rideCanceled");
    };
  }, [socket, dispatch, navigate]);

  return (
    <div className="bg-gradient-to-b from-slate-100 to-blue-100 dark:from-gray-950 dark:to-gray-900 min-h-screen font-plus-jakarta-sans transition-colors duration-300">
      {/* Jakarta Font Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* Hero Section */}
      <section className="z-0 relative bg-gradient-to-br from-[#e3eafc] to-[#b6c6e6] dark:from-gray-950 dark:to-gray-900 min-h-[90vh] py-16 px-4 md:px-12 flex flex-col-reverse lg:flex-row items-center justify-between overflow-hidden transition-colors duration-300 gap-y-12">
        {/* Left Text Section */}
        <motion.div
          className="w-full lg:w-1/2 text-center lg:text-left z-10 space-y-6 lg:mb-0"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Ride Smarter. <br />
            <span className="text-blue-600 dark:text-blue-400">
              <Typewriter
                words={["Instant Rides", "Live Tracking", "Secure Payments"]}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 dark:text-blue-100 max-w-xl mx-auto lg:mx-0">
            MyTrip makes ride-sharing seamless with real-time tracking,
            transparent fares, and trusted captains.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/book"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-500 transition-all"
            >
              Book a Ride
            </Link>
          </div>
        </motion.div>

        {/* Right Search Card Section */}
        <motion.div
          className="w-full lg:w-[48%] flex justify-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/90 dark:bg-gray-950/95 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-800 p-6 w-full max-w-xl backdrop-blur-sm">
            <SearchCard />
          </div>
        </motion.div>

        {/* Decorative animated background blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-300/30 dark:bg-blue-900/30 rounded-full blur-[100px] animate-pulse-slow z-0" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-200/30 dark:bg-yellow-900/30 rounded-full blur-[120px] animate-pulse-slow z-0 delay-300" />
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-b from-white/90 to-blue-100/70 dark:from-gray-950/95 dark:to-gray-900/90 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <ScrollAnimatedSection key={i}>
              <div className="text-center bg-white/90 dark:bg-gray-950/90 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition border border-blue-100 dark:border-gray-800">
                <div className="text-4xl mb-3 animate-pulse">{f.icon}</div>
                <h3 className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-1">
                  {f.title}
                </h3>
                <p className="text-slate-600 dark:text-blue-100 text-sm">
                  {f.desc}
                </p>
              </div>
            </ScrollAnimatedSection>
          ))}
        </div>
      </section>

      {/* Offers Section */}
      <OffersSection />
      <AIChatBot />

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-blue-100/80 via-white/90 to-blue-200/60 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-blue-800 dark:text-blue-100 mb-12">
          How MyTrip Works
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
          {steps.map((step, i) => (
            <ScrollAnimatedSection key={i}>
              <div className="flex flex-col md:flex-row items-center gap-6 bg-white/90 dark:bg-gray-950/90 rounded-2xl shadow-xl p-6 hover:scale-105 transition border border-blue-100 dark:border-gray-800">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-28 h-28 object-cover rounded-xl shadow"
                />
                <div>
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-slate-700 dark:text-blue-100 text-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            </ScrollAnimatedSection>
          ))}
        </div>
      </section>

      {/* Scrolling Testimonials */}
      <ScrollingTestimonials />

      {/* Call to Action */}
      <section className="py-20 bg-blue-700 dark:bg-blue-950 text-white text-center transition-colors duration-300">
        <ScrollAnimatedSection>
          <h2 className="text-3xl font-bold mb-4">Start Your Journey Now</h2>
          <p className="mb-6 text-blue-100">
            Join thousands of happy users across the country.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-100 transition"
          >
            Sign Up Free
          </Link>
        </ScrollAnimatedSection>
      </section>

      <footer className="py-6 text-center text-sm text-blue-700 dark:text-blue-200 bg-white/90 dark:bg-gray-950/95 border-t border-blue-100 dark:border-gray-800 transition-colors duration-300">
        &copy; {new Date().getFullYear()} MyTrip. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;