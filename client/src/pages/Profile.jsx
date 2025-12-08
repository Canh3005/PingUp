import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { assets } from '../assets/assets';
import ProfileCover from '../components/profile/ProfileCover';
import ProfileHeader from '../components/profile/ProfileHeader';
import AboutSection from '../components/profile/AboutSection';
import PortfolioSection from '../components/profile/PortfolioSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import ProjectsSection from '../components/profile/ProjectsSection';
import ActivitySection from '../components/profile/ActivitySection';
import ContactSection from '../components/profile/ContactSection';
import SkillsSection from '../components/profile/SkillsSection';
import EducationSection from '../components/profile/EducationSection';
import CreditsSection from '../components/profile/CreditsSection';
import EditProfileModal from '../components/profile/EditProfileModal';
import AddExperienceModal from '../components/profile/AddExperienceModal';
import AddEducationModal from '../components/profile/AddEducationModal';
import profileApi from '../api/profileApi';
import projectApi from '../api/projectApi';
import Loading from '../components/Loading';

const Profile = () => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchProjects();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileApi.getProfile();
      if (response.success) {
        setProfileData(response.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectApi.getUserProjects('published');
      console.log('Fetched projects:', response);
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const userAvatar = profileData?.avatarUrl || user?.imageUrl || user?.profile_picture || assets.sample_profile;
  const userName = profileData?.name || user?.username || user?.userName || user?.full_name || "Jane Doe";
  const userJobTitle = profileData?.jobTitle || "UX/UI Designer";
  const userCover = profileData?.coverImageUrl || '';

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedProfile) => {
    setProfileData(updatedProfile);
  };

  const handleAddExperience = () => {
    setSelectedExperience(null); // Reset to null for adding new
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (experience) => {
    setSelectedExperience(experience); // Set the experience to edit
    console.log('Editing experience:', experience);
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = async (updatedProfile) => {
    // Refresh profile data after adding/updating experience
    setProfileData(updatedProfile);
    setSelectedExperience(null); // Reset after save
  };

  const handleAddEducation = () => {
    setSelectedEducation(null); // Reset to null for adding new
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education) => {
    setSelectedEducation(education); // Set the education to edit
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = async (updatedProfile) => {
    // Refresh profile data after adding/updating education
    setProfileData(updatedProfile);
    setSelectedEducation(null); // Reset after save
  };

  // Sample data
  const portfolioItems = [
    { id: 1, tag: '#UIUX', image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=300&h=200&fit=crop' },
    { id: 2, tag: '#WebDesign', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&h=200&fit=crop' },
    { id: 3, tag: '#GameDev', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop' },
  ];

  const skills = profileData?.skills || ['User Experience', 'Web Development', 'Interaction Design'];
  const activities = [
    'Posted a new project',
    'Joined Creative & Design community',
    'Started following 5 creators'
  ];

  const currentUserData = {
    name: userName,
    jobTitle: userJobTitle,
    bio: profileData?.bio || '',
    website: profileData?.website || '',
    location: profileData?.location || '',
    skills: skills,
    avatarUrl: userAvatar,
    coverImageUrl: userCover
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-100 -mt-10">
      <ProfileCover coverImage={userCover} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            <ProfileHeader 
              userAvatar={userAvatar}
              userName={userName}
              userRole={userJobTitle}
              isOwnProfile={true}
              onEditClick={handleEditProfile}
            />
            <AboutSection bio={profileData?.bio} />
            <PortfolioSection portfolioItems={portfolioItems} />
            <ExperienceSection 
              experiences={profileData?.experiences || []} 
              onAddExperience={handleAddExperience}
              onEditExperience={handleEditExperience}
            />
            <ProjectsSection projects={projects} />
            <ActivitySection activities={activities} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <ContactSection 
              website={profileData?.website}
              location={profileData?.location}
            />
            <SkillsSection skills={skills} />
            <EducationSection 
              education={profileData?.education || []} 
              onAddEducation={handleAddEducation}
              onEditEducation={handleEditEducation}
            />
            <CreditsSection />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={currentUserData}
        onSave={handleSaveProfile}
      />

      <AddExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setSelectedExperience(null);
        }}
        onSuccess={handleSaveExperience}
        initialData={selectedExperience}
      />

      <AddEducationModal
        isOpen={isEducationModalOpen}
        onClose={() => {
          setIsEducationModalOpen(false);
          setSelectedEducation(null);
        }}
        onSuccess={handleSaveEducation}
        initialData={selectedEducation}
      />
    </div>
  );
};

export default Profile;
