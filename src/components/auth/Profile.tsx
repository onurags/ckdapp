import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // User profile data from Firebase
  const userEmail = currentUser?.email || '';
  const userName = currentUser?.displayName || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="glass-effect rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <Link 
              to="/profile/edit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="bg-blue-100 p-6 rounded-full mb-4">
                <User className="h-16 w-16 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-center">{userName}</h2>
              <p className="text-gray-600 text-center">{userEmail}</p>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{userName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">Not provided</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sex</p>
                    <p className="font-medium">Not provided</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Health Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Blood Pressure</p>
                    <p className="font-medium">Not provided</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Existing Conditions</p>
                    <p className="font-medium">Not provided</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Glucose</p>
                    <p className="font-medium">Not provided</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hemoglobin</p>
                    <p className="font-medium">Not provided</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Serum Creatinine</p>
                    <p className="font-medium">Not provided</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Albumin</p>
                    <p className="font-medium">Not provided</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}