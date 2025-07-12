import React, { useState } from 'react';
import { Search, Filter, FileText, Calendar, User, Tag } from 'lucide-react';

const SearchDocuments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: '',
    contentType: '',
    author: '',
    tags: [],
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    // Mock search results
    setTimeout(() => {
      setResults([
        {
          id: '1',
          title: 'Annual Financial Report 2023',
          content: 'This comprehensive report covers our financial performance for the year 2023, including revenue growth, profit margins, and strategic investments...',
          author: 'Finance Team',
          date: '2024-01-15',
          type: 'PDF',
          tags: ['financial', 'annual', 'report'],
          score: 0.95,
        },
        {
          id: '2',
          title: 'Product Development Roadmap',
          content: 'Our product development strategy for the next quarter focuses on enhancing user experience and implementing new features based on customer feedback...',
          author: 'Product Team',
          date: '2024-01-10',
          type: 'Word',
          tags: ['product', 'development', 'roadmap'],
          score: 0.87,
        },
        {
          id: '3',
          title: 'Meeting Minutes - Board Meeting',
          content: 'Minutes from the quarterly board meeting discussing strategic initiatives, budget allocation, and performance metrics...',
          author: 'Executive Assistant',
          date: '2024-01-08',
          type: 'Text',
          tags: ['meeting', 'board', 'minutes'],
          score: 0.75,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Documents</h2>
        <p className="text-gray-600">
          Search through your document collection using advanced filtering and AI-powered semantic search
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search documents, content, or metadata..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All dates</option>
              <option value="last-week">Last week</option>
              <option value="last-month">Last month</option>
              <option value="last-quarter">Last quarter</option>
              <option value="last-year">Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <select
              value={filters.contentType}
              onChange={(e) => handleFilterChange('contentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All types</option>
              <option value="pdf">PDF</option>
              <option value="word">Word Document</option>
              <option value="text">Text File</option>
              <option value="image">Image</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              placeholder="Filter by author"
              value={filters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              placeholder="Filter by tags"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Searching documents...</span>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Found {results.length} results for "{searchQuery}"
            </p>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sort by relevance</option>
                <option>Sort by date</option>
                <option>Sort by title</option>
              </select>
            </div>
          </div>

          {results.map((result) => (
            <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                      {result.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{result.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(result.date).toLocaleDateString()}</span>
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {result.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Score: {Math.round(result.score * 100)}%
                  </span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${result.score * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-3 line-clamp-3">
                {result.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {result.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                  <button className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
          <p className="text-gray-600">
            Enter a search query above to find documents in your collection.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchDocuments;