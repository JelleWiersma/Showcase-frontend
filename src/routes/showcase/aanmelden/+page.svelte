<svelte:head>
	<title>Aanmelden</title>
	<script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>

<script>
// @ts-nocheck

    import { enhance } from '$app/forms';
    import { sendRequest } from '$lib/utils';
	import DOMPurify from 'dompurify';
	import { onMount, afterUpdate } from 'svelte';

	// Form variables
	let canSubmit = false;
	let isValidName = false;
	let isValidEmail = false;
	let isValidPassword = false;
	let captcha;
	let token;
	let rerenderCaptcha = false;
	let isValidCaptcha = false;
	const hCaptchaSiteKey = import.meta.env.MODE === 'production' ? import.meta.env.VITE_HCAPTCHA_SITE_KEY : import.meta.env.VITE_HCAPTCHA_TEST_KEY;
	const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{12,}$/;
	
	//Page variables
	let showSpinner = false;
	let showConfirmation = false;
	let confirmationMessage;
	let showFailure = false;
	let failureMessage;
	

	function validateInput(event) {
		// prepare input
		const inputElement = event.target;
		inputElement.required = true;
		const value = inputElement.value.trim();
		
		// Validate input
		if (inputElement.name === 'name') {
			isValidName = value.length >= 1 && value.length <= 60;
		} else if (inputElement.name === 'email') {
			isValidEmail = value.length >= 1 && value.length <= 80 && emailReg.test(value);
		} else if (inputElement.name === 'password') {
			isValidPassword = value.length >= 12 && value.length <= 128 && passwordReg.test(value);
		}
		// Update submit button
		canSubmit = isValidName && isValidEmail && isValidPassword && isValidCaptcha;
	}

	onMount(async () => {
		if (typeof window !== 'undefined') {
			// Callback function for successfull captcha
			window.handleCaptcha = function(response) {
				token = response;
				isValidCaptcha = true;
				canSubmit = isValidName && isValidEmail && isValidPassword && isValidCaptcha;
			};

			// Callback function for expired captcha
			window.handleCaptchaExpired = function() {
				isValidCaptcha = false;
				canSubmit = false;
			};

			//render captcha if the script is already loaded
			captcha = hcaptcha.render('hcaptcha', {
				'sitekey': hCaptchaSiteKey,
				'callback': 'handleCaptcha',
				'expired-callback': 'handleCaptchaExpired'
			});
			
		}
	});

	afterUpdate(() => {
		// Rerender captcha when the form has been submitted
		if (typeof window !== 'undefined') {
			if (rerenderCaptcha) {
				hcaptcha.render('hcaptcha', {
					'sitekey': hCaptchaSiteKey,
					'callback': 'handleCaptcha',
					'expired-callback': 'handleCaptchaExpired'
				});
				rerenderCaptcha = false;
			}
		}
	});

	async function onSubmit(event) {
		event.preventDefault();
        showSpinner = true;
		// Get the form
		const form = event.target;
		
		// Prepare data
		const data = {
			Email: DOMPurify.sanitize(form.email.value),
			Username: DOMPurify.sanitize(form.name.value),
			Password: form.password.value,
			HcaptchaToken: token
		};

	    // Send a POST request
		const response = await sendRequest('/account/register', "POST", data);
		
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
		isValidEmail = false;
		isValidPassword = false;
		isValidCaptcha = false;
		showSpinner = false;
		rerenderCaptcha = true;
	}
</script>

<div class="content">
	{#if showSpinner}
		<div class="spinner"></div>
	{:else}
		<span class="title-text">Account aanmaken</span>
		<p style="margin: 0px">
			Om spelers te onderscheiden en je spelstatistieken te kunnen inzien, is het nodig een account te maken. Je data wordt alleen voor deze website gebruikt, en niet met externe partijen gedeeld.<br><br>
		</p>
		<div class="horizontal-line"></div>
		<form method="POST"
			on:submit={onSubmit}>
			<section class="nice-form-group input-field ">
				<label for="name">Naam</label>
				<input type="text" id="name" name="name" placeholder="Gebruikersnaam" on:input={validateInput} maxlength="60" autocomplete="off">
				<div class="validation-message">Dit veld is verplicht</div>
			</section>
			<section class="nice-form-group input-field">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" placeholder="Jou email-adres" on:input={validateInput} pattern="{emailReg.source}" maxlength="80">
				<div class="validation-message">Voer een geldig email adres in</div>
			</section>
			<section class="nice-form-group input-field">
				<label for="password">Wachtwoord</label>
				<input type="password" id="password" name="password" placeholder="Wachtwoord" on:input={validateInput} pattern="{passwordReg.source}" maxlength="128" autocomplete="current-password">
				<div class="validation-message">Wachtwoord moet tenminste 12 karakters, één hoofdletter, één kleine letter en één cijfer bevatten</div>
			</section>
			<div id="hcaptcha"></div>
			<button type="submit" disabled={!canSubmit}>Registeren</button>
		</form>

		{#if showConfirmation}
			<div class="confirmation-message" bind:this={confirmationMessage}>
				Je account is succesvol aangemaakt. Check je email voor een bevestigingslink.
				<button class="close-button" on:click={() => { confirmationMessage.style.display = 'none'; showConfirmation = false }}>X</button>
			</div>
		{:else if showFailure}
			<div class="failure-message" bind:this={failureMessage}>
				Je account kon niet aangemaakt worden. Probeer het later opnieuw.
				<button class="close-button" on:click={() => { failureMessage.style.display = 'none'; showFailure = false }}>X</button>
			</div> 
		{/if}
	{/if}
</div>

<style>
	.input-field {
		display: flex;
		flex-direction: column;
		width: 80%;
		margin-top: 0;
		margin-bottom: 10px;
	}

	form label {
		align-self: flex-start;
	}

	.validation-message {
        display: none;
        color: var(--color-error);
		margin-top: 2px;
    }

    input:invalid + .validation-message {
        display: block;
    }

	input {
		box-sizing: border-box;
	}
</style>