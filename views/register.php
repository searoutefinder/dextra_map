<?php include('_header.php'); ?>

<!-- show registration form, but only if we didn't submit already -->
<div id="register-wrapper">
<?php if (!$registration->registration_successful && !$registration->verification_successful) {?>
	<form class="form register-form" method="post" action="register.php" name="registerform">
		<legend><?php echo WORDING_REGISTER;?> - Dextra Mapping</span></legend>            
		<div class="body">
			<label for="user_name"><?php echo WORDING_REGISTRATION_USERNAME; ?></label>
			<input id="user_name" type="text" pattern="[a-zA-Z0-9]{2,64}" class="form-control" name="user_name" required />

			<label for="user_email"><?php echo WORDING_REGISTRATION_EMAIL; ?></label>
			<input id="user_email" type="email" name="user_email" class="form-control" required />

			<label for="user_password_new"><?php echo WORDING_REGISTRATION_PASSWORD; ?></label>
			<input id="user_password_new" type="password" name="user_password_new" class="form-control" pattern=".{6,}" required autocomplete="off" />

			<label for="user_password_repeat"><?php echo WORDING_REGISTRATION_PASSWORD_REPEAT; ?></label>
			<input id="user_password_repeat" type="password" name="user_password_repeat" class="form-control" pattern=".{6,}" required autocomplete="off" />

			<img src="tools/showCaptcha.php" alt="captcha" />

			<label><?php echo WORDING_REGISTRATION_CAPTCHA; ?></label>
			<input type="text" name="captcha" class="form-control" required />
		</div>			
		<div class="footer">
            <input type="submit" name="register" class="btn btn-success" value="<?php echo WORDING_REGISTER; ?>" />			
		</div>            
	</form>
	<?php }else if($registration->registration_successful){ ?>
	    <p><?php echo MESSAGE_VERIFICATION_MAIL_SENT; ?></p>
	<?php }else if($registration->verification_successful){ ?>
	    <p><?php echo MESSAGE_REGISTRATION_ACTIVATION_SUCCESSFUL;?></p>
	<?php }else if(!$registration->registration_successful){ ?>
	    <p><?php echo MESSAGE_REGISTRATION_FAILED;?></p>
	<?php } ?>
	<a href="index.php"><?php echo WORDING_BACK_TO_LOGIN; ?></a>
</div>	
	
	
<?php include('_footer.php'); ?>