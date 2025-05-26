# Image Tools Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API and copy your Project URL and anon/public key
3. Run the migration script in the Supabase SQL Editor:

```sql
-- Copy the contents of supabase/migrations/001_create_feature_requests.sql
-- and run it in the Supabase SQL Editor
```

## Database Migration

The feature requests table will be created with the following structure:

- `id` (UUID, Primary Key)
- `title` (Text, Required)
- `description` (Text, Required)
- `user_name` (Text, Optional)
- `user_email` (Text, Optional)
- `priority` (Text, Default: 'MEDIUM')
- `status` (Text, Default: 'PENDING')
- `votes` (Integer, Default: 0)
- `is_hidden` (Boolean, Default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Row Level Security (RLS)

The migration includes RLS policies for:
- Public read access for non-hidden items
- Public insert capability
- Public vote updates
- Admin full access (requires separate admin policies)

## Admin Access

The admin panel requires authentication. Set your preferred username and password in the environment variables.

## Running the Application

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000` to use the image tools or `http://localhost:3000/admin` to access the admin panel. 