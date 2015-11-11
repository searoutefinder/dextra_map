<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dextra Mapping</title>
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css"></link>
	<link href='//fonts.googleapis.com/css?family=Raleway' rel='stylesheet' type='text/css'>
    <style type="text/css">		
		body{
		    font-family: 'Raleway', sans-serif;
		}
		.body label{
		    display:block;
		}
		#login-wrapper, #register-wrapper, #forgot-wrapper {
		  -webkit-border-radius: 15px;
		  -moz-border-radius: 15px;
		  -ms-border-radius: 15px;
		  -o-border-radius: 15px;
		  border-radius: 15px;
		  -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
		  -moz-box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
		  box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
		  position: absolute;
		  top: 50%;
		  left: 50%;
		  display: block;
		  margin-top: -185px;
		  margin-left: -235px;
		  padding: 25px;
		  width: 420px;
		  height: 400px;
		  background: white;
		  text-align: center;
		}

		#register-wrapper{
		    top:30% !important;
			height:600px;		
		}
		#register-wrapper a, #forgot-wrapper a{
		    display:block;
			margin-top:10px;
		}
		
		#forgot-wrapper{
		    height:270px;
		}
		#forgot-wrapper .aux-controls{
		    margin-top:20px;
		}
		.login-form legend, .register-form legend {
		  margin-top: 5px;
		  margin-bottom: 30px;
		  padding-bottom: 25px;
		}

		.login-form .body, .register-form .body {
		  padding-bottom: 10px;
		  border-bottom: 1px solid #eeeeee;
		}

		.login-form .footer, .register-form .footer {
		  margin-top: 10px;
		}

		.login-form .footer .btn, .register-form .footer .btn {
		  -webkit-box-shadow: none;
		  -moz-box-shadow: none;
		  box-shadow: none;
		  margin-left: 15px;
		  padding: 7px 25px;
		  background-image: none;
		}
		
		.login-form .aux-controls{
		    margin-top:20px;
		}
        .login-form .footer a{
		    margin:10px;
		}
    </style>
</head>
<body>

<?php
// show potential errors / feedback (from login object)
$login_errors = array();
$messages = array();

if (isset($login)) {
    if ($login->errors) {
        foreach ($login->errors as $error) {
            array_push($login_errors, $error);
        }
    }
    if ($login->messages) {
        foreach ($login->messages as $message) {
            array_push($messages, $message);
        }
    }
}
?>

<?php
$reg_errors = array();
$reg_messages = array();
// show potential errors / feedback (from registration object)
if (isset($registration)) {
    if ($registration->errors) {
        foreach ($registration->errors as $error) {
            array_push($reg_errors, $error);
        }
    }
    if ($registration->messages) {
        foreach ($registration->messages as $message) {
            array_push($reg_messages, $message);
        }
    }
}
?>
