import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileEdit, Users } from 'lucide-react';
import authApi from '../api/authApi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/authContext';

const OnBoarding = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleClick = async (userType) => {
    try {
        const data = await authApi.updateUserType(userType);
        console.log("User type set successfully:", data);
        toast.success("User type set successfully");
        // Update user in context
        if (data.user) {
          login(data.user);
        }
        navigate('/topic-selection');
    } catch (error) {
      console.error("Error setting user type:", error);
      toast.error("Failed to set user type");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden -mt-16">
      {/* Welcome Section */}
      <div className="max-w-4xl w-full text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Welcome to Pingup!
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          To help you get started, choose if you'd like to join Pingup<br />
          as a creative or a hirer.
        </p>
      </div>

      {/* Options Cards */}
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Creative Card */}
        <button
          onClick={() => handleClick("freelancer")}
          className="group bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 hover:border-gray-900 hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:bg-gray-900 transition-colors">
              <FileEdit className="w-7 h-7 md:w-8 md:h-8 text-gray-900 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              I'm a creative / freelancer
              <span className="text-gray-900">›</span>
            </h2>
            <p className="text-gray-600 text-sm">
              Use Pingup to showcase and discover work, get<br />
              exposure, and find job opportunities.
            </p>
          </div>
        </button>

        {/* Hirer Card */}
        <button
          onClick={() => handleClick("hirer")}
          className="group bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 hover:border-gray-900 hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:bg-gray-900 transition-colors">
              <Users className="w-7 h-7 md:w-8 md:h-8 text-gray-900 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              I'm a hirer
              <span className="text-gray-900">›</span>
            </h2>
            <p className="text-gray-600 text-sm">
              Use Pingup to post jobs, hire freelancers, and<br />
              collaborate on projects.
            </p>
          </div>
        </button>
      </div>

      {/* Both Option Link */}
      <div className="text-center">
        <button
          onClick={() => handleClick("both")}
          className="text-gray-900 hover:text-gray-800 font-medium flex items-center gap-1 transition-colors cursor-pointer hover:underline"
        >
          I'm planning to use Pingup for both
          <span>›</span>
        </button>
      </div>
    </div>
  );
};

export default OnBoarding;
