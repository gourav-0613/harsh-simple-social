<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media App - Database Installation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 800px;
            width: 100%;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5rem;
        }
        .status {
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            font-weight: bold;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .table-list {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .table-item {
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .table-item:last-child {
            border-bottom: none;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            text-decoration: none;
            display: inline-block;
            margin: 10px 5px;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .progress {
            width: 100%;
            height: 20px;
            background-color: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Social Media App Installation</h1>
        
        <?php
        require_once 'config/database_config.php';
        
        $installation_complete = false;
        $errors = [];
        $success_messages = [];
        $tables_created = [];
        
        // Database tables with their SQL
        $tables = [
            'users' => "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                firstName VARCHAR(50) NOT NULL,
                lastName VARCHAR(50) NOT NULL,
                bio TEXT,
                profile_picture VARCHAR(255) DEFAULT 'https://placehold.co/150x150/C6AC8F/FFFFFF?text=User',
                followers_count INT DEFAULT 0,
                following_count INT DEFAULT 0,
                posts_count INT DEFAULT 0,
                is_private BOOLEAN DEFAULT FALSE,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )",
            
            'posts' => "CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                username VARCHAR(50) NOT NULL,
                type ENUM('image', 'video') DEFAULT 'image',
                url VARCHAR(255) NOT NULL,
                caption TEXT,
                location VARCHAR(100),
                likes_count INT DEFAULT 0,
                comments_count INT DEFAULT 0,
                is_archived BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at)
            )",
            
            'follows' => "CREATE TABLE IF NOT EXISTS follows (
                id INT AUTO_INCREMENT PRIMARY KEY,
                follower_id INT NOT NULL,
                following_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_follow (follower_id, following_id),
                INDEX idx_follower (follower_id),
                INDEX idx_following (following_id)
            )",
            
            'follow_requests' => "CREATE TABLE IF NOT EXISTS follow_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                requester_id INT NOT NULL,
                requested_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (requested_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_request (requester_id, requested_id),
                INDEX idx_requester (requester_id),
                INDEX idx_requested (requested_id)
            )",
            
            'forwarded_posts' => "CREATE TABLE IF NOT EXISTS forwarded_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                UNIQUE KEY unique_forward (user_id, post_id),
                INDEX idx_user_id (user_id),
                INDEX idx_post_id (post_id),
                INDEX idx_created_at (created_at)
            )",
            
            'likes' => "CREATE TABLE IF NOT EXISTS likes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                UNIQUE KEY unique_like (user_id, post_id),
                INDEX idx_post_id (post_id),
                INDEX idx_user_id (user_id)
            )",
            
            'comments' => "CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                username VARCHAR(50) NOT NULL,
                comment_text TEXT NOT NULL,
                likes_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                INDEX idx_post_id (post_id),
                INDEX idx_user_id (user_id)
            )",
            
            'stories' => "CREATE TABLE IF NOT EXISTS stories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                username VARCHAR(50) NOT NULL,
                type ENUM('image', 'video') DEFAULT 'image',
                url VARCHAR(255) NOT NULL,
                caption TEXT,
                views_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_expires_at (expires_at)
            )",
            
            'reels' => "CREATE TABLE IF NOT EXISTS reels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                username VARCHAR(50) NOT NULL,
                url VARCHAR(255) NOT NULL,
                caption TEXT,
                likes_count INT DEFAULT 0,
                comments_count INT DEFAULT 0,
                views_count INT DEFAULT 0,
                shares_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at)
            )",
            
            'messages' => "CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                message_text TEXT NOT NULL,
                message_type ENUM('text', 'image', 'video') DEFAULT 'text',
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_sender (sender_id),
                INDEX idx_receiver (receiver_id),
                INDEX idx_created_at (created_at)
            )",
            
            'conversations' => "CREATE TABLE IF NOT EXISTS conversations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user1_id INT NOT NULL,
                user2_id INT NOT NULL,
                last_message_id INT,
                last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_conversation (user1_id, user2_id),
                INDEX idx_last_message_at (last_message_at)
            )",
            
            'notifications' => "CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type ENUM('like', 'comment', 'follow', 'follow_request', 'follow_accept', 'message', 'mention', 'story_view') NOT NULL,
                from_user_id INT NOT NULL,
                from_username VARCHAR(50) NOT NULL,
                post_id INT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at),
                INDEX idx_is_read (is_read)
            )",
            
            'story_views' => "CREATE TABLE IF NOT EXISTS story_views (
                id INT AUTO_INCREMENT PRIMARY KEY,
                story_id INT NOT NULL,
                viewer_id INT NOT NULL,
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
                FOREIGN KEY (viewer_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY unique_story_view (story_id, viewer_id),
                INDEX idx_story_id (story_id),
                INDEX idx_viewer_id (viewer_id)
            )",
            
            'hashtags' => "CREATE TABLE IF NOT EXISTS hashtags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tag VARCHAR(100) UNIQUE NOT NULL,
                posts_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_tag (tag),
                INDEX idx_posts_count (posts_count)
            )",
            
            'post_hashtags' => "CREATE TABLE IF NOT EXISTS post_hashtags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                hashtag_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (hashtag_id) REFERENCES hashtags(id) ON DELETE CASCADE,
                UNIQUE KEY unique_post_hashtag (post_id, hashtag_id),
                INDEX idx_post_id (post_id),
                INDEX idx_hashtag_id (hashtag_id)
            )",
            
            'saved_posts' => "CREATE TABLE IF NOT EXISTS saved_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                UNIQUE KEY unique_saved_post (user_id, post_id),
                INDEX idx_user_id (user_id),
                INDEX idx_post_id (post_id)
            )",
            
            'query' => "CREATE TABLE IF NOT EXISTS query (
                id INT AUTO_INCREMENT PRIMARY KEY,
                query TEXT NOT NULL,
                email VARCHAR(100) NOT NULL,
                status ENUM('pending', 'resolved', 'closed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            )"
        ];
        
        try {
            // First, create database if it doesn't exist
            echo '<div class="info">🔧 Creating database if it doesn\'t exist...</div>';
            if (createDatabase()) {
                $success_messages[] = "Database '" . DB_NAME . "' created or already exists";
            } else {
                $errors[] = "Failed to create database";
            }
            
            // Connect to the database
            $conn = createConnection();
            echo '<div class="success">✅ Connected to database successfully!</div>';
            
            // Create tables
            echo '<div class="info">📊 Creating database tables...</div>';
            echo '<div class="progress"><div class="progress-bar" id="progressBar" style="width: 0%"></div></div>';
            
            $total_tables = count($tables);
            $created_count = 0;
            
            foreach ($tables as $table_name => $sql) {
                if ($conn->query($sql) === TRUE) {
                    $tables_created[] = $table_name;
                    $created_count++;
                    $progress = ($created_count / $total_tables) * 100;
                    echo "<script>document.getElementById('progressBar').style.width = '{$progress}%';</script>";
                    echo '<div class="success">✅ Table "' . $table_name . '" created successfully</div>';
                    flush();
                    usleep(200000); // Small delay for visual effect
                } else {
                    $errors[] = "Error creating table $table_name: " . $conn->error;
                }
            }
            
            if (count($tables_created) == $total_tables) {
                $installation_complete = true;
                $success_messages[] = "All " . $total_tables . " tables created successfully!";
            }
            
            $conn->close();
            
        } catch (Exception $e) {
            $errors[] = "Installation failed: " . $e->getMessage();
        }
        ?>
        
        <?php if (!empty($success_messages)): ?>
            <?php foreach ($success_messages as $message): ?>
                <div class="status success">✅ <?php echo $message; ?></div>
            <?php endforeach; ?>
        <?php endif; ?>
        
        <?php if (!empty($errors)): ?>
            <?php foreach ($errors as $error): ?>
                <div class="status error">❌ <?php echo $error; ?></div>
            <?php endforeach; ?>
        <?php endif; ?>
        
        <?php if ($installation_complete): ?>
            <div class="status success">
                🎉 <strong>Installation Complete!</strong><br>
                Your Social Media App database has been set up successfully with <?php echo count($tables_created); ?> tables.
            </div>
            
            <div class="table-list">
                <h3>📋 Created Tables:</h3>
                <?php foreach ($tables_created as $table): ?>
                    <div class="table-item">✅ <?php echo $table; ?></div>
                <?php endforeach; ?>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="index.php" class="btn">🚀 Go to Login Page</a>
                <a href="homepage.php" class="btn">🏠 Go to Homepage</a>
            </div>
            
            <div class="info" style="margin-top: 20px;">
                <strong>Next Steps:</strong><br>
                1. Register a new account or login with existing credentials<br>
                2. Start creating posts and connecting with friends<br>
                3. Explore all the Instagram-like features!
            </div>
            
        <?php else: ?>
            <div class="status error">
                ❌ <strong>Installation Failed!</strong><br>
                Please check the errors above and try again.
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href="install.php" class="btn">🔄 Retry Installation</a>
            </div>
        <?php endif; ?>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666;">
            <small>Social Media App v1.0 - Database Installation Script</small>
        </div>
    </div>
    
    <script>
        // Auto-scroll to bottom during installation
        window.scrollTo(0, document.body.scrollHeight);
    </script>
</body>
</html>