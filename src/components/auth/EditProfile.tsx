import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle, ArrowLeft, Save } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export function EditProfile() {
  const { currentUser, updateUserProfile, updateUserData } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [hemoglobin, setHemoglobin] = useState('');
  const [serumCreatinine, setSerumCreatinine] = useState('');
  const [albumin, setAlbumin] = useState('');
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load user data if available
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const userData = await getUserData(currentUser.uid);
          if (userData) {
            setAge(userData.age || '');
            setSex(userData.sex || '');
            setBloodPressure(userData.bloodPressure || '');
            setExistingConditions(userData.existingConditions || '');
            setBloodGlucose(userData.bloodGlucose || '');
            setHemoglobin(userData.hemoglobin || '');
            setSerumCreatinine(userData.serumCreatinine || '');
            setAlbumin(userData.albumin || '');
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    };
    
    // This is a placeholder function - in a real app, you would fetch from Firestore
    const getUserData = async (userId: string) => {
      // In a real implementation, this would fetch from Firestore
      // For now, we'll return null to simulate no existing data
      return null;
    };
    
    loadUserData();
  }, [currentUser]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!displayName.trim()) {
      return setError('Display name cannot be empty');
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      // Update display name in Firebase Auth
      await updateUserProfile(displayName);
      
      // Update additional user data
      if (currentUser) {
        const userData = {
          age,
          sex,
          bloodPressure,
          existingConditions,
          bloodGlucose,
          hemoglobin,
          serumCreatinine,
          albumin,
          updatedAt: new Date().toISOString()
        };
        
        // This function would be implemented in AuthContext to save to Firestore
        if (updateUserData) {
          await updateUserData(userData);
        }
      }
      
      setMessage('Profile updated successfully');
      
      // Navigate back to profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/profile" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Profile
          </Link>
        </div>
        
        <div className="glass-effect rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Your Profile</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{message}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
                    Sex
                  </label>
                  <select
                    id="sex"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Health Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    id="bloodPressure"
                    type="text"
                    placeholder="e.g., 120/80"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="existingConditions" className="block text-sm font-medium text-gray-700 mb-1">
                    Existing Conditions
                  </label>
                  <input
                    id="existingConditions"
                    type="text"
                    placeholder="e.g., Diabetes, Hypertension"
                    value={existingConditions}
                    onChange={(e) => setExistingConditions(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="bloodGlucose" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Glucose (mg/dL)
                  </label>
                  <input
                    id="bloodGlucose"
                    type="text"
                    value={bloodGlucose}
                    onChange={(e) => setBloodGlucose(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="hemoglobin" className="block text-sm font-medium text-gray-700 mb-1">
                    Hemoglobin (g/dL)
                  </label>
                  <input
                    id="hemoglobin"
                    type="text"
                    value={hemoglobin}
                    onChange={(e) => setHemoglobin(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="serumCreatinine" className="block text-sm font-medium text-gray-700 mb-1">
                    Serum Creatinine (mg/dL)
                  </label>
                  <input
                    id="serumCreatinine"
                    type="text"
                    value={serumCreatinine}
                    onChange={(e) => setSerumCreatinine(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="albumin" className="block text-sm font-medium text-gray-700 mb-1">
                    Albumin (g/dL)
                  </label>
                  <input
                    id="albumin"
                    type="text"
                    value={albumin}
                    onChange={(e) => setAlbumin(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}