// components/SearchBar.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // Perform the search logic here
  };

  return (
    <form onSubmit={handleSearch} style={styles.form} className='my-auto'>
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            style={styles.input}
        />
        <button type="submit" style={styles.button}>
            <FontAwesomeIcon icon={faSearch} />
        </button>
    </form>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Adjust height as needed
  },
  form: {
    display: 'flex',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    height: '40px',
    marginLeft: '25px'
  },
  input: {
    padding: '4px',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    flex: 1,
    color: 'black',
  },
  button: {
    padding: '4px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    width: '40px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
