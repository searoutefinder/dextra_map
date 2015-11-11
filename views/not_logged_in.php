<?php include('_header.php'); ?>

<div id="login-wrapper">
	<form class="form login-form" method="post" action="index.php" name="loginform">
		<legend>Dextra Mapping</legend>            
		<div class="body">
			<label><?php echo WORDING_USERNAME; ?></label>
			<input type="text" class="form-control" id="user_name" name="user_name" required />                    
			<label><?php echo WORDING_PASSWORD; ?></label>
			<input class="form-control" id="user_password" type="password" name="user_password" autocomplete="off" required>
		</div>
				
		<div class="footer">
			<label class="checkbox-inline">
				<input type="checkbox" id="user_rememberme" name="user_rememberme" value="1"> <?php echo WORDING_REMEMBER_ME; ?>
			</label>                               
			<button type="submit" class="btn btn-success" name="login" value="<?php echo WORDING_LOGIN; ?>">Login</button>
			<div class="aux-controls">
			    <a href="register.php"><?php echo WORDING_REGISTER_NEW_ACCOUNT; ?></a>
                <a href="password_reset.php"><?php echo WORDING_FORGOT_MY_PASSWORD; ?></a>
			</div>	
		</div>            
	</form>
</div>

<?php include('_footer.php'); ?>
