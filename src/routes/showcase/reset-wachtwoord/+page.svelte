<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { sendRequest } from '$lib/utils';

    let email = '';
    let resetCode = '';
    let newPassword = '';
    let confirmPassword = '';
    let showFailure = false;
    let failureMessage = '';
    let canSubmit = false;
    let newPassValidation;
    let confPassValidation;
    let isValidPassword = false;
    const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;


    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        email = urlParams.get('email') || '';
        resetCode = urlParams.get('token') || '';
        
        if (!email || !resetCode) {
            goto('/showcase?reset=failed');
        }
    });

    function validateInput(event) {
        // Check if passwords match
        const passwordsMatch = newPassword === confirmPassword;
        isValidPassword = newPassword.length >= 8 && newPassword.length <= 256 && passwordReg.test(newPassword);

        // Show validation message
        if(event.target.name === 'newPassword' && !isValidPassword) {
            newPassValidation.style.display = isValidPassword ? 'none' : 'block';
        } else if(event.target.name === 'confirmPassword') {
            confPassValidation.style.display = passwordsMatch ? 'none' : 'block';
        }
        // Update submit button
        canSubmit = passwordsMatch && isValidPassword;
    }
    
    async function handleSubmit(event) {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            showFailure = true;
            failureMessage = 'Wachtwoorden komen niet overeen';
            return;
        }

        const response = await sendRequest('/account/reset-password', 'POST', { Email: email, ResetCode: resetCode, NewPassword: newPassword });

        if (response.ok) {
            goto('/showcase?reset=success');
        } else {
            showFailure = true;
            failureMessage = 'Kon wachtwoord niet veranderen';
        }
    }
</script>

<div class="content">
    <span class="title-text">Wachtwoord Resetten</span>
    <div class="horizontal-line"></div>
    <form on:submit={handleSubmit}>
        <section class="nice-form-group input-field">
            <label for="newPassword">Nieuw wachtwoord</label>
            <input type="password" id="newPassword" name="newPassword" bind:value={newPassword} on:input={validateInput} maxlength="256" required>
            <div class="validation-message" bind:this={newPassValidation}>Wachtwoord moet tenminste 8 karakters, één hoofdletter, één kleine letter en één cijfer bevatten</div>
        </section>
        <section class="nice-form-group input-field">
            <label for="confirmPassword">Wachtwoord herhalen</label>
            <input type="password" id="confirmPassword" name="confirmPassword" bind:value={confirmPassword} on:input={validateInput} maxlength="256" required>
            <div class="validation-message" bind:this={confPassValidation}>Wachtwoorden moeten overeenkomen</div>
        </section>
        <button type="submit" disabled={!canSubmit}>Bevestigen</button>
    </form>
    {#if showFailure}
        <div class="failure-message">
            {failureMessage}
            <button class="close-button" on:click={() => { showFailure = false }}>X</button>
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

    input {
        box-sizing: border-box;
    }

    .validation-message {
        display: none;
        color: var(--color-error);
        margin-top: 2px;
    }
</style>