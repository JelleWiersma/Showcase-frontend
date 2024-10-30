<script>
    // @ts-nocheck
    export let form;
    import { user } from "$lib/store";
    if($user){
        $user.loggedIn = false;
    }

    let canSubmit = false;
    let isValidEmail = false;
    let showFailure = false;
    let failureNotification;
    let failureMessage;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        canSubmit = isValidEmail;
    }

    if(form?.errors){
        // Handle errors
        failureMessage = "Er is een fout opgetreden. Probeer het opnieuw.";
        showFailure = true;
        canSubmit = true;
    }
</script>

<div class="content">
    <span class="title-text">Wachtwoord Resetten</span>
    <div class="horizontal-line"></div>
    <form method="POST">
        <section class="nice-form-group input-field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email adres" on:input={validateInput} pattern="{emailReg.source}" maxlength="80" value={form?.email? form.email : ''}>
            <div class="validation-message">Vul een geldig email adres in</div>
        </section>
        <button type="submit" disabled={!canSubmit}>Reset Wachtwoord</button>
    </form>
    <a href="/showcase/aanmelden">Account maken</a>
    <a href="/showcase/inloggen">Inloggen</a>

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
