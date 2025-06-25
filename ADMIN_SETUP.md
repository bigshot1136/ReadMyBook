# ReadMyBook Admin Setup Guide

## Admin Access Configuration

ReadMyBook uses role-based authentication to control admin access. The admin system is already configured and ready to use.

## Default Admin Account

**Admin Email:** `atharvbhosale00@gmail.com`

This email address has been pre-configured as the admin account. When you sign in with this email through Replit Auth, you will automatically receive admin privileges.

## Admin Features

Once logged in as admin, you will have access to:

### 1. Admin Dashboard (`/admin`)
- **User Management**: View all registered users and their details
- **Story Management**: Monitor all user-created stories
- **Template Management**: Create, edit, and delete story templates
- **Analytics**: View platform statistics and usage metrics

### 2. Admin Navigation
- Admin link appears in the header navigation (only visible to admin users)
- Direct access to admin dashboard from any page

### 3. Template Management
- Create new story templates with custom content
- Edit existing templates (title, content, genre, age group, etc.)
- Delete templates that are no longer needed
- Set character placeholders for template customization
- Add preview images for better template presentation

### 4. User Analytics
- Total registered users count
- User registration dates and details
- User activity monitoring

### 5. Story Analytics
- Total stories created on the platform
- Story types breakdown (custom, template-based, etc.)
- User story creation patterns

## How to Access Admin Features

### Step 1: Sign In
1. Go to ReadMyBook homepage
2. Click "Sign In" button
3. Use Replit authentication with `atharvbhosale00@gmail.com`

### Step 2: Access Admin Dashboard
1. After successful login, you'll see "Admin" link in the navigation
2. Click "Admin" to access the dashboard
3. You'll be redirected to `/admin` with full admin privileges

## Adding More Admin Users

To add additional admin users, you need to modify the code:

### Method 1: Update Admin Email List
Edit `server/replitAuth.ts` and modify the admin check:

```typescript
// Check if user is admin based on email
const adminEmails = [
  "atharvbhosale00@gmail.com",
  "newadmin@example.com",  // Add new admin emails here
];
const isAdmin = adminEmails.includes(claims["email"]);
```

### Method 2: Manual Database Update
If you need to promote an existing user to admin:

1. Access your database
2. Run this SQL command:
```sql
UPDATE users SET role = 'admin' WHERE email = 'newadmin@example.com';
```

## Security Features

### Role-Based Access Control
- Only users with `role = 'admin'` can access admin features
- Admin middleware validates user permissions on every admin request
- Non-admin users receive "Access Denied" message when trying to access admin pages

### Automatic Role Assignment
- New users automatically get `role = 'user'`
- Admin users are identified by email during registration
- Role is stored in database and checked on each request

### Protected Admin Routes
All admin API endpoints are protected with both:
1. **Authentication Check**: User must be logged in
2. **Authorization Check**: User must have admin role

Protected endpoints:
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/stories` - Story management
- `POST /api/story-templates` - Create templates
- `PATCH /api/story-templates/:id` - Update templates
- `DELETE /api/story-templates/:id` - Delete templates

## Admin Dashboard Features

### User Management Tab
- View all registered users
- See user registration dates
- Monitor user activity
- Export user data (if needed)

### Story Management Tab
- View all stories created on platform
- Filter by story type (custom, template, etc.)
- Monitor content for quality assurance
- Remove inappropriate content if needed

### Template Management Tab
- Create new story templates
- Edit existing templates
- Delete unused templates
- Preview template content
- Manage character placeholders

## Troubleshooting

### "Access Denied" Message
If you see this message, it means:
1. You're not logged in with an admin account
2. Your account doesn't have admin privileges
3. There's an issue with role assignment

**Solution**: Ensure you're signed in with `atharvbhosale00@gmail.com`

### Admin Link Not Visible
If the "Admin" link doesn't appear in navigation:
1. Make sure you're logged in
2. Check that your account has admin role
3. Refresh the page after login

### Admin API Errors
If admin features return errors:
1. Check browser console for error messages
2. Verify you're authenticated
3. Confirm your admin role in the database

## Database Schema

The admin system uses these database fields:

```sql
-- Users table with role field
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  role VARCHAR DEFAULT 'user' NOT NULL,  -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Best Practices

### Security
1. **Limit Admin Access**: Only give admin privileges to trusted users
2. **Regular Audits**: Periodically review admin user list
3. **Activity Monitoring**: Monitor admin actions in logs
4. **Secure Environment**: Ensure database and environment are secure

### Content Management
1. **Template Quality**: Ensure all templates are age-appropriate
2. **Regular Updates**: Keep templates fresh and engaging
3. **User Feedback**: Monitor user feedback on templates
4. **Content Guidelines**: Establish clear content standards

### Data Management
1. **Regular Backups**: Backup database regularly
2. **User Privacy**: Handle user data responsibly
3. **Data Retention**: Establish data retention policies
4. **Export Capabilities**: Provide data export when needed

The admin system is now fully functional and secure. You can start managing ReadMyBook immediately after signing in with the admin account.