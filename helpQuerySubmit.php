<?php
include('config/connect.php');

if (isset($_POST['submitQueryButton']) && $_POST['submitQueryButton'] == "true") {
    $result = $conn->query("insert into query(query, email) values (\"".$_POST['helpQuery']."\", \"".$_POST['helpEmail']."\")");
}

header("location: index.php");
?>