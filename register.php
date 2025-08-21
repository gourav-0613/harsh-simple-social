<?php 

include ('config/connect.php');
include ('config/auth.php');

// sign up
if(isset($_POST['signUp'])){
    $firstName=$_POST['fName'];
    $lastName=$_POST['lName'];
    $username=$_POST['username'];
    $email=$_POST['email'];
    $password=$_POST['password'];
    $password=md5($password);

     $checkEmail="SELECT * From users where email='$email' OR username='$username'";
     $result=$conn->query($checkEmail);
     if($result->num_rows>0){
        echo "Email or Username Already Exists !";
     }
     else{
        $insertQuery="INSERT INTO users(firstName,lastName,username,email,password)
                       VALUES ('$firstName','$lastName','$username','$email','$password')";
            if($conn->query($insertQuery)==TRUE){
                header("location: index.php");
            }
            else{
                echo "Error:".$conn->error;
            }
     }
}


//sign in 
if(isset($_POST['signIn'])){
   $email=$_POST['email'];
   $password=$_POST['password'];
   $password=md5($password) ;
   
   $sql="SELECT * FROM users WHERE (email='$email' OR username='$email') and password='$password'";
   $result=$conn->query($sql);
   if($result->num_rows>0){
    session_start();
    $row=$result->fetch_assoc();
    $_SESSION['user_id']=$row['id'];
    $_SESSION['username']=$row['username'];
    $_SESSION['email']=$row['email'];
    header("Location: homepage.php");
    exit();
   }
   else{
    echo "Not Found, Incorrect Email/Username or Password";
   }

}
?>