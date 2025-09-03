import React, { useState } from "react";
import s from "./SearchInput.module.scss";
import SearchIcon from "../../../assets/icons/icon-search.svg";

type SearchInputProps = {
  compact?: boolean;
};

const SearchInput: React.FC<SearchInputProps> = ({ compact }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (compact && !isOpen) {
    return (
      <button
        className={s.search__iconButton}
        aria-label="Open search"
        onClick={() => setIsOpen(true)}
      >
        <img src={SearchIcon} alt="Search icon" />
      </button>
    );
  }

  return (
    <div className={s.search}>
      <img src={SearchIcon} alt="Search icon" className={s.search__icon} />
      <input type="text" placeholder="Search" className={s.search__input} />
      {compact && (
        <button
          className={s.search__closeButton}
          aria-label="Close search"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchInput;
