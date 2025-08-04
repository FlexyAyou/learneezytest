
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'quarterly';
  maxUsers?: number;
  maxCourses?: number;
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  trialDays: number;
  setupFee: number;
  discountPercentage: number;
  targetAudience: 'individual' | 'team' | 'enterprise' | 'education';
  aiRecommendations?: {
    suggestedFor: string[];
    upgradeReasons: string[];
  };
  createdAt: string;
  updatedAt: string;
  subscribers: number;
  conversionRate?: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  organizationId?: string;
  status: 'active' | 'expired' | 'cancelled' | 'suspended' | 'trial';
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  autoRenewal: boolean;
  paymentMethod: {
    type: string;
    last4?: string;
    expiryDate?: string;
  };
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  totalAmountPaid: number;
  discountApplied: number;
  notes?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  plan?: SubscriptionPlan;
}

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentId?: string;
  invoiceNumber?: string;
  transactionDate: string;
  failureReason?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionNotification {
  id: string;
  subscriptionId: string;
  type: 'renewal_reminder' | 'expiration_warning' | 'payment_failed' | 'trial_ending' | 'upgrade_suggestion';
  scheduledDate: string;
  sentDate?: string;
  status: 'pending' | 'sent' | 'failed';
  templateData: Record<string, any>;
  emailContent: string;
}

export interface SubscriptionAnalytics {
  id: string;
  date: string;
  planId: string;
  newSubscriptions: number;
  renewals: number;
  cancellations: number;
  churnRate: number;
  revenue: number;
  activeSubscriptions: number;
  trialConversions: number;
}

export interface SubscriptionRole {
  id: string;
  subscriptionId: string;
  userId: string;
  role: 'owner' | 'admin' | 'manager' | 'user';
  permissions: Record<string, boolean>;
  grantedBy?: string;
  grantedAt: string;
  expiresAt?: string;
}

export interface SubscriptionFilters {
  status?: string[];
  planType?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  sortBy?: 'created' | 'revenue' | 'users' | 'expiry';
  sortOrder?: 'asc' | 'desc';
}
