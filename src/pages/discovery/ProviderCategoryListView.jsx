import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import discoveryService from '../../services/discoveryService';
import ProviderCard from '../../components/discovery/ProviderCard';

const ProviderCategoryListView = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProviders = async () => {
      setIsLoading(true);
      try {
        // Map category title to role
        const role = category?.toLowerCase().includes('preschool') ? 'preschool' : 'daycare';
        const data = await discoveryService.fetchProviders(role);
        setProviders(data);
      } catch (error) {
        console.error("Failed to load providers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProviders();
  }, [category]);

  const filteredProviders = providers.filter(p => 
    p.center_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-app-bg dark:bg-app-bg-dark ios-container pb-12">
      {/* Header */}
      <header className="py-6 flex items-center px-4 sticky top-0 bg-app-bg/80 dark:bg-app-bg-dark/80 backdrop-blur-xl z-20">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full mr-2"
        >
          <ChevronLeft size={24} className="text-primary" />
        </button>
        <h1 className="text-xl font-black text-text-primary dark:text-text-primary-dark flex-1">
          {category || 'Discovery'}
        </h1>
        <button className="p-2 text-text-secondary">
          <SlidersHorizontal size={20} />
        </button>
      </header>

      {/* Search Bar */}
      <div className="px-4 mb-8">
        <div className="relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder={`Search ${category?.toLowerCase() || 'providers'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-app-surface dark:bg-app-surface-dark rounded-2xl border border-black/[0.05] dark:border-white/[0.05] focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest">
            {filteredProviders.length} Matches Found
          </span>
          <div className="flex items-center text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer">
            <MapPin size={12} className="mr-1" />
            Map View
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-bold text-text-secondary">Finding perfect matches...</p>
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <ProviderCard 
                key={provider.user_id} 
                provider={provider} 
                onClick={() => navigate(`/provider/${provider.user_id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Search size={30} className="text-primary/30" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">No Results Found</h3>
              <p className="text-sm text-text-secondary text-center px-8">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderCategoryListView;
