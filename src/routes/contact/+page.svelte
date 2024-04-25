<svelte:head>
	<title>Contact</title>
	<meta name="description" content="Contact form" />
</svelte:head>

<div class="content">
    <span class="title-text">Stuur een bericht</span>
	<p style="margin: 0px">
		Laat een bericht achter voor Jelle Wiersma, en ik zal indien nodig binnen één werkweek een reactie sturen. Je gegevens worden gebruikt om reactie mogelijk te maken, en worden niet opgeslagen.<br><br>
	</p>
	<div class="horizontal-line"></div>

	{#if !showSpinner}
		<form on:submit={onSubmit}>
			<div class="names-div">
				<div class="nice-form-group input-field ">
					<label for="name">Naam</label>
					<input type="text" id="name" name="name" placeholder="Voornaam" on:input={validateInput} maxlength="60" autocomplete="given-name">
					<div class="validation-message">Dit veld is verplicht</div>
				</div>
				
				<div class="nice-form-group input-field">
					<label for="surname">Achternaam</label>
					<input type="text" id="surname" name="surname" placeholder="Achternaam" on:input={validateInput} maxlength="60" autocomplete="family-name">
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
				<input type="text" id="subject" name="subject" on:input={validateInput} maxlength="100" autocomplete="off">
				<div class="validation-message">Dit veld is verplicht</div>
			</div>

			<div class="nice-form-group input-field-primary">
				<label for="message">Bericht</label>
				<textarea id="message" name="message" on:input={validateInput} maxlength="2000"></textarea>
				<div class="validation-message">Dit veld is verplicht</div>
			</div>
			<div class="g-recaptcha" id="recaptcha"></div>
			<button type="submit" 
					disabled={!canSubmit}>Verstuur</button>
		</form>
	{:else}
		<div class="spinner"></div>
	{/if}

	{#if showConfirmation}
		<div class="confirmation-message" bind:this={confirmationMessage}>
			Je bericht is succesvol verzonden.
			<button class="close-button" on:click={() => { confirmationMessage.style.display = 'none'; showConfirmation = false }}>X</button>
		</div>
	{:else if showFailure}
		<div class="failure-message" bind:this={failureMessage}>
			Bericht kon niet worden verzonden. Probeer het later opnieuw.
			<button class="close-button" on:click={() => { failureMessage.style.display = 'none'; showFailure = false }}>X</button>
		</div> 
	{/if}
</div>

<script>
// @ts-nocheck
	import { onMount, afterUpdate } from 'svelte';
	import DOMPurify from 'dompurify';
	
	// Form variables
	let canSubmit = false;
	let isValidName = false;
	let isValidSurname = false;
	let isValidEmail = false;
	let isValidPhone = false;
	let isValidSubject = false;
	let isValidMessage = false;
	let isValidRecaptcha = false;
	const phoneReg = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/;
	const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	//Recaptcha variables
	const recaptchaSiteKey = import.meta.env.MODE === 'production' ? import.meta.env.VITE_RECAPTCHA_SITE_KEY : import.meta.env.VITE_RECAPTCHA_TEST_KEY;
	let recaptcha;
	let token;
	let rerenderCaptcha = false;
	
	//Page variables
	let showSpinner = false;
	let showConfirmation = false;
	let confirmationMessage;
	let showFailure = false;
	let failureMessage;

	//Render Recaptcha
	onMount(async () => {
		if (typeof window !== 'undefined') {
			// render recaptcha when the scipt is loaded
			window.recaptchaCallback = function() {
				recaptcha = grecaptcha.render('recaptcha', {
					'sitekey': recaptchaSiteKey,
					'callback': 'handleCaptcha',
					'expired-callback': 'handleCaptchaExpired'
				});
			};
			
			// Callback function for successfull recaptcha
			window.handleCaptcha = function(response) {
				token = response;
				isValidRecaptcha = true;
				canSubmit = isValidName && isValidSurname && isValidEmail && isValidPhone && isValidSubject && isValidMessage && isValidRecaptcha;
			};

			// Callback function for expired recaptcha
			window.handleCaptchaExpired = function() {
				isValidRecaptcha = false;
				canSubmit = false;
			};

			// Load recaptcha script
			if(document.querySelector('script[src="https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit"]') === null){
				const script = document.createElement('script');
				script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit';
				script.async = true;
				script.defer = true;
				document.body.appendChild(script);
			} else {
				//render recaptcha if the script is already loaded
				recaptcha = grecaptcha.render('recaptcha', {
					'sitekey': recaptchaSiteKey,
					'callback': 'handleCaptcha',
					'expired-callback': 'handleCaptchaExpired'
				});
			}
			
		}
	});

	afterUpdate(() => {
		// Rerender recaptcha when the form has been submitted
		if (typeof window !== 'undefined') {
			if (rerenderCaptcha) {
				grecaptcha.render('recaptcha', {
					'sitekey': recaptchaSiteKey,
					'callback': 'handleCaptcha',
					'expired-callback': 'handleCaptchaExpired'
				});
				rerenderCaptcha = false;
			}
		}
	});
	
	function validateInput(event) {
		// prepare input
		const inputElement = event.target;
		inputElement.required = true;
		const value = DOMPurify.sanitize(inputElement.value.trim());
		
        
		// Validate input
		if (inputElement.name === 'name') {
			isValidName = value.length >= 1 && value.length <= 60;
		} else if (inputElement.name === 'surname') {
			isValidSurname = value.length >= 1 && value.length <= 60;
		} else if (inputElement.name === 'email') {
			isValidEmail = value.length >= 1 && value.length <= 80 && emailReg.test(value);
		} else if (inputElement.name === 'phone') {
			isValidPhone = value.length >= 1 && value.length <= 20 && phoneReg.test(value);
		} else if (inputElement.name === 'subject') {
			isValidSubject = value.length >= 1 && value.length <= 100;
		} else if (inputElement.name === 'message') {
			isValidMessage = value.length >= 1 && value.length <= 2000;
		}

		// Update submit button
		canSubmit = isValidName && isValidSurname && isValidEmail && isValidPhone && isValidSubject && isValidMessage && isValidRecaptcha;
	}
	
	async function onSubmit(event) {
		event.preventDefault();
        showSpinner = true;
		// Get the form
		const form = event.target;
		
		// Prepare data
		const data = {
			name: form.name.value,
			surname: form.surname.value,
			email: form.email.value,
			phone: form.phone.value,
			subject: form.subject.value,
			message: form.message.value,
			recaptchaToken: token
		};
	    // Send a POST request
		const response = await fetch('/contact', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
    	});
		
		if (response.ok) {
			showFailure = false;
			showConfirmation = true;
		} else {
			showConfirmation = false;
			showFailure = true;
		}

		reset();
    }

	function reset() {
		canSubmit = false;
		isValidName = false;
		isValidSurname = false;
		isValidEmail = false;
		isValidPhone = false;
		isValidSubject = false;
		isValidMessage = false;
		isValidRecaptcha = false;
		rerenderCaptcha = true;
		grecaptcha.reset(recaptcha);
		showSpinner = false;
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
        color: var(--color-error);
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