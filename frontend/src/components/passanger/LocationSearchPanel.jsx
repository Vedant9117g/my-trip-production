import React from "react";

const LocationSearchPanel = ({ suggestions, setPickup, setDestination, activeField, setPanelOpen }) => {
  const handleSuggestionClick = (suggestion) => {
    if (activeField === "pickup") {
      setPickup(suggestion);
    } else if (activeField === "destination") {
      setDestination(suggestion);
    }
    setPanelOpen(false); // Close the panel after selecting a suggestion
  };

  return (
    <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-50">
      {suggestions.length > 0 ? (
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
            >
              <i className="ri-map-pin-fill text-blue-500"></i>
              <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No suggestions available.</p>
      )}
    </div>
  );
};

export default LocationSearchPanel;