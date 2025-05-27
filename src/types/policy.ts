export interface InsurancePolicy {
  id: string;
  userId: string;
  policyNumber: string;
  policyType: PolicyType;
  providerName: string;
  policyHolderName: string;
  
  // Financial Details
  premiumAmount: number;
  coverageAmount: number;
  deductible?: number;
  
  // Dates
  policyStartDate: Date;
  policyEndDate: Date;
  premiumDueDate?: Date;
  
  // Asset Details
  assetDetails?: AssetDetails;
  
  // Policy Management
  policyStatus: PolicyStatus;
  policyDocumentUrl?: string;
  autoRenewal: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetDetails {
  vehicleDetails?: VehicleDetails;
  propertyDetails?: PropertyDetails;
  healthDetails?: HealthDetails;
  travelDetails?: TravelDetails;
}

export interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  engineNumber?: string;
  chassisNumber?: string;
  fuelType: FuelType;
  vehicleClass: VehicleClass;
  purchaseDate?: Date;
  currentValue?: number;
}

export interface PropertyDetails {
  propertyType: PropertyType;
  address: string;
  builtUpArea?: number;
  constructionYear?: number;
  propertyAge?: number;
  sumInsured: number;
}

export interface HealthDetails {
  primaryInsured: HealthInsuredPerson;
  dependents?: HealthInsuredPerson[];
  familySize: number;
  preExistingConditions?: string[];
}

export interface HealthInsuredPerson {
  name: string;
  relationship: Relationship;
  age: number;
  gender: string;
}

export interface TravelDetails {
  destinationCountries: string[];
  travelStartDate: Date;
  travelEndDate: Date;
  numberOfTravelers: number;
  tripType: TripType;
  purposeOfTravel: TravelPurpose;
}

// Enums
export enum PolicyType {
  CAR = 'car',
  BIKE = 'bike',
  HEALTH = 'health',
  LIFE = 'life',
  HOME = 'home',
  TRAVEL = 'travel'
}

export enum PolicyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended'
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  CNG = 'cng',
  ELECTRIC = 'electric'
}

export enum VehicleClass {
  PRIVATE_CAR = 'private_car',
  TWO_WHEELER = 'two_wheeler',
  COMMERCIAL_VEHICLE = 'commercial_vehicle'
}

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  COMMERCIAL = 'commercial'
}

export enum Relationship {
  SELF = 'self',
  SPOUSE = 'spouse',
  SON = 'son',
  DAUGHTER = 'daughter',
  FATHER = 'father',
  MOTHER = 'mother',
  OTHER = 'other'
}

export enum TripType {
  SINGLE_TRIP = 'single_trip',
  MULTI_TRIP = 'multi_trip',
  ANNUAL = 'annual'
}

export enum TravelPurpose {
  LEISURE = 'leisure',
  BUSINESS = 'business',
  EDUCATION = 'education',
  MEDICAL = 'medical'
} 