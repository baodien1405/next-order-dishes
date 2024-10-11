# Project Order Dishes Management

## Analyzing your bundles

- Run the following command to analyze your bundles:

```js
ANALYZE=true npm run build
# or
ANALYZE=true yarn build
# or
ANALYZE=true pnpm build
```

## Warning

- i18n with routing

  - next-intl not working with generateStaticParams
  - next-intl not working with intercepting and parallel route
  - link issue: https://github.com/amannn/next-intl/issues/255

- i18n without routing

  - convert page (server components) to dynamic rendering

## Main feature of the project

- Authentication module: Manage by JWT

  - Login
  - Logout
  - RefreshToken

- Permission by Role

  - Admin
  - Employee
  - Guest

- Admin System Page (only access when the role is admin)

  - Dashboard Indicator Page
  - Accounts
    - CRUD accounts
    - Pagination
  - Dishes
    - CRUD dishes
    - Pagination
  - Orders
    - CRUD orders
    - Pagination
  - Tables
    - CRUD tables
    - Pagination
  - Setting
    - Update user profile

## Technical Stack

- Framework: Next.js 14
- UI / CSS Library: Tailwindcss + ShadcnUI
- State Management: React Query (server state) and Zustand (local state)
- Form Management: React Hook Form
- Validation: Zod
- API: Rest API of repo server-order-dishes
- Support SEO
- More...
