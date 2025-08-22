<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Status - Social Media App</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 1000px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .status-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            border-left: 5px solid #28a745;
        }
        .error-card {
            border-left-color: #dc3545;
            background: #f8d7da;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .info-item {
            background: #e9ecef;
            padding: 15px;
            border-radius: 8px;
        }
        .table-list {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .table-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
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
        .btn-danger {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Database Status</h1>
        
        <?php
        require_once 'config/database_info.php';
        
        try {
            if (isDatabaseInstalled()) {
                $db_info = getDatabaseInfo();
                ?>
                
                <div class="status-card">
                    <h3>✅ Database Status: Connected & Ready</h3>
                    <p>Your Social Media App database is properly installed and running.</p>
                </div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <strong>🏠 Host:</strong><br>
                        <?php echo $db_info['host']; ?>
                    </div>
                    <div class="info-item">
                        <strong>🗄️ Database:</strong><br>
                        <?php echo $db_info['database']; ?>
                    </div>
                    <div class="info-item">
                        <strong>📋 Total Tables:</strong><br>
                        <?php echo count($db_info['tables']); ?>
                    </div>
                    <div class="info-item">
                        <strong>📊 Total Records:</strong><br>
                        <?php echo number_format($db_info['total_records']); ?>
                    </div>
                </div>
                
                <div class="table-list">
                    <h3>📋 Database Tables</h3>
                    <?php foreach ($db_info['tables'] as $table => $count): ?>
                        <div class="table-item">
                            <span><strong><?php echo $table; ?></strong></span>
                            <span><?php echo number_format($count); ?> records</span>
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <div style="text-align: center;">
                    <a href="index.php" class="btn">🚀 Go to App</a>
                    <a href="install.php" class="btn">🔄 Reinstall Database</a>
                    <a href="?action=clean" class="btn btn-danger" onclick="return confirm('Are you sure? This will delete ALL data!')">🗑️ Clean Database</a>
                </div>
                
                <?php
            } else {
                ?>
                <div class="status-card error-card">
                    <h3>❌ Database Status: Not Installed</h3>
                    <p>The database is not properly installed. Please run the installation script.</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="install.php" class="btn">🔧 Install Database</a>
                </div>
                <?php
            }
            
            // Handle clean database action
            if (isset($_GET['action']) && $_GET['action'] == 'clean') {
                if (cleanDatabase()) {
                    echo '<div class="status-card"><h3>✅ Database Cleaned</h3><p>All tables have been removed. Please reinstall the database.</p></div>';
                    echo '<div style="text-align: center;"><a href="install.php" class="btn">🔧 Reinstall Database</a></div>';
                } else {
                    echo '<div class="status-card error-card"><h3>❌ Failed to Clean Database</h3><p>There was an error cleaning the database.</p></div>';
                }
            }
            
        } catch (Exception $e) {
            ?>
            <div class="status-card error-card">
                <h3>❌ Database Error</h3>
                <p><?php echo $e->getMessage(); ?></p>
            </div>
            
            <div style="text-align: center;">
                <a href="install.php" class="btn">🔧 Install Database</a>
            </div>
            <?php
        }
        ?>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666;">
            <small>Social Media App v1.0 - Database Status Page</small>
        </div>
    </div>
</body>
</html>