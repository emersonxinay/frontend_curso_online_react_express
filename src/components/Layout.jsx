import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { NotificationProvider } from '../context/NotificationContext';
import { SearchProvider } from '../context/SearchContext';
import { ChatProvider } from '../context/ChatContext';
import { ProgressProvider } from '../context/ProgressContext';
import NotificationDropdown from './NotificationDropdown';
import SearchBar from './SearchBar';

const Layout = ({ children }) => {
  return (
    <NotificationProvider>
      <SearchProvider>
        <ChatProvider>
          <ProgressProvider>
            <div className="min-h-screen bg-gray-100">
              <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex justify-between h-16">
                    <Navbar />
                    <NotificationDropdown />
                  </div>
                </div>
              </nav>
              <SearchBar />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </ProgressProvider>
        </ChatProvider>
      </SearchProvider>
    </NotificationProvider>
  );
};

export default Layout;