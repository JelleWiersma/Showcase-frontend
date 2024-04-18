<svelte:head>
	<title>Contact</title>
	<meta name="description" content="Contact form" />
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<div class="content">
    <span class="title-text">Stuur een bericht</span>
	<p style="margin: 0px">
		Laat een bericht achter voor Jelle Wiersma, en ik zal indien nodig binnen één werkweek een reactie sturen. Je gegevens worden gebruikt om reactie mogelijk te maken, en worden niet opgeslagen<br><br>
	</p>
	<div class="horizontal-line"></div>

	<form action="" method="POST">
		<div class="names-div">
			<div class="nice-form-group input-field ">
				<label for="name">Naam</label>
				<input type="text" id="name" name="name" placeholder="Voornaam" on:input={validateInput} maxlength="60">
				<div class="validation-message">Dit veld is verplicht</div>
			</div>
			
			<div class="nice-form-group input-field">
				<label for="surname">Achternaam</label>
				<input type="text" id="surname" name="surname" placeholder="Achternaam" on:input={validateInput} maxlength="60">
				<div class="validation-message">Dit veld is verplicht</div>
			</div>
		</div>
		
		<div class="nice-form-group input-field">
			<label for="email">Email</label>
			<input type="email" id="email" name="email" placeholder="Jou email-adres" on:input={validateInput} pattern="{emailReg.source}" maxlength="80">
			<div class="validation-message">Voer een geldig email adres in</div>
		</div>

		<div class="nice-form-group input-field">
			<label for="phone">Telefoonnummer</label>
			<input type="tel" id="phone" name="phone" placeholder="0687654321" on:input={validateInput} pattern={phoneReg.source} maxlength="20">
			<div class="validation-message">Voer een geldig telefoonnummer in</div>
		</div>
		
		<div class="horizontal-line"></div>

		<div class="nice-form-group input-field-primary">
			<label for="subject">Onderwerp</label>
			<input type="text" id="subject" name="subject" on:input={validateInput} maxlength="100">
			<div class="validation-message">Dit veld is verplicht</div>
		</div>

		<div class="nice-form-group input-field-primary">
			<label for="message">Bericht</label>
			<textarea id="message" name="message" on:input={validateInput} maxlength="2000"></textarea>
			<div class="validation-message">Dit veld is verplicht</div>
		</div>
		<div class="g-recaptcha" data-sitekey="6LdFTL8pAAAAAIn0P8ewm45eq55bH4WvhFfbzE2S"></div>
		<button type="submit" 
				disabled={!isValid} 
				on:submit|preventDefault={onSubmit}>Verstuur</button>
	</form>

</div>

<script>
// @ts-nocheck

	
	let isValid = false;
	let isValidName = false;
	let isValidSurname = false;
	let isValidEmail = false;
	let isValidPhone = false;
	let isValidSubject = false;
	let isValidMessage = false;

	const phoneReg = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/;
	const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	function validateInput(event) {
		// Get input element that triggered the event
		const inputElement = event.target;
		inputElement.required = true;
		// Validate input
		if (inputElement.name === 'name') {
			isValidName = inputElement.value.trim() !== '';
		} else if (inputElement.name === 'surname') {
			isValidSurname = inputElement.value.trim() !== '';
		} else if (inputElement.name === 'email') {
			isValidEmail = emailReg.test(inputElement.value.trim());
		} else if (inputElement.name === 'phone') {
			isValidPhone = phoneReg.test(inputElement.value.trim());
		} else if (inputElement.name === 'subject') {
			isValidSubject = inputElement.value.trim() !== '';
		} else if (inputElement.name === 'message') {
			isValidMessage = inputElement.value.trim() !== '';
		}

		// Set validity state
		isValid = isValidName && isValidSurname && isValidEmail && isValidPhone && isValidSubject && isValidMessage;
	}
	
	function onSubmit(event) {
		grecaptcha.ready(function(){
			grecaptcha.execute('6LdFTL8pAAAAAIn0P8ewm45eq55bH4WvhFfbzE2S', {action: 'submit'}).then(function(token) {
				console.log(token);
			});
		});
	}
</script>

<style>
	
	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		align-self: center;
		width: 100%;
	}
	
	.input-field {
		display: flex;
		flex-direction: column;
		width: 80%;
		margin-top: 0;
	}
	
	.names-div {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		width: 80%;
	}

	.names-div .input-field {
		flex: 1;
		width: 50%;
	}

	form label {
		align-self: flex-start;
	}

	.input-field-primary {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-top: 0;
	}

	form textarea {
		resize: none;
		min-height: 200px;
	}

	form button {
		align-self: flex-end;
	}

	form input, textarea {
		box-sizing: border-box;
	}

	.validation-message {
        display: none;
        color: red;
		margin-top: 2px;
    }

    input:invalid + .validation-message {
        display: block;
    }

	.g-recaptcha {
        display: flex;
        align-self: end;
    }
</style>