import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SearchForm from "../Shared/SearchForm";
import FlightResults from "./FlightResults";

const SearchPage = () => {
  const { showNotification } = useContext(AuthContext) || {};
  const [searchResults, setSearchResults] = useState(null);
  const [formData, setFormData] = useState(null);
  const [searchType, setSearchType] = useState("one-way");
  const [showSearchForm, setShowSearchForm] = useState(true);

  const handleSearch = (result) => {
    if (result.error) {
      showNotification?.(result.error);
      setSearchResults(null);
    } else {
      setSearchResults(result.flights);
      setFormData(result.formData);
      setSearchType(result.searchType);
    }
  };

  return (
    <div>
      {showSearchForm ? (
        <SearchForm
          onSearch={handleSearch}
          onToggleSearch={setShowSearchForm}
        />
      ) : (
        <FlightResults
          flights={searchResults}
          formData={formData}
          searchType={searchType}
          onToggleSearch={setShowSearchForm}
        />
      )}
    </div>
  );
};

export default SearchPage;
