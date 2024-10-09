<script>
    // @ts-nocheck
    import DOMPurify from 'dompurify';

    let canSubmit = false;
    let isValidEmail = false;
    let isValidPassword = false;
    let showSpinner = false;
    let showFailure = false;
    let lastEmail = '';
    let failedAttempts = 0;
    let failureNotification;
    let failureMessage = "Kon niet inloggen. Check je email adres en wachtwoord en probeer opnieuw.";
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateInput(event) {
        // prepare input
        const inputElement = event.target;
        inputElement.required = true;
        const value = inputElement.value.trim();
        
        // Validate input
        if (inputElement.name === 'email') {
            isValidEmail = value.length >= 1 && value.length <= 80 && emailReg.test(value);
        } else if (inputElement.name === 'password') {
            isValidPassword = value.length >= 1 && value.length <= 256;
        }
        // Update submit button
        canSubmit = isValidEmail && isValidPassword;
    }

    async function onSubmit(event) {
        event.preventDefault();
        showSpinner = true;
        // Get the form
        const form = event.target;
        const email = DOMPurify.sanitize(form.email.value);
        lastEmail = email;
        // Prepare data
        const data = {
            Email: email,
            Password: form.password.value
        };
        // Send a POST request
        const response = await fetch('/showcase/inloggen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showFailure = false;
            failedAttempts = 0;
            //@TODO: 2FA
        } else {
            const errorResponse = await response.json();

            // Check if the user is not allowed or requires two factor authentication
            if (errorResponse.Errors && errorResponse.Errors.NotAllowed) {
                // Display a message to the user
                failureMessage = "Je account is geblokkeerd. Neem contact op met de beheerder.";
            } else if (errorResponse.Errors && errorResponse.Errors.RequiresTwoFactor) {
                // Handle two factor authentication
                // ...
            } else {
                failedAttempts++;
                if(failedAttempts >= 5 && lastEmail === email) {
                    // Tell the user they have tried too many times  without revealing if the email is correct.
                    failureMessage = "Je hebt te vaak proberen in te loggen op dit mailadres. Probeer een ander account of kom later terug.";
                    setTimeout(() => failedAttempts = 0, 1000*60*5);
                } else {
                    // Display a message to the user
                    failureMessage = "Kon niet inloggen. Check je email adres en wachtwoord en probeer opnieuw.";
                }
            }
            showFailure = true;
        }

        reset();
    }

    function reset() {
        canSubmit = false;
        isValidEmail = false;
        isValidPassword = false;
        showSpinner = false;
    }
</script>

<div class="content">
    {#if showSpinner}
        <div class="spinner"></div>
    {:else}
        <span class="title-text">Inloggen</span>
        <div class="horizontal-line"></div>
        <form method="POST" on:submit={onSubmit}>
            <section class="nice-form-group input-field">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Email adres" on:input={validateInput} pattern="{emailReg.source}" maxlength="80">
                <div class="validation-message">Vul een geldig email adres in</div>
            </section>
            <section class="nice-form-group input-field">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Wachtwoord" on:input={validateInput} maxlength="256" autocomplete="current-password">
            </section>
            <button type="submit" disabled={!canSubmit}>Login</button>
        </form>
        <a href="/showcase/aanmelden">Account maken</a>
        <a href="/showcase/wachtwoord-vergeten">Wachtwoord vergeten</a>

        {#if showFailure}
            <div class="failure-message" bind:this={failureNotification}>
                {failureMessage}
                <button class="close-button" on:click={() => { failureNotification.style.display = 'none'; showFailure = false }}>X</button>
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
