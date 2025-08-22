# Social Media App - Database Setup Guide

## Quick Installation

### Method 1: Automatic Installation (Recommended)
1. Open your browser and navigate to: `http://localhost/your-project-folder/install.php`
2. The installation script will automatically:
   - Create the database if it doesn't exist
   - Create all required tables with proper relationships
   - Set up indexes for optimal performance
   - Display installation progress

### Method 2: Manual Installation
1. Import the SQL file: `config/database.sql`
2. Or run the SQL commands manually in phpMyAdmin

## Database Configuration

### File Structure
```
config/
├── database_config.php    # Database connection settings
├── connect.php           # Main connection file
├── database_info.php     # Database helper functions
└── auth.php             # Authentication functions
```

### Configuration Settings
Edit `config/database_config.php` to change database settings:

```php
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'social_media_db');
```

## Database Tables

### Core Tables
1. **users** - User accounts and profiles
2. **posts** - User posts (images/videos)
3. **follows** - Follow/following relationships
4. **likes** - Post likes
5. **comments** - Post comments

### Advanced Features
6. **stories** - 24-hour stories
7. **reels** - Short video content
8. **messages** - Direct messaging
9. **conversations** - Message threads
10. **notifications** - User notifications

### Additional Features
11. **story_views** - Story view tracking
12. **hashtags** - Hashtag system
13. **post_hashtags** - Post-hashtag relationships
14. **saved_posts** - Saved posts feature
15. **query** - Help/support queries

## Database Status & Management

### Check Database Status
Visit: `http://localhost/your-project-folder/database_status.php`

This page shows:
- Connection status
- Table information
- Record counts
- Database management options

### Features
- **Real-time status**: Check if database is properly installed
- **Table overview**: See all tables and record counts
- **Clean database**: Remove all data (for testing)
- **Reinstall**: Quick reinstall option

## Security Features

### Data Protection
- Foreign key constraints for data integrity
- Proper indexing for performance
- Prepared statements in PHP code
- Password hashing (MD5 - consider upgrading to bcrypt)

### Recommendations
1. Change default database credentials
2. Use environment variables for sensitive data
3. Enable SSL for database connections
4. Regular database backups

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check database credentials in `config/database_config.php`
   - Ensure MySQL/MariaDB is running
   - Verify database exists

2. **Tables Not Created**
   - Check MySQL user permissions
   - Ensure database user has CREATE privileges
   - Check for SQL syntax errors

3. **Foreign Key Errors**
   - Ensure InnoDB engine is used
   - Check foreign key constraints
   - Verify referenced tables exist

### Error Logs
Check PHP error logs and MySQL error logs for detailed error information.

## Performance Optimization

### Indexes
The database includes optimized indexes for:
- User lookups
- Post queries
- Follow relationships
- Notification queries
- Message threads

### Recommendations
- Regular database maintenance
- Monitor slow queries
- Consider caching for high-traffic scenarios
- Optimize images before storing URLs

## Backup & Restore

### Backup Command
```bash
mysqldump -u username -p social_media_db > backup.sql
```

### Restore Command
```bash
mysql -u username -p social_media_db < backup.sql
```

## Development Notes

### Adding New Tables
1. Add table SQL to `install.php`
2. Update `config/database_info.php` if needed
3. Create corresponding API endpoints
4. Update documentation

### Database Migrations
For production environments, consider implementing proper database migrations instead of dropping/recreating tables.

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Compatibility**: MySQL 5.7+, MariaDB 10.2+