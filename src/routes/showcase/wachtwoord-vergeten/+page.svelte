<script>
    // @ts-nocheck
    import { user } from "$lib/store";
    import { onMount, afterUpdate } from "svelte";
    import { goto } from "$app/navigation";
    import { sendRequest } from "$lib/utils";

    if($user){
        $user.LoggedIn = false;
    }

    let canSubmit = false;
    let isValidEmail = false;
    let showFailure = false;
    let failureNotification;
    let failureMessage;
    let isValidRecaptcha = false;
    let showSpinner = false;

    let rerenderCaptcha = false;
    let recaptcha;
    let token;
    

    const recaptchaSiteKey = import.meta.env.MODE === 'production' ? import.meta.env.VITE_RECAPTCHA_SITE_KEY : import.meta.env.VITE_RECAPTCHA_TEST_KEY;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
				canSubmit = isValidEmail && isValidRecaptcha;
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

    function validateInput(event) {
        // prepare input
        const inputElement = event.target;
        inputElement.required = true;
        const value = inputElement.value.trim();

        // Validate input
        if (inputElement.name === 'email') {
            isValidEmail = value.length >= 1 && value.length <= 80 && emailReg.test(value);
        }
        // Update submit button
        canSubmit = isValidEmail && isValidRecaptcha;
    }

    async function onSubmit(event) {
        event.preventDefault();
        if(!isValidEmail || !isValidRecaptcha) return;
        showSpinner = true;
        const email = event.target.email.value;
        const response = await sendRequest('account/forgot-password', 'POST', { Email: email, Token: token });
        if(response.ok){
            goto('/showcase?reset=confirm');
            showSpinner = false;
        } else {
            showFailure = true;
            failureMessage = 'Er is een fout opgetreden. Probeer het opnieuw.';
            event.target.reset();
            showSpinner = false;
            canSubmit = false;
        }
    }
</script>

<svelte:head>
    <title>Wachtwoord Vergeten</title>
</svelte:head>

<div class="content">
    {#if showSpinner}
        <div class="spinner"></div>
    {:else}
        <span class="title-text">Wachtwoord Resetten</span>
        <div class="horizontal-line"></div>
        <form method="POST" on:submit={onSubmit}>
            <section class="nice-form-group input-field">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Email adres" on:input={validateInput} pattern="{emailReg.source}" maxlength="80">
                <div class="validation-message">Vul een geldig email adres in</div>
            </section>
            <div class="g-recaptcha" id="recaptcha"></div><br>
            <button type="submit" disabled={!canSubmit}>Reset Wachtwoord</button>
        </form>
        
        <a href="/showcase/aanmelden">Account maken</a>
        <a href="/showcase/inloggen">Inloggen</a>
    {/if}

    {#if showFailure}
        <div class="failure-message" bind:this={failureNotification}>
            {failureMessage}
            <button class="close-button" on:click={() => { failureNotification.style.display = 'none'; showFailure = false }}>X</button>
        </div> 
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
