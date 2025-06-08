import "../../styles/SearchBar.scss";

function SearchBar({ route, showSearchForm, onToggle }) {
  return (
    <div className="search-bar" onClick={onToggle}>
      <span className="search-icon">🔍</span>
      <span className="route">{route}</span>
    </div>
  );
}

export default SearchBar;
