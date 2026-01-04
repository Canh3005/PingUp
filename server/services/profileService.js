import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';

class ProfileService {
  // Get user profile by userId
  async getProfile(userId) {
    try {
      let profile = await UserProfile.findOne({ userId }).populate('userId', 'username email');
      
      // If profile doesn't exist, create a default one
      if (!profile) {
        // Get user email from User model
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        profile = await UserProfile.create({
          userId,
          name: user.username || '',
          email: user.email,
          jobTitle: '',
          bio: '',
          website: '',
          location: '',
          skills: [],
          portfolioItems: [],
          projects: []
        });
      }
      
      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Update or create user profile
  async updateProfile(userId, profileData) {
    try {
      const { name, jobTitle, bio, website, location, skills, avatarUrl, coverImageUrl } = profileData;

      // Get user email from User model
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Find and update, or create if doesn't exist
      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        {
          userId,
          name,
          email: user.email, // Always sync email from User model
          jobTitle,
          bio,
          website,
          location,
          skills,
          ...(avatarUrl !== undefined && { avatarUrl }),
          ...(coverImageUrl !== undefined && { coverImageUrl })
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      ).populate('userId', 'username email');

      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Add experience
  async addExperience(userId, experienceData) {
    try {
      const profile = await UserProfile.findOne({ userId });

      if (!profile) {
        throw new Error('Profile not found');
      }

      profile.experiences.push(experienceData);
      await profile.save();

      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Update experience
  async updateExperience(userId, experienceId, experienceData) {
    try {
      const profile = await UserProfile.findOne({ userId });

      if (!profile) {
        throw new Error('Profile not found');
      }

      const experience = profile.experiences.id(experienceId);
      if (!experience) {
        throw new Error('Experience not found');
      }

      Object.assign(experience, experienceData);
      await profile.save();

      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Delete experience
  async deleteExperience(userId, experienceId) {
    try {
      const profile = await UserProfile.findOne({ userId });

      if (!profile) {
        throw new Error('Profile not found');
      }

      profile.experiences.pull(experienceId);
      await profile.save();

      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Add education
  async addEducation(userId, educationData) {
    try {
      const profile = await UserProfile.findOne({ userId });

      if (!profile) {
        throw new Error('Profile not found');
      }

      profile.education.push(educationData);
      await profile.save();

      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Update education
  async updateEducation(userId, educationId, educationData) {
    try {
      const profile = await UserProfile.findOne({ userId });

      if (!profile) {
        throw new Error('Profile not found');
      }

      const edu = profile.education.id(educationId);
      if (!edu) {
        throw new Error('Education not found');
      }

      Object.assign(edu, educationData);
      await profile.save();

      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Delete education
  async deleteEducation(userId, educationId) {
    try {
      const profile = await UserProfile.findOne({ userId });

      if (!profile) {
        throw new Error('Profile not found');
      }

      profile.education.pull(educationId);
      await profile.save();

      return profile;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProfileService();
