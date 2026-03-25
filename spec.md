# ResumeForge SaaS

## Current State
New Caffeine project with scaffolding only. Motoko backend stub, React/Tailwind frontend shell.

## Requested Changes (Diff)

### Add
- Landing page with hero, features section, CTA
- Authentication (email/password + social) via Caffeine authorization component
- Resume builder with multi-step form: Personal Info, Summary, Skills, Experience, Education, Projects
- Live split-screen preview with real-time updates
- Three resume templates: Minimal, Modern, Creative
- PDF export using jsPDF/html2canvas
- Pricing page with monthly/yearly toggle: Lite ($20/$200), Pro ($100/$1000 recommended), Plus ($150/$1500)
- Stripe payment integration via Caffeine stripe component
- Dashboard: user info, current subscription, saved resumes
- Transactions page: plan, amount, payment method, status, date
- Dark mode support
- Fully responsive design

### Modify
- Backend main.mo: add full data models and CRUD APIs

### Remove
- Nothing (new project)

## Implementation Plan

### Backend (Motoko)
- User profile management (name, email)
- Resume CRUD: create, read, update, delete (stores JSON data)
- Subscription tracking: plan, billingCycle, status, startDate
- Transaction log: plan, amount, paymentMethod, status, createdAt
- Stripe webhook handler to record subscriptions and transactions
- Query methods: getMyResumes, getMySubscription, getMyTransactions

### Frontend (React + TypeScript + Tailwind)
- `/` Landing page: hero, features, pricing preview, CTA
- `/login` and `/register` pages using authorization component
- `/dashboard` protected: user info card, subscription status, resume list
- `/builder` resume builder: multi-step sidebar form + live preview panel
  - Steps: Personal Info, Summary, Skills, Experience, Education, Projects
  - Template switcher: Minimal, Modern, Creative
  - PDF download button
  - localStorage autosave + backend save
- `/pricing` pricing page with monthly/yearly toggle and Stripe checkout
- `/transactions` protected: table of payment history
- `/success` and `/cancel` Stripe redirect pages
- Shared layout: navbar (logo, nav links, auth state), footer
- Dark mode toggle
