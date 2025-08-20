# AirBear - Eco-Friendly Ride Sharing PWA

A comprehensive Progressive Web App for solar-powered rickshaw ride-sharing with onboard bodegas.

## 🌟 Features

### Core Functionality
- **User Authentication**: Login/Register with Supabase integration
- **Ride Booking**: Select from 16 predefined locations + delivery option
- **Interactive Maps**: Real-time route visualization with Leaflet/OpenStreetMap
- **Onboard Bodega**: Order snacks, drinks, and essentials during your ride
- **Payment Integration**: Stripe payments with multiple payment options
- **Real-time Tracking**: Live driver location and trip updates
- **Trip History**: Complete travel log with eco-impact tracking

### Premium Features
- **T-Shirt Promotion**: $100 CEO-signed t-shirt with unlimited yearly rides
- **Solar Battery Monitoring**: Real-time battery status with color-coded alerts
- **Driver Management**: Comprehensive driver panel and trip management
- **Admin Dashboard**: Full system administration capabilities

### PWA Capabilities
- **Offline Support**: Service worker for offline functionality
- **Installable**: Add to home screen on mobile devices
- **Push Notifications**: Real-time ride updates
- **Responsive Design**: Optimized for all screen sizes

## 🚀 Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Maps**: Leaflet.js with OpenStreetMap
- **Payments**: Stripe (test mode ready)
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Lucide React

## 📱 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional - app works with mocks)
- Stripe account (optional - test mode available)

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd project
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` from `.env.example` and update with your keys:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xckggdmqfqajatytmiko.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Development
   NODE_ENV=development
   ```

3. **Database Setup (if using Supabase)**
   ```bash
   # Run the migration script to populate GPS locations
   node scripts/apply-migrations.js
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

**Note**: Static export is currently disabled. For deployment, use the standard Next.js build.

## 🏗 Deployment to Ionos (airbear.me)

### Via FileZilla FTP

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **FTP Upload**
   - Server: `ftp.airbear.me`
   - Username: [your-ionos-username]
   - Password: [your-ionos-password]
   - Upload contents of `out` folder to `/public_html/`

3. **Environment Variables**
   Update production environment variables in your deployment settings.

### File Structure After Upload
```
public_html/
├── index.html
├── _next/
├── icons/
├── manifest.json
├── sw.js
└── [other static files]
```

## 🗄️ Database Schema

The app uses the following Supabase tables:

- `locations` - Predefined pickup/dropoff spots
- `users` - User profiles and authentication
- `drivers` - Driver information and ratings  
- `chariots` - Vehicle data with solar battery status
- `rides` - Trip bookings and history
- `inventory` - Bodega items and pricing
- `tshirt_purchases` - T-shirt promotional purchases
- `payments` - Payment transaction records

## 🔧 Configuration

### Mock Data
If Supabase is not configured, the app automatically uses mock data for:
- Location listings
- Inventory items  
- User authentication
- Payment processing

### Stripe Integration
- Test mode uses mock payments
- Live mode requires valid Stripe keys
- Supports multiple payment methods

### PWA Settings
- Theme color: `#34D399` (green)
- Icons: Auto-generated from logo
- Offline cache: Essential routes cached

## 🌱 Eco Features

- **Solar Battery Indicator**: Real-time battery status
- **CO₂ Savings Tracking**: Environmental impact calculations
- **Sustainable Design**: Eco-friendly UI/UX choices
- **Green Branding**: Consistent environmental messaging

## 📊 Analytics & Monitoring

- Trip completion rates
- User engagement metrics
- Environmental impact tracking
- Payment success rates
- Driver performance analytics

## 🎨 Design System

### Colors
- Primary Green: `#34D399`
- Secondary Blue: `#60A5FA`  
- Accent Gold: `#FFD700`
- Accent Orange: `#FF4500`

### Typography
- Font: Inter (sans-serif)
- Weights: 400, 600, 700

### Components
- Consistent 8px spacing system
- Rounded corners (8px border-radius)
- Subtle shadows and hover effects
- Smooth transitions and animations

## 🔒 Security

- Row Level Security (RLS) on all database tables
- Authentication via Supabase Auth
- Secure payment processing via Stripe
- Environment variable protection

## 📱 PWA Features

- **Offline Mode**: Core functionality works offline
- **Install Prompt**: Add to home screen capability
- **Background Sync**: Trip data synchronization
- **Push Notifications**: Ride status updates

## 🧪 Testing

### Mock Data Testing
```bash
# Test without external services
npm run dev
# All features work with mock data
```

### Production Testing
```bash
# Test with real services
npm run build
npm start
```

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Static assets optimized
- [ ] PWA manifest validated
- [ ] Service worker registered
- [ ] SSL certificate active
- [ ] Domain configured (airbear.me)

## 📞 Support

For deployment assistance or technical questions:
- Check environment variables are correctly set
- Verify database connection
- Test payment integration in sandbox mode
- Validate PWA installation

## 🏆 MVP Ready Features

✅ Complete user authentication flow
✅ Ride booking and management
✅ Real-time map integration
✅ Payment processing (mock + live)
✅ PWA installation and offline mode  
✅ Driver and admin panels
✅ T-shirt promotional system
✅ Comprehensive trip history
✅ Solar battery monitoring
✅ Responsive design for all devices

---

**Ready for your August 18, 2025 pitch! 🚀**

*Ride Green, Snack Smart – AirBear the Eco Way!* 🌱