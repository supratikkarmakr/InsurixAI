import { supabase } from './client';
import { AuthResponse, LoginForm, RegisterForm, User } from '@/types';

export class AuthService {
  /**
   * Sign up a new user with email and password
   */
  static async signUp(data: RegisterForm): Promise<AuthResponse> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          phone: data.phone,
          kyc_status: 'pending',
          profile_completion_percentage: 30, // Basic info completed
        });

      if (profileError) throw profileError;

      return {
        user: {
          id: authData.user.id,
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          kycStatus: 'pending',
          profileCompletionPercentage: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        } as User,
        accessToken: authData.session?.access_token || '',
        refreshToken: authData.session?.refresh_token || '',
        expiresIn: authData.session?.expires_in || 3600,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  /**
   * Sign in user with email and password
   */
  static async signIn(data: LoginForm): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (!authData.user || !authData.session) {
        throw new Error('Login failed');
      }

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      return {
        user: this.transformUser(userData),
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresIn: authData.session.expires_in || 3600,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return null;

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      return this.transformUser(userData);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: updates.fullName,
          phone: updates.phone,
          date_of_birth: updates.dateOfBirth?.toISOString(),
          address: updates.address,
          profile_picture_url: updates.profilePictureUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return this.transformUser(data);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'insurixai://reset-password',
      });

      if (error) throw error;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOtp(email: string, token: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) throw error;

      if (!data.user || !data.session) {
        throw new Error('OTP verification failed');
      }

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      return {
        user: this.transformUser(userData),
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600,
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          callback(this.transformUser(userData));
        } catch (error) {
          console.error('Auth state change error:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  /**
   * Transform database user to app user type
   */
  private static transformUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      phone: dbUser.phone,
      fullName: dbUser.full_name,
      aadhaarNumber: dbUser.aadhaar_number,
      panNumber: dbUser.pan_number,
      dateOfBirth: dbUser.date_of_birth ? new Date(dbUser.date_of_birth) : undefined,
      address: dbUser.address,
      profilePictureUrl: dbUser.profile_picture_url,
      kycStatus: dbUser.kyc_status,
      profileCompletionPercentage: dbUser.profile_completion_percentage,
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at),
      isActive: dbUser.is_active,
    };
  }
}

export default AuthService; 