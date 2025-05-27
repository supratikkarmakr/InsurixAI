// User related types
export * from './user';

// Policy related types
export * from './policy';

// Claim related types
export * from './claim';

// API related types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  pagination?: PaginationInfo;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Navigation types
export interface NavigationParams {
  [key: string]: string | number | boolean | undefined;
}

export interface TabNavigationParams {
  Home: undefined;
  Policies: undefined;
  Claims: undefined;
  Services: undefined;
  Profile: undefined;
}

export interface AuthNavigationParams {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
}

export interface ClaimNavigationParams {
  Camera: undefined;
  Details: { images?: string[] };
  Review: { claimData: any };
  Success: { claimId: string };
}

export interface PolicyNavigationParams {
  Add: undefined;
  Details: { policyId: string };
  Renew: { policyId: string };
}

// Component props
export interface BaseComponentProps {
  style?: any;
  testID?: string;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export interface ErrorProps extends BaseComponentProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

// Form validation
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea';
  placeholder?: string;
  rules?: ValidationRule[];
  options?: SelectOption[];
  defaultValue?: any;
  disabled?: boolean;
  hidden?: boolean;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormErrors {
  [fieldName: string]: string;
}

// Storage types
export interface StorageKeys {
  USER_TOKEN: string;
  USER_DATA: string;
  THEME_PREFERENCE: string;
  LANGUAGE_PREFERENCE: string;
  ONBOARDING_COMPLETED: string;
  BIOMETRIC_ENABLED: string;
  NOTIFICATION_SETTINGS: string;
}

// App state
export interface AppState {
  isLoading: boolean;
  isOnline: boolean;
  currentRoute: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

// Notification types
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

export enum NotificationType {
  CLAIM_UPDATE = 'claim_update',
  POLICY_RENEWAL = 'policy_renewal',
  PAYMENT_DUE = 'payment_due',
  DOCUMENT_REQUIRED = 'document_required',
  SETTLEMENT_COMPLETE = 'settlement_complete',
  SYSTEM_ALERT = 'system_alert',
  PROMOTIONAL = 'promotional'
}

// AI Assistant types
export interface AIConversation {
  id: string;
  sessionId: string;
  userId: string;
  messages: AIMessage[];
  context: ConversationContext;
  startedAt: Date;
  lastMessageAt: Date;
  isActive: boolean;
}

export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  intent?: string;
  confidence?: number;
  entities?: Record<string, any>;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  type: 'image' | 'document' | 'audio';
  url: string;
  fileName?: string;
  fileSize?: number;
}

export interface ConversationContext {
  currentTopic?: string;
  userIntent?: string;
  relatedEntities?: Record<string, any>;
  sessionData?: Record<string, any>;
}

// Location and Services
export interface ServiceProvider {
  id: string;
  name: string;
  serviceType: ServiceType;
  contactPhone?: string;
  contactEmail?: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  isVerified: boolean;
  operatingHours?: OperatingHours;
  servicesOffered: string[];
  distance?: number; // calculated based on user location
}

export interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export enum ServiceType {
  GARAGE = 'garage',
  HOSPITAL = 'hospital',
  TOWING = 'towing',
  LEGAL = 'legal',
  SURVEYOR = 'surveyor',
  CASHLESS_GARAGE = 'cashless_garage'
}

// File upload types
export interface FileUpload {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Environment types
export interface EnvironmentConfig {
  API_BASE_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  DEEPSEEK_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  APP_ENV: 'development' | 'staging' | 'production';
} 