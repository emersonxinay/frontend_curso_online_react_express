import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

export default function SearchBar() {
  const { searchParams, updateSearchParams } = useSearch();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Music'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = ['Free', 'Under $20', '$20 - $50', 'Over $50'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/courses?search=${encodeURIComponent(query)}`);
      }
    };

    return (
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cursos..."
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchParams.query}
                onChange={(e) => updateSearchParams({ query: e.target.value })}
                placeholder="Search for courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="ml-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Filters
            <span className="ml-2">{Object.values(searchParams).filter(Boolean).length - 1}</span>
          </button>
        </div>

        {isFiltersOpen && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={searchParams.category}
                onChange={(e) => updateSearchParams({ category: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select
                value={searchParams.level}
                onChange={(e) => updateSearchParams({ level: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <select
                value={searchParams.priceRange}
                onChange={(e) => updateSearchParams({ priceRange: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="">Any Price</option>
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <select
                value={searchParams.sortBy}
                onChange={(e) => updateSearchParams({ sortBy: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}