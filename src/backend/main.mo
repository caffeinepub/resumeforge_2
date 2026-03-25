import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

actor {
  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Resume = {
    id : Text;
    title : Text;
    jsonData : Text;
    template : {
      #minimal;
      #modern;
      #creative;
    };
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type Subscription = {
    plan : {
      #lite;
      #pro;
      #plus;
    };
    billingCycle : {
      #monthly;
      #yearly;
    };
    status : {
      #active;
      #inactive;
      #cancelled;
    };
    startDate : Time.Time;
    stripeCustomerId : ?Text;
    stripeSubscriptionId : ?Text;
    lastUpdated : Time.Time;
  };

  public type Transaction = {
    id : Text;
    plan : {
      #lite;
      #pro;
      #plus;
    };
    amountCents : Nat;
    paymentMethod : {
      #stripe;
      #paypal;
    };
    status : {
      #pending;
      #completed;
      #failed;
    };
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type UserProfile = {
    displayName : Text;
    email : Text;
    subscription : ?Subscription;
  };

  module Resume {
    public func compare(resume1 : Resume, resume2 : Resume) : Order.Order {
      Text.compare(resume1.id, resume2.id);
    };
  };

  let resumes = Map.empty<Principal, Map.Map<Text, Resume>>();
  let subscriptions = Map.empty<Principal, Subscription>();
  let transactions = Map.empty<Principal, Map.Map<Text, Transaction>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func createResume(resume : Resume) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create resumes");
    };
    let id = resume.id;
    let newResume : Resume = {
      resume with
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    let userResumes = switch (resumes.get(caller)) {
      case (null) { Map.empty<Text, Resume>() };
      case (?existing) { existing };
    };
    userResumes.add(id, newResume);
    resumes.add(caller, userResumes);
    id;
  };

  public query ({ caller }) func getResumes() : async [Resume] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Can only view your own resumes");
    };
    switch (resumes.get(caller)) {
      case (null) { [] };
      case (?userResumes) { userResumes.values().toArray().sort() };
    };
  };

  public shared ({ caller }) func updateResume(resume : Resume) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update resumes");
    };
    switch (resumes.get(caller)) {
      case (null) { Runtime.trap("Resume does not exist") };
      case (?userResumes) {
        if (not userResumes.containsKey(resume.id)) {
          Runtime.trap("Resume does not exist");
        };
        let updatedResume : Resume = {
          resume with
          updatedAt = Time.now();
        };
        userResumes.add(resume.id, updatedResume);
      };
    };
  };

  public shared ({ caller }) func deleteResume(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete resumes");
    };
    switch (resumes.get(caller)) {
      case (null) { Runtime.trap("Resume does not exist") };
      case (?userResumes) {
        if (not userResumes.containsKey(id)) {
          Runtime.trap("Resume does not exist");
        };
        userResumes.remove(id);
      };
    };
  };

  public query ({ caller }) func getUserSubscription() : async ?Subscription {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Can only view your own subscription");
    };
    subscriptions.get(caller);
  };

  public shared ({ caller }) func updateSubscription(subscription : Subscription) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update subscriptions");
    };
    let updatedSubscription : Subscription = {
      subscription with
      lastUpdated = Time.now();
    };
    subscriptions.add(caller, updatedSubscription);
  };

  public shared ({ caller }) func addTransaction(transaction : Transaction) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add transactions");
    };
    let newTransaction : Transaction = {
      transaction with
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    let userTransactions = switch (transactions.get(caller)) {
      case (null) { Map.empty<Text, Transaction>() };
      case (?existing) { existing };
    };
    userTransactions.add(transaction.id, newTransaction);
    transactions.add(caller, userTransactions);
  };

  public query ({ caller }) func getUserTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Can only view your own transactions");
    };
    switch (transactions.get(caller)) {
      case (null) { [] };
      case (?userTransactions) { userTransactions.values().toArray() };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func checkStripeSubscription(subscriptionId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check subscriptions");
    };
    await getStripeSubscription(subscriptionId, getStripeConfiguration(), transform);
  };

  public shared ({ caller }) func getUserIdNameMap() : async [(Principal, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access user name mappings");
    };
    userProfiles.toArray().map(
      func((principal, userProfile)) {
        (principal, userProfile.displayName);
      }
    );
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check Stripe configuration");
    };
    stripeConfiguration != null;
  };

  func getStripeSubscription(subscriptionId : Text, config : Stripe.StripeConfiguration, transform : OutCall.Transform) : async Text {
    let url = "https://api.stripe.com/v1/subscriptions/" # subscriptionId;
    await OutCall.httpGetRequest(
      url,
      [{ name = "Authorization"; value = "Bearer " # config.secretKey }],
      transform,
    );
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };
};
