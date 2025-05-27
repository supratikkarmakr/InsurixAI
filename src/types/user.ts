export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  aadhaarNumber?: string;
  panNumber?: string;
  dateOfBirth?: Date;
  address?: Address;
  profilePictureUrl?: string;
  kycStatus: KYCStatus;
  profileCompletionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  documents: UserDocument[];
  preferences: UserPreferences;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: Gender;
  dateOfBirth: Date;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  annualIncome?: number;
}

export interface ContactInfo {
  primaryEmail: string;
  secondaryEmail?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  whatsappNumber?: string;
  address: Address;
  emergencyContact?: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface UserDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  issueDate?: Date;
  expiryDate?: Date;
  issuingAuthority?: string;
  fileUrl?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  theme: 'light' | 'dark' | 'auto';
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
  claimUpdates: boolean;
  renewalReminders: boolean;
  policyUpdates: boolean;
}

export interface PrivacySettings {
  shareDataWithPartners: boolean;
  allowLocationTracking: boolean;
  allowAnalytics: boolean;
  showProfileInSearch: boolean;
}

// Enums
export enum KYCStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated'
}

export enum DocumentType {
  AADHAAR = 'aadhaar',
  PAN = 'pan',
  PASSPORT = 'passport',
  DRIVING_LICENSE = 'driving_license',
  VOTER_ID = 'voter_id',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
  SALARY_SLIP = 'salary_slip'
}

export enum VerificationStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

// Form data interfaces
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdateForm {
  fullName?: string;
  phone?: string;
  dateOfBirth?: Date;
  address?: Partial<Address>;
  occupation?: string;
  annualIncome?: number;
}

// API Response types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserResponse {
  user: User;
  profile?: UserProfile;
}

export interface KYCResponse {
  status: KYCStatus;
  documents: UserDocument[];
  completionPercentage: number;
  nextSteps: string[];
  estimatedCompletionTime?: string;
} 