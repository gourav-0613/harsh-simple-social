<?php
// Database Information and Helper Functions
require_once 'database_config.php';

// Get database information
function getDatabaseInfo() {
    $conn = createConnection();
    
    $info = [
        'host' => DB_HOST,
        'database' => DB_NAME,
        'username' => DB_USERNAME,
        'tables' => [],
        'total_records' => 0
    ];
    
    // Get all tables
    $result = $conn->query("SHOW TABLES");
    while ($row = $result->fetch_array()) {
        $table_name = $row[0];
        
        // Get record count for each table
        $count_result = $conn->query("SELECT COUNT(*) as count FROM $table_name");
        $count = $count_result->fetch_assoc()['count'];
        
        $info['tables'][$table_name] = $count;
        $info['total_records'] += $count;
    }
    
    $conn->close();
    return $info;
}

// Check if database is properly installed
function isDatabaseInstalled() {
    try {
        $conn = createConnection();
        
        // Check if main tables exist
        $required_tables = ['users', 'posts', 'follows', 'likes', 'comments', 'notifications'];
        
        foreach ($required_tables as $table) {
            $result = $conn->query("SHOW TABLES LIKE '$table'");
            if ($result->num_rows == 0) {
                return false;
            }
        }
        
        $conn->close();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// Get table structure
function getTableStructure($table_name) {
    $conn = createConnection();
    $result = $conn->query("DESCRIBE $table_name");
    
    $structure = [];
    while ($row = $result->fetch_assoc()) {
        $structure[] = $row;
    }
    
    $conn->close();
    return $structure;
}

// Clean database (for testing purposes)
function cleanDatabase() {
    $conn = createConnection();
    
    // Disable foreign key checks
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");
    
    // Get all tables
    $result = $conn->query("SHOW TABLES");
    $tables = [];
    while ($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
    
    // Drop all tables
    foreach ($tables as $table) {
        $conn->query("DROP TABLE IF EXISTS $table");
    }
    
    // Re-enable foreign key checks
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");
    
    $conn->close();
    return true;
}
?>