<?php require_once('translations/pt_BR.php'); ?>
<?php include('_header.php'); ?>

<div id="forgot-wrapper">
    <?php if ($login->passwordResetLinkIsValid() == true) { ?>
	<form class="form forgot-form" method="post" action="password_reset.php" name="new_password_form">
		<legend>Request a <span class="blue">password reset</span></legend>            
		<div class="body">
			<input type='hidden' name='user_name' value='<?php echo htmlspecialchars($_GET['user_name']); ?>' />
			<input type='hidden' class="form-control" name='user_password_reset_hash' value='<?php echo htmlspecialchars($_GET['verification_code']); ?>' />

			<label for="user_password_new"><?php echo WORDING_NEW_PASSWORD; ?></label>
			<input id="user_password_new" class="form-control" type="password" name="user_password_new" pattern=".{6,}" required autocomplete="off" />

			<label for="user_password_repeat"><?php echo WORDING_NEW_PASSWORD_REPEAT; ?></label>
			<input id="user_password_repeat" type="password" class="form-control" name="user_password_repeat" pattern=".{6,}" required autocomplete="off" />
		</div>
				
		<div class="footer">
            <div class="aux-controls">
			    <input type="submit" name="request_password_reset" class="btn btn-danger" value="<?php echo WORDING_RESET_PASSWORD; ?>" />
			</div>	
		</div>            
	</form>
	<?php } else { ?>
	<form class="form forgot-form" method="post" action="password_reset.php" name="new_password_form">
		<legend><?php echo WORDING_RESET_PASSWORD; ?></span></legend>            
		<div class="body">
			<form method="post" action="password_reset.php" name="password_reset_form">
				<label for="user_name"><?php echo WORDING_REQUEST_PASSWORD_RESET; ?></label>
				<input id="user_name" type="text" name="user_name" class="form-control" required />				
			</form>
		</div>
				
		<div class="footer">
		    <div class="aux-controls">
                <input type="submit" name="request_password_reset" class="btn btn-danger" value="<?php echo WORDING_RESET_PASSWORD; ?>" />
			</div>	
		</div>            
	</form>
	<?php } ?>	
	<a href="index.php"><?php echo WORDING_BACK_TO_LOGIN; ?></a>
</div>



<?php include('_footer.php'); ?>
