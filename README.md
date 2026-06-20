# DentalAI - Smart Dental Appointment Booking System

A modern, AI-powered dental appointment booking platform built with Next.js, featuring an intelligent chatbot, admin dashboard, and real-time analytics.

## 🌟 Features

### Patient-Facing Features
- **AI Chatbot Assistant**: 24/7 intelligent booking assistance with natural language processing
- **Service Selection**: Browse available dental services with pricing and duration information
- **Appointment Booking**: Schedule appointments with real-time availability checking
- **Responsive Design**: Beautiful dark theme with glassmorphic UI elements
- **Mobile Optimized**: Works seamlessly on all device sizes

### Admin Dashboard
- **Appointment Management**: View and manage all patient appointments
- **Status Tracking**: Update appointment status (Pending, Confirmed, Completed, Cancelled)
- **Analytics Dashboard**: Real-time revenue tracking and appointment statistics
- **Patient Profiles**: Access detailed patient information and booking history
- **Performance Metrics**: Track completion rates, no-shows, and clinic efficiency

### Technical Features
- **Authentication**: Secure email/password authentication with Better Auth
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Real-time Updates**: Dynamic status changes and live analytics
- **Type Safety**: Full TypeScript support with runtime validation
- **Responsive Charts**: Recharts for revenue trends and appointment distribution
- **Secure**: HIPAA-compliant design patterns and secure session management

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **AI**: Vercel AI SDK with Claude Sonnet
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
app/
├── page.tsx                 # Landing page with hero section
├── sign-up/
│   └── page.tsx            # Sign-up authentication page
├── sign-in/
│   └── page.tsx            # Sign-in authentication page
├── dashboard/
│   └── page.tsx            # Protected admin dashboard
├── actions/
│   └── appointments.ts     # Server actions for appointment management
└── layout.tsx              # Root layout with metadata

components/
├── auth-form.tsx           # Reusable authentication form
├── chatbot.tsx             # AI assistant chatbot component
└── dashboard-client.tsx    # Admin dashboard client component

lib/
├── auth.ts                 # Better Auth configuration
├── auth-client.ts          # Client-side auth utilities
├── db.ts                   # Database connection
└── utils/
    └── db.ts              # Database query utilities

migrations/
└── (database schemas)      # Drizzle migration files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)
- Neon Database account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dental-ai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env.local with:
DATABASE_URL=your_neon_database_url
BETTER_AUTH_SECRET=your_secret_key
ANTHROPIC_API_KEY=your_api_key
```

4. Run database migrations:
```bash
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 User Flows

### Patient Flow
1. Landing page with AI chatbot for quick questions
2. Click "Get Started" to sign up
3. Create account with email and password
4. Access booking through chatbot or dashboard
5. View appointment confirmation

### Admin Flow
1. Sign in with clinic credentials
2. Access dashboard
3. View upcoming appointments
4. Manage patient bookings
5. Track analytics and revenue

## 🎨 Design Features

- **Dark Theme**: Modern dark interface with cyan accent colors
- **Glassmorphic UI**: Frosted glass effect with backdrop blur
- **Responsive Layout**: Mobile-first design with breakpoints
- **Gradient Text**: Eye-catching headings with gradient effects
- **Smooth Transitions**: Animated components and hover states

## 🔐 Security

- Password hashing with argon2
- Session-based authentication
- CSRF protection
- Secure cookies with httpOnly flag
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## 📊 Database Schema

- **users**: Patient and admin accounts
- **appointments**: Booking records with status tracking
- **services**: Available dental procedures with pricing
- **availability**: Clinic operating hours
- **sessions**: User session management

## 🚀 Deployment

Deploy to Vercel with one click:

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Click Deploy

```bash
vercel deploy
```

## 📈 Future Enhancements

- SMS/Email appointment reminders
- Video call consultations
- Insurance integration
- Payment processing
- Staff scheduling
- Patient reviews and ratings
- Automated no-show analysis
- Integration with dental practice management software

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, please open an issue or contact support@dentalai.com

---

Built with ❤️ for modern dental practices
