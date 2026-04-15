This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Email Setup (Gmail SMTP)

This project sends booking confirmation emails using Gmail SMTP. To set it up:

1. **Enable 2-Step Verification** on your Gmail account
2. **Create an App Password**:
   - Go to Google Account settings → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password (ignore spaces)

3. **Configure Environment Variables** in `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-char-app-password
   ADMIN_EMAIL=your-admin@gmail.com
   FROM_EMAIL="PIDS Booking <your-gmail@gmail.com>"
   ```

4. **Restart the development server** after adding environment variables:
   ```bash
   npm run dev
   ```

**Note**: The app will still work without email configuration, but booking confirmations won't be sent.

## Database Setup

This project uses Supabase as the database. After setting up your Supabase project:

1. **Run the initial database setup** by executing the SQL in `database_setup.sql` in your Supabase SQL Editor.

2. **If upgrading from the old schema**, run the SQL in `update_bookings.sql` to migrate to UTC timestamps.

3. **Add database constraint** to prevent duplicate bookings by running this SQL in your Supabase SQL Editor:
   ```sql
   ALTER TABLE public.bookings
   ADD CONSTRAINT unique_service_datetime
   UNIQUE (service, booking_datetime);
   ```
   This ensures no two bookings can exist for the same service at the same time.

## Availability Synchronization

The booking system includes several safeguards to prevent the "no available slots but booking fails" issue:

- **Server-side availability calculation**: The availability API is the single source of truth for available time slots
- **Real-time booking filtering**: Available slots are filtered against existing bookings on each request
- **No caching**: Availability data is never cached to ensure real-time accuracy
- **Database constraints**: Unique constraint prevents duplicate bookings at the database level
- **Comprehensive logging**: Server logs help debug availability calculations

If you encounter synchronization issues, check the server logs for availability calculation details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
