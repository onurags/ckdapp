import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FileUpload } from './FileUpload';
import { Microscope, FileText, Activity, Brain, FlaskRound, Quote, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const INSPIRATIONAL_QUOTES = [
  {
    text: "Your health is an investment, not an expense.",
    author: "Unknown"
  },
  {
    text: "The greatest wealth is health.",
    author: "Virgil"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Health is not valued until sickness comes.",
    author: "Thomas Fuller"
  },
  {
    text: "Prevention is better than cure.",
    author: "Desiderius Erasmus"
  }
];

export function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [currentQuote, setCurrentQuote] = React.useState(0);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  React.useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % INSPIRATIONAL_QUOTES.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  // Close the dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-gradient-x">
      <header className="glass-effect sticky top-0 z-40 shadow-sm animate-glow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Microscope className="h-8 w-8 text-blue-600 animate-float" />
              <h1 className="text-2xl font-bold text-gray-900">KidneyAI Analysis System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4 mr-6">
                <Activity className="h-6 w-6 text-green-500 animate-pulse" />
                <Brain className="h-6 w-6 text-blue-500 animate-pulse" />
                <FlaskRound className="h-6 w-6 text-purple-500 animate-pulse" />
              </div>
              
              <div className="relative profile-menu-container">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="bg-blue-100 p-1 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium hidden sm:inline-block">
                    {currentUser?.displayName || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      View Profile
                    </Link>
                    <Link 
                      to="/profile/edit" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Update Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome, {currentUser?.displayName || 'User'}!</h2>
          <p className="text-gray-600">
            Use the tools below to analyze kidney health through tissue images or medical reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="hover-scale transition-all">
            <div className="glass-effect rounded-xl p-6 h-full animate-glow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Microscope className="h-6 w-6 text-blue-600 mr-2" />
                Tissue Image Analysis
              </h2>
              <FileUpload
                onFileUpload={() => {}}
                acceptedTypes={['image/*']}
                title="Upload Tissue Image"
                description="Drop a tissue image or click to browse"
              />
            </div>
          </div>

          <div className="hover-scale transition-all">
            <div className="glass-effect rounded-xl p-6 h-full animate-glow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                Medical Report Analysis
              </h2>
              <FileUpload
                onFileUpload={() => {}}
                acceptedTypes={['.csv', '.xlsx', '.pdf']}
                title="Upload Medical Report"
                description="Drop a report file (CSV, XLSX, or PDF) or click to browse"
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="glass-effect rounded-xl p-6 text-center max-w-2xl mx-auto">
            <Quote className="h-6 w-6 text-blue-500 mx-auto mb-4" />
            <div key={currentQuote} className="quotes-transition">
              <p className="text-lg text-gray-700 italic mb-2">
                "{INSPIRATIONAL_QUOTES[currentQuote].text}"
              </p>
              <p className="text-sm text-gray-500">
                - {INSPIRATIONAL_QUOTES[currentQuote].author}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}