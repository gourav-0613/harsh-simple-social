<?php
// Simple test to verify search_users.php is working
include "config/connect.php";
include "config/auth.php";

// Test the search functionality
$test_query = "test"; // Change this to test with different search terms

echo "Testing search functionality with query: '$test_query'<br><br>";

// Simulate the GET request
$_GET['q'] = $test_query;

// Include the search_users.php file to test it
ob_start();
include "search_users.php";
$output = ob_get_clean();

echo "Response from search_users.php:<br>";
echo "<pre>" . htmlspecialchars($output) . "</pre>";

// Test database connection
echo "<br>Database connection test:<br>";
if ($conn) {
    echo "✓ Database connection successful<br>";
    
    // Test if users table exists
    $result = $conn->query("SHOW TABLES LIKE 'users'");
    if ($result->num_rows > 0) {
        echo "✓ Users table exists<br>";
        
        // Count total users
        $count_result = $conn->query("SELECT COUNT(*) as total FROM users");
        $total_users = $count_result->fetch_assoc()['total'];
        echo "✓ Total users in database: " . $total_users . "<br>";
    } else {
        echo "✗ Users table does not exist<br>";
    }
} else {
    echo "✗ Database connection failed<br>";
}
?>
