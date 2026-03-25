import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Subscription {
    status: Variant_active_cancelled_inactive;
    stripeSubscriptionId?: string;
    plan: Variant_pro_lite_plus;
    lastUpdated: Time;
    billingCycle: Variant_monthly_yearly;
    stripeCustomerId?: string;
    startDate: Time;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Resume {
    id: string;
    title: string;
    jsonData: string;
    createdAt: Time;
    updatedAt: Time;
    template: Variant_creative_minimal_modern;
}
export interface UserProfile {
    displayName: string;
    subscription?: Subscription;
    email: string;
}
export interface Transaction {
    id: string;
    status: Variant_pending_completed_failed;
    paymentMethod: Variant_stripe_paypal;
    createdAt: Time;
    plan: Variant_pro_lite_plus;
    amountCents: bigint;
    updatedAt: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_active_cancelled_inactive {
    active = "active",
    cancelled = "cancelled",
    inactive = "inactive"
}
export enum Variant_creative_minimal_modern {
    creative = "creative",
    minimal = "minimal",
    modern = "modern"
}
export enum Variant_monthly_yearly {
    monthly = "monthly",
    yearly = "yearly"
}
export enum Variant_pending_completed_failed {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum Variant_pro_lite_plus {
    pro = "pro",
    lite = "lite",
    plus = "plus"
}
export enum Variant_stripe_paypal {
    stripe = "stripe",
    paypal = "paypal"
}
export interface backendInterface {
    addTransaction(transaction: Transaction): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkStripeSubscription(subscriptionId: string): Promise<string>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createResume(resume: Resume): Promise<string>;
    deleteResume(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getResumes(): Promise<Array<Resume>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserIdNameMap(): Promise<Array<[Principal, string]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSubscription(): Promise<Subscription | null>;
    getUserTransactions(): Promise<Array<Transaction>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateResume(resume: Resume): Promise<void>;
    updateSubscription(subscription: Subscription): Promise<void>;
}
