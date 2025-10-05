# My Next.js App

This is a Next.js application that includes an admin panel, user panel, and public routes. The project is structured to provide a clean and maintainable codebase suitable for enterprise-level applications.

## Project Structure

```
my-nextjs-app
├── src
│   ├── pages
│   │   ├── index.tsx           # Home page
│   │   ├── products.tsx        # Product listing
│   │   ├── contact.tsx         # Contact page
│   │   ├── admin
│   │   │   ├── dashboard.tsx   # Admin dashboard
│   │   │   └── users.tsx       # Manage users
│   │   ├── user
│   │   │   ├── profile.tsx     # User profile
│   │   │   └── orders.tsx      # User orders
│   ├── components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── styles
│   │   ├── globals.css
│   │   └── theme.ts
│   └── utils
│       └── api.ts
├── public
│   └── favicon.ico
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 20.19.4 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd my-nextjs-app
   ```

2. Install the dependencies:

   ```
   npm install
   ```

### Running the Application

To start the development server, run:

```
npm run dev
```

Open your browser and navigate to `http://localhost:3001` (Next.js frontend) to see the application in action. The backend API runs on `http://localhost:8000`.

### Features

- **Home Page**: Displays the main content and navigation.
- **Product Listing**: Shows a list of products with details.
- **Contact Page**: Provides a contact form for inquiries.
- **Admin Dashboard**: Overview of admin functionalities.
- **User Management**: Admin can view and manage user accounts.
- **User Profile**: Users can view and update their profile information.
- **Order History**: Users can view their past orders.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License

This project is licensed under the MIT License. See the LICENSE file for details.