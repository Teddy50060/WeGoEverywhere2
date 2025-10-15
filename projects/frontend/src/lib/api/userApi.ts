import { apiCall } from '@/utils/api';

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  telephoneNumber?: string;
  bio?: string;
  birthdate: string;
  sex?: string;
  signupTime?: string;
  signupDate?: string;
  profilePicture?: string; // This would come from OAuth or be added to schema later
}

export const userApi = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    return apiCall('/users/me');
  },
  
  // Update user profile
  updateUser: async (data: Partial<User>): Promise<User> => {
    return apiCall('/users/edit', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  // Get all users (if needed)
  getAllUsers: async (): Promise<User[]> => {
    return apiCall('/users');
  },
};
