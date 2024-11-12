<script>
    // @ts-nocheck
 	export let form;
    import { user } from "$lib/store";
    if($user){
        $user.loggedIn = false;
    }
    

    let canSubmit = false;
    let isValidEmail = false;
    let isValidPassword = false;
    let showFailure = false;
    let failureNotification;
    let failureMessage;
    let showTwoFactor = false;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateInput(event) {
        // prepare input
        const inputElement = event.target;
        inputElement.required = true;
        const value = inputElement.value.trim();
        
        // Check if the email is already filled in
        if(form?.email){
            isValidEmail = true;
        }

        // Validate input
        if (inputElement.name === 'email') {
            isValidEmail = value.length >= 1 && value.length <= 80 && emailReg.test(value);
        } else if (inputElement.name === 'password') {
            isValidPassword = value.length >= 1 && value.length <= 126;
        }
        // Update submit button
        canSubmit = isValidEmail && isValidPassword;
    }

    if(form){
        // Check if the user is not allowed or requires two factor authentication
        if (form.TwoFactorRequired) {
            showTwoFactor = true;
            canSubmit = false;
        } else if(form.TooManyAttempts) {
            // Tell the user they have tried too many times  without revealing if the email is correct.
            failureMessage = "Je hebt te vaak proberen in te loggen op dit mailadres. Probeer het over 5 minuten nog eens.";
            showFailure = true;
        } else {
            // Display a message to the user
            failureMessage = "Kon niet inloggen. Check je email adres en wachtwoord en probeer opnieuw.";
            showFailure = true;
        }
        
    }
</script>

<svelte:head>
    <title>Inloggen</title>
</svelte:head>

<div class="content">
    <span class="title-text">Inloggen</span>
    <div class="horizontal-line"></div>
    <form method="POST">
        <section class="nice-form-group input-field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email adres" on:input={validateInput} pattern="{emailReg.source}" maxlength="80" value={form?.email? form.email : ''}>
            <div class="validation-message">Vul een geldig email adres in</div>
        </section>
        <section class="nice-form-group input-field">
            <label for="password">Wachtwoord</label>
            <input type="password" id="password" name="password" placeholder="Wachtwoord" on:input={validateInput} maxlength="128" autocomplete="current-password" value={form?.password? form.password : ''}>
        </section>
        <section class="nice-form-group input-field" style="flex-direction: row;">
            <input type="checkbox" id="show-password" onclick="document.getElementById('password').type = this.checked ? 'text' : 'password'"><label for="show-password">Wachtwoord tonen</label>
        </section>
        <section class="nice-form-group input-field" style="flex-direction: row;">
            <input type="checkbox" id="rememberMe" name="rememberMe" value={form?.rememberMe? form.rememberMe.toString() : "false"}><label for="rememberMe">Deze computer onthouden</label>
        </section>
        {#if showTwoFactor}
            <div class="mfa-popup">
                <div class="mfa-div">
                    <section class="nice-form-group input-field">
                        <h3 style="margin: 0">Two factor authenticatie</h3>
                        <p style="white-space: normal">Voer de code in die je hebt ontvangen in je mailbox.</p>
                        <input type="text" id="twoFactorCode" name="twoFactorCode" placeholder="Inlogcode" on:input={() => canSubmit = true} maxlength="6">
                        <button type="submit" disabled={!canSubmit}>Inloggen</button>
                    </section>
                </div>
            </div>
        {/if}
        <button type="submit" disabled={!canSubmit}>Inloggen</button>
    </form>
    <a href="/showcase/aanmelden">Account maken</a>
    <a href="/showcase/wachtwoord-vergeten">Wachtwoord vergeten</a>

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
    
    .mfa-div {
        background-color: var(--color-bg-0);
        border-radius: 5px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }

    .mfa-popup {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    
</style>
