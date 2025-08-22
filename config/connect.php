<?php
// Include database configuration
require_once 'database_config.php';

// Create connection using the configuration
$conn = createConnection();

// Set charset to utf8
$conn->set_charset("utf8");
?>