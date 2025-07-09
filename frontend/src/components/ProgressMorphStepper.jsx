import { useState } from "react";
import { X } from "lucide-react";

const steps = [
  {
    title: "Welcome to MyTrip!",
    description: "Effortlessly find and book rides near you with just a few clicks.",
  },
  {
    title: "Search for Rides",
    description: "Enter your pickup, destination, and date to explore available rides.",
  },
  {
    title: "Choose Your Ride",
    description: "Compare fares, seat availability, and captain ratings before booking.",
  },
  {
    title: "Book & Relax",
    description: "Confirm your booking and track the ride in real-time. Enjoy your journey!",
  },
];

export default function ProgressMorphStepper({ onClose }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleNext = () => {
    if (step < steps.length - 1) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    localStorage.setItem("onboardingComplete", "true");
    setVisible(false);
    if (onClose) onClose();
  };

  const handleClose = () => {
    localStorage.setItem("onboardingComplete", "true");
    setVisible(false);
    if (onClose) onClose();
  };



  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl p-6 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl text-white animate-fade-in transform scale-100 transition-all duration-300 ease-out">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 bg-white/10 rounded-full hover:bg-red-500 transition"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Stepper Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-white/80 mb-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`text-center w-full ${
                  i === step ? "text-cyan-400 font-bold" : "text-white/40"
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">{steps[step].title}</h2>
          <p className="text-white/80 text-sm md:text-base">
            {steps[step].description}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white disabled:opacity-30 transition"
          >
            Back
          </button>
          {step === steps.length - 1 ? (
            <button
              onClick={handleFinish}
              className="px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md transition"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-md transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}