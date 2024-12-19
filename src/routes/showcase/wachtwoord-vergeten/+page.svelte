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
    let isValidhcaptcha = false;
    let showSpinner = false;

    let rerenderCaptcha = false;
    let hcaptcha;
    let token;
    

    const hcaptchaSiteKey = import.meta.env.MODE === 'production' ? import.meta.env.VITE_HCAPTCHA_SITE_KEY : import.meta.env.VITE_HCAPTCHA_TEST_KEY;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    onMount(async () => {
		if (typeof window !== 'undefined') {
			// render captcha when the scipt is loaded
			
			
			// Callback function for successfull captcha
			window.handleCaptcha = function(response) {
				token = response;
				isValidhcaptcha = true;
				canSubmit = isValidName && isValidSurname && isValidEmail && isValidPhone && isValidSubject && isValidMessage && isValidhcaptcha;
			};

			// Callback function for expired captcha
			window.handleCaptchaExpired = function() {
				isValidhcaptcha = false;
				canSubmit = false;
			};

			//render captcha if the script is already loaded
			hCaptcha = hcaptcha.render('hcaptcha', {
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
        canSubmit = isValidEmail && isValidhcaptcha;
    }

    async function onSubmit(event) {
        event.preventDefault();
        if(!isValidEmail || !isValidhcaptcha) return;
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
            rerenderCaptcha = true;
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
            <div id="hcaptcha"></div><br>
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
