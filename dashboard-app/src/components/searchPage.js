import React, { useState } from "react";
import "../css/SearchPage.css"; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    setResults([
      `Result 1 for: ${searchTerm}`,
      `Result 2 for: ${searchTerm}`,
      `Result 3 for: ${searchTerm}`,
    ]);
  };

  return (
    <div className="min-h-screen">
      <div className="container">
        <h1>Search Here</h1>
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
            />
            <button type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#ffffff" }} />
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="result">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;