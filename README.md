# StockPilot – Inventory Management System

A full-stack inventory management application built with **Next.js** and **Supabase**, designed to help businesses manage products and categories through a clean, responsive dashboard.

StockPilot focuses on practical inventory workflows, data management, authentication, and a maintainable application architecture.

## Features

### Authentication & User Management

- User registration and login.
- Password recovery and reset flow.
- User profiles with role-based access (Admin and User).
- Protected application routes.

### Product Management

- Create, read, update, and delete products.
- Search and browse products.
- Database-backed pagination.
- Form validation and error handling.

### Category Management

- Create, edit, and delete categories.
- Manage product categories through a dedicated dashboard.

### User Experience

- Responsive dashboard layout.
- Arabic and English language support.
- Right-to-left (RTL) and left-to-right (LTR) layouts.
- Loading states and skeleton UI.
- Confirmation modal before destructive actions.

## Tech Stack

| Technology      | Purpose                                 |
| --------------- | --------------------------------------- |
| Next.js 16      | React framework and application routing |
| React           | UI development                          |
| TypeScript      | Static typing                           |
| Supabase        | Database and authentication             |
| TanStack Query  | Server-state management and caching     |
| React Hook Form | Form management                         |
| Zod             | Schema validation                       |
| CSS             | Application styling                     |

## Application Structure

```text
stockpilot/
├── app/
│   ├── (dashboard)/
│   │   ├── categories/
│   │   ├── products/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── auth/
│   ├── components/
│   ├── forgot-password/
│   ├── lib/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── schemas/
│   │   ├── supabase/
│   │   └── types/
│   ├── login/
│   ├── reset-password/
│   └── signup/
├── package.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mahomoudeissa/stockpilot.git
```

### 2. Navigate to the project directory

```bash
cd stockpilot
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the placeholder values with your Supabase project configuration.

**Never commit your `.env.local` file or expose secret keys in your repository.**

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database & Backend

StockPilot uses Supabase for backend services, including:

- PostgreSQL database.
- User authentication.
- User profile management.
- Product and category data.

Make sure your Supabase project has the required database tables, authentication configuration, and access policies configured before running the application.

## Future Improvements

- Inventory stock tracking and low-stock alerts.
- Dashboard analytics and reporting.
- Advanced filtering and sorting.
- Automated testing.
- Enhanced permission enforcement and security policies.

## Author

**Mahmoud Eissa**

- GitHub: [@Mahomoudeissa](https://github.com/Mahomoudeissa)

---

Built as a portfolio project to demonstrate practical frontend development, backend integration, and modern React application architecture.
