import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import FollowersSection from '../components/profile/FollowersSection';
import FollowingSection from '../components/profile/FollowingSection';
import FollowModal from '../components/profile/FollowModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import AddExperienceModal from '../components/profile/AddExperienceModal';
import AddEducationModal from '../components/profile/AddEducationModal';
import profileApi from '../api/profileApi';
import followApi from '../api/followApi';
import projectApi from '../api/projectApi';
import Loading from '../components/Loading';
import ProjectView from './ProjectView';

const Profile = () => {
  const { profileId } = useParams(); // Get userId from URL params
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalType, setFollowModalType] = useState('followers');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Check if viewing own profile
  const isOwnProfile = !profileId || profileId === user?._id;

  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchFollowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]); // Re-fetch when profileId changes

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      let response;
      
      if (isOwnProfile) {
        // Fetch own profile
        response = await profileApi.getProfile();
      } else {
        // Fetch other user's profile
        response = await profileApi.getProfileByUserId(profileId);
      }
      
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
      let response;
      
      if (isOwnProfile) {
        // Fetch own projects (published only for display)
        response = await projectApi.getUserProjects('published');
      } else {
        // Fetch other user's published projects
        response = await projectApi.getUserPublishedProjects(profileId);
      }
      
      console.log('Fetched projects:', response);
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchFollowData = async () => {
    try {
      const targetUserId = isOwnProfile ? user?._id : profileId;
      if (!targetUserId) return;

      const promises = [
        followApi.getFollowers(targetUserId, 1, 3),
        followApi.getFollowing(targetUserId, 1, 3)
      ];

      // Check follow status if viewing other user's profile
      if (!isOwnProfile && user) {
        promises.push(followApi.checkFollowStatus(targetUserId));
      }

      const results = await Promise.all(promises);
      const [followersRes, followingRes, followStatusRes] = results;
      console.log('Fetched follow data:', { followersRes, followingRes, followStatusRes });

      if (followersRes.success) {
        setFollowers(followersRes.data.followers || []);
      }
      if (followingRes.success) {
        setFollowing(followingRes.data.following || []);
      }
      if (followStatusRes && followStatusRes.success) {
        setIsFollowing(followStatusRes.data.isFollowing);
      }
    } catch (error) {
      console.error('Error fetching follow data:', error);
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

  const handleViewFollowers = () => {
    setFollowModalType('followers');
    setShowFollowModal(true);
  };

  const handleViewFollowing = () => {
    setFollowModalType('following');
    setShowFollowModal(true);
  };

  const handleFollowToggle = async () => {
    if (isFollowLoading || !user || !profileId) return;
    
    try {
      setIsFollowLoading(true);
      if (isFollowing) {
        const response = await followApi.unfollowUser(profileId);
        if (response.success) {
          setIsFollowing(false);
          // Refresh follow data to update counts
          fetchFollowData();
        }
      } else {
        const response = await followApi.followUser(profileId);
        if (response.success) {
          setIsFollowing(true);
          // Refresh follow data to update counts
          fetchFollowData();
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleCloseProject = () => {
    setSelectedProjectId(null);
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Cover skeleton */}
        <div className="w-full h-64 bg-gray-200 animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="flex gap-3 mt-4">
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
                      <div className="h-10 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>

              {/* Projects Section Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>

              {/* Experience Section Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Section Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>

              {/* Followers Section Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* Skills Section Skeleton */}
              <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded-full w-24"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <ProfileCover coverImage={userCover} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader
              userAvatar={userAvatar}
              userName={userName}
              userRole={userJobTitle}
              isOwnProfile={isOwnProfile}
              onEditClick={handleEditProfile}
              isFollowing={isFollowing}
              isFollowLoading={isFollowLoading}
              onFollowToggle={handleFollowToggle}
            />
            <AboutSection bio={profileData?.bio} />
            <ProjectsSection projects={projects} onProjectClick={setSelectedProjectId} isOwnProfile={isOwnProfile} />
            <PortfolioSection portfolioItems={portfolioItems} />
            <ExperienceSection
              experiences={profileData?.experiences || []}
              onAddExperience={isOwnProfile ? handleAddExperience : null}
              onEditExperience={isOwnProfile ? handleEditExperience : null}
              isOwnProfile={isOwnProfile}
            />
            <ActivitySection activities={activities} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ContactSection
              website={profileData?.website}
              location={profileData?.location}
            />
            <FollowersSection 
              followers={followers}
              onViewAll={handleViewFollowers}
            />
            <FollowingSection 
              following={following} 
              onViewAll={handleViewFollowing}
            />
            <SkillsSection skills={skills} />
            <EducationSection
              education={profileData?.education || []}
              onAddEducation={isOwnProfile ? handleAddEducation : null}
              onEditEducation={isOwnProfile ? handleEditEducation : null}
              isOwnProfile={isOwnProfile}
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
      <FollowModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        userId={isOwnProfile ? user?._id : profileId}
        type={followModalType}
      />

      {selectedProjectId && (
        <ProjectView 
          projectId={selectedProjectId} 
          onClose={handleCloseProject} 
        />
      )}
    </div>
  );
};

export default Profile;
