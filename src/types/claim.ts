export interface Claim {
  id: string;
  userId: string;
  policyId: string;
  
  // Claim Information
  claimNumber: string;
  incidentDate: Date;
  incidentDescription: string;
  incidentLocation?: Location;
  
  // Financial Details
  claimedAmount: number;
  estimatedAmount?: number; // ML prediction
  approvedAmount?: number;
  settledAmount?: number;
  
  // Status Tracking
  claimStatus: ClaimStatus;
  priorityLevel: PriorityLevel;
  
  // ML Analysis
  mlDamageScore?: number; // 0.00 to 1.00
  mlConfidence?: number;
  damageTypes?: string[];
  mlAnalysisResult?: MLAnalysisResult;
  
  // Processing
  reviewerId?: string;
  reviewNotes?: string;
  settlementDate?: Date;
  rejectionReason?: string;
  
  // Documents
  documents: ClaimDocument[];
  
  // Timeline
  timeline: ClaimTimelineEvent[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface ClaimDocument {
  id: string;
  claimId: string;
  documentType: ClaimDocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  
  // OCR & Analysis
  ocrExtractedText?: string;
  mlAnalysisResult?: DocumentAnalysisResult;
  isVerified: boolean;
  verifiedBy?: string;
  verificationNotes?: string;
  
  uploadedAt: Date;
}

export interface MLAnalysisResult {
  overallScore: number;
  confidence: number;
  damageAssessment: DamageAssessment;
  fraudScore?: number;
  estimatedCost: number;
  repairRecommendations?: RepairRecommendation[];
  processingTime: string;
  modelVersion: string;
}

export interface DamageAssessment {
  damageTypes: DamageType[];
  severity: DamageSeverity;
  affectedParts: AffectedPart[];
  repairability: RepairabilityAssessment;
  totalLoss: boolean;
  salvageValue?: number;
}

export interface DamageType {
  type: string;
  confidence: number;
  location: string;
  severity: DamageSeverity;
  estimatedCost: number;
}

export interface AffectedPart {
  partName: string;
  damageType: string;
  repairAction: RepairAction;
  partCost: number;
  laborCost: number;
  totalCost: number;
}

export interface RepairRecommendation {
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost: number;
  estimatedTime: string;
  requiredParts?: string[];
  preferredProviders?: string[];
}

export interface RepairabilityAssessment {
  isRepairable: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedRepairTime: string;
  recommendedAction: 'repair' | 'replace' | 'total_loss';
  safetyIssues?: string[];
}

export interface DocumentAnalysisResult {
  documentType: string;
  extractedData: Record<string, any>;
  confidence: number;
  validationResults: ValidationResult[];
  fraudIndicators?: FraudIndicator[];
}

export interface ValidationResult {
  field: string;
  isValid: boolean;
  confidence: number;
  extractedValue: any;
  expectedFormat?: string;
  errorMessage?: string;
}

export interface FraudIndicator {
  type: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  evidencePoints: string[];
}

export interface ClaimTimelineEvent {
  id: string;
  timestamp: Date;
  eventType: TimelineEventType;
  description: string;
  performedBy?: string;
  details?: Record<string, any>;
  isSystemGenerated: boolean;
}

// Enums
export enum ClaimStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  INVESTIGATING = 'investigating',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SETTLED = 'settled',
  CLOSED = 'closed',
  WITHDRAWN = 'withdrawn'
}

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum ClaimDocumentType {
  DAMAGE_PHOTO = 'damage_photo',
  POLICE_REPORT = 'police_report',
  MEDICAL_BILL = 'medical_bill',
  REPAIR_ESTIMATE = 'repair_estimate',
  INVOICE = 'invoice',
  PRESCRIPTION = 'prescription',
  DISCHARGE_SUMMARY = 'discharge_summary',
  REGISTRATION_CERTIFICATE = 'registration_certificate',
  DRIVING_LICENSE = 'driving_license',
  OTHER = 'other'
}

export enum DamageSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  SEVERE = 'severe',
  TOTAL_LOSS = 'total_loss'
}

export enum RepairAction {
  REPAIR = 'repair',
  REPLACE = 'replace',
  NO_ACTION = 'no_action',
  TOTAL_LOSS = 'total_loss'
}

export enum TimelineEventType {
  CLAIM_SUBMITTED = 'claim_submitted',
  DOCUMENTS_UPLOADED = 'documents_uploaded',
  REVIEW_STARTED = 'review_started',
  ML_ANALYSIS_COMPLETED = 'ml_analysis_completed',
  INVESTIGATOR_ASSIGNED = 'investigator_assigned',
  SITE_INSPECTION_SCHEDULED = 'site_inspection_scheduled',
  SITE_INSPECTION_COMPLETED = 'site_inspection_completed',
  ADDITIONAL_DOCUMENTS_REQUESTED = 'additional_documents_requested',
  ESTIMATE_RECEIVED = 'estimate_received',
  CLAIM_APPROVED = 'claim_approved',
  CLAIM_REJECTED = 'claim_rejected',
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_COMPLETED = 'payment_completed',
  CLAIM_CLOSED = 'claim_closed',
  CUSTOMER_UPDATE = 'customer_update',
  SYSTEM_UPDATE = 'system_update'
}

// Form interfaces
export interface ClaimForm {
  policyId: string;
  policyNumber: string;
  incidentDate: Date;
  incidentDescription: string;
  incidentLocation?: Partial<Location>;
  claimedAmount: number;
  contactPreference: 'email' | 'phone' | 'whatsapp';
  emergencyContact?: EmergencyContactDetails;
  additionalInfo?: string;
}

export interface EmergencyContactDetails {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface DocumentUploadForm {
  claimId: string;
  documentType: ClaimDocumentType;
  description?: string;
  files: File[];
}

// API Response types
export interface ClaimResponse {
  claim: Claim;
  policy?: {
    policyNumber: string;
    policyType: string;
    coverageAmount: number;
  };
  estimatedProcessingTime?: string;
  nextSteps?: string[];
  requiredDocuments?: RequiredDocument[];
}

export interface RequiredDocument {
  type: ClaimDocumentType;
  description: string;
  isMandatory: boolean;
  acceptedFormats: string[];
  maxFileSize: number;
  examples?: string[];
}

export interface ClaimSummary {
  id: string;
  claimNumber: string;
  policyNumber: string;
  claimStatus: ClaimStatus;
  claimedAmount: number;
  approvedAmount?: number;
  incidentDate: Date;
  submittedDate: Date;
  estimatedResolutionDate?: Date;
  lastUpdated: Date;
  canUploadDocuments: boolean;
  canWithdraw: boolean;
}

export interface ClaimStats {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalClaimAmount: number;
  averageProcessingTime: number; // in days
  settlementRatio: number; // percentage
  fraudulentClaims: number;
}

export interface ClaimValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  eligibilityCheck: EligibilityCheck;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

export interface EligibilityCheck {
  isEligible: boolean;
  reasons?: string[];
  policyStatus: string;
  coverageDetails: CoverageDetails;
  waitingPeriodCheck?: WaitingPeriodCheck;
}

export interface CoverageDetails {
  isCovered: boolean;
  coverageType: string;
  maxCoverageAmount: number;
  remainingCoverage: number;
  deductibleAmount: number;
  copaymentPercentage?: number;
}

export interface WaitingPeriodCheck {
  hasWaitingPeriod: boolean;
  waitingPeriodDays?: number;
  waitingPeriodEndDate?: Date;
  isWaitingPeriodComplete: boolean;
} 