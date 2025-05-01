# PropInfo - Prop Trading Firm Directory and Review Platform

PropInfo is a comprehensive directory and review platform for futures prop trading firms. The platform allows users to browse, compare, and review different prop trading firms with detailed information about each firm's features, fee structures, and offerings.

## Features

- **Prop Firm Directory**: Comprehensive listings of prop trading firms with detailed profiles
- **Comparison Tool**: Side-by-side comparison of multiple prop firms
- **Review System**: User reviews and ratings for each prop firm
- **Educational Resources**: Articles and guides about prop trading
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Admin Panel**: Protected admin area for managing firms and content

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Tailwind CSS for styling
  - shadcn/ui component library
  - TanStack Query for data fetching
  - Wouter for routing
  - React Hook Form for form handling

- **Backend**:
  - Express.js
  - In-memory database (can be swapped with PostgreSQL)
  - REST API endpoints
  - Authentication with session management

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)

### Installation

1. Clone the repository
```bash
git clone https://github.com/jay0718/propinfo.git
cd propinfo
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open http://localhost:5001 in your browser

## Project Structure

```
├── client              # Frontend code
│   ├── src
│   │   ├── components  # React components
│   │   ├── hooks       # Custom React hooks
│   │   ├── lib         # Utility functions and types
│   │   ├── pages       # Page components
│   │   ├── App.tsx     # Main application component
│   │   └── main.tsx    # Application entry point
│   └── index.html      # HTML template
├── server              # Backend code
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data storage implementation
│   └── vite.ts         # Vite server configuration
├── shared              # Shared code between client and server
│   └── schema.ts       # Database schema and types
└── README.md           # This file
```

## API Endpoints

- `GET /api/firms` - Get all prop firms
- `GET /api/firms/featured` - Get featured prop firms
- `GET /api/firms/:id` - Get a specific prop firm
- `GET /api/firms/:id/reviews` - Get reviews for a specific firm
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create a new review
- `GET /api/resources` - Get educational resources
- `GET /api/resources/:id` - Get a specific resource
- `POST /api/auth/admin/login` - Admin login

## Admin Access

To access the admin panel:
1. Navigate to `/login`
2. Use the credentials set up in the system
3. Once logged in, you'll be redirected to `/admin`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React, Express, and TypeScript
- UI components from shadcn/ui library
- Icons from Lucide React