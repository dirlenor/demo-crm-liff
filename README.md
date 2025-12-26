# LINE LIFF Points Demo Application

A LINE LIFF (LINE Front-end Framework) web application for tour company customers to view and manage their loyalty points. The app runs inside the LINE app, identifies users via LINE userId, and integrates with Supabase PostgreSQL database for data persistence.

## Features

- **Points Dashboard**: View current points balance, tour information, and transaction history
- **Earn Points**: Demo button to add points (+10 points)
- **Redeem Points**: Redeem points with balance validation (e.g., 50 points)
- **QR Code Redemption**: One-time use QR codes for earning points
- **Bilingual Support**: Thai and English language toggle
- **Real-time Updates**: Points balance updates immediately after transactions

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **LINE Integration**: LINE LIFF SDK
- **Database**: Supabase (PostgreSQL)
- **Styling**: Inline styles (mobile-first design)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- LINE Official Account
- LINE Developers account

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** > **API** to get:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (your Supabase anon key)
3. Go to **SQL Editor** in Supabase dashboard
4. Run the migration file `src/supabase/migrations/001_initial_schema.sql` to create:
   - `tour_members` table
   - `point_transactions` table
   - `qr_coupons` table
   - Database functions (`earn_points`, `redeem_points`, `redeem_qr_code`)

#### Row Level Security (RLS) Policies

For production, you should set up RLS policies. For demo purposes, you can temporarily disable RLS or use service role key. Example policies:

```sql
-- Allow users to read their own tour_members data
CREATE POLICY "Users can read own tour_members"
ON tour_members FOR SELECT
USING (true);

-- Allow users to update their own points_balance
CREATE POLICY "Users can update own points"
ON tour_members FOR UPDATE
USING (true);

-- Allow users to read their own transactions
CREATE POLICY "Users can read own transactions"
ON point_transactions FOR SELECT
USING (true);

-- Allow reading qr_coupons for validation
CREATE POLICY "Anyone can read qr_coupons"
ON qr_coupons FOR SELECT
USING (true);
```

### 2. LINE LIFF Setup

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Select your provider and channel (LINE Official Account)
3. Go to **LIFF** tab
4. Click **Add** to create a new LIFF app
5. Configure:
   - **LIFF app name**: Points Demo (or any name)
   - **Size**: Full
   - **Endpoint URL**: Your deployed app URL (e.g., `https://your-app.vercel.app`)
   - **Scope**: profile
   - **Bot link feature**: Off (for demo)
6. Copy the **LIFF ID** (starts with `xxxxx-xxxxx`)

### 3. Local Development Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables in `.env`:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_LIFF_ID=xxxxx-xxxxx
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. **Important**: LIFF requires HTTPS. For local development, use one of these options:
   - **ngrok**: `ngrok http 5173` (or your dev server port)
   - **Cloudflare Tunnel**: `cloudflared tunnel --url http://localhost:5173`
   - Update your LIFF endpoint URL to the tunnel URL

### 4. Testing QR Codes

To test QR code redemption:

1. Insert a test QR code into the database:
   ```sql
   INSERT INTO qr_coupons (code, points, used)
   VALUES ('TEST123', 20, false);
   ```

2. Access your LIFF app with the QR code parameter:
   ```
   https://your-liff-url?code=TEST123
   ```

3. The app will automatically redeem the QR code and award points.

## Project Structure

```
DemoCRM_LIFF/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── PointsDashboard.tsx    # Main dashboard component
│   │   ├── PointsHistory.tsx       # Transaction history list
│   │   ├── EarnPointsButton.tsx    # Earn points button
│   │   ├── RedeemPointsButton.tsx  # Redeem points button
│   │   └── LanguageToggle.tsx      # Language switcher
│   ├── services/
│   │   ├── liff.ts                 # LIFF SDK integration
│   │   ├── supabase.ts             # Supabase client
│   │   ├── pointsService.ts        # Points operations
│   │   └── qrService.ts            # QR code operations
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   ├── utils/
│   │   └── i18n.ts                 # Internationalization
│   ├── supabase/
│   │   └── migrations/
│   │       └── 001_initial_schema.sql
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Database Schema

### tour_members
- `line_user_id` (TEXT, PRIMARY KEY): LINE user ID
- `display_name` (TEXT): Customer name/nickname
- `current_tour` (TEXT): Current tour name
- `points_balance` (INTEGER): Current points balance
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp

### point_transactions
- `id` (UUID, PRIMARY KEY): Transaction ID
- `line_user_id` (TEXT): Reference to tour_members
- `type` (TEXT): 'earn' or 'redeem'
- `amount` (INTEGER): Points amount
- `description` (TEXT): Transaction description
- `created_at` (TIMESTAMPTZ): Transaction timestamp

### qr_coupons
- `code` (TEXT, PRIMARY KEY): QR code string
- `points` (INTEGER): Points to award
- `used` (BOOLEAN): Usage status
- `used_by` (TEXT): LINE user ID who used it
- `used_at` (TIMESTAMPTZ): Usage timestamp
- `created_at` (TIMESTAMPTZ): Creation timestamp

## Usage

### For Customers

1. Open LINE Official Account
2. Tap menu item (e.g., "คะแนนของฉัน" / "My Points")
3. LIFF app opens showing:
   - Current points balance
   - Current tour information
   - Recent transaction history
   - Earn/Redeem buttons

### QR Code Redemption

1. Scan QR code at tour location
2. Opens LIFF app with `?code=XXXX` parameter
3. System validates and redeems code
4. Points are added to account
5. Code is marked as used (one-time use only)

## Development

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy

Deploy the `dist/` folder to any static hosting service:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Make sure to:
1. Set environment variables in your hosting platform
2. Update LIFF endpoint URL in LINE Developers Console
3. Ensure HTTPS is enabled (required for LIFF)

## Troubleshooting

### LIFF initialization fails
- Check that LIFF ID is correct in `.env`
- Ensure the app is accessed from LINE app (not browser)
- Verify HTTPS is enabled

### Supabase connection errors
- Verify Supabase URL and anon key in `.env`
- Check RLS policies if data access is denied
- Ensure database tables are created via migration

### QR code redemption fails
- Verify QR code exists in `qr_coupons` table
- Check that code hasn't been used already
- Ensure user exists in `tour_members` table

## License

This project is for demonstration purposes.
