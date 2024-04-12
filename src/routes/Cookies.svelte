<script lang="ts">
    import { onMount } from 'svelte';

    let showCookieBanner: boolean = false;

    // Check if the user has accepted cookies before
    onMount(() => {
        const hasPermission: string | null = getCookie('cookiePermission');
        const isAccepted: boolean = hasPermission === 'true';
        if (!isAccepted) {
            showCookieBanner = true;
        }
    });

    function acceptCookies(): void {
        setCookie('cookiePermission', 'true', 365);
        showCookieBanner = false;
    }

    function getCookie(name: string): string | null {
        const cookies: string[] = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie: string = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }

    // Set a cookie with a name, value and expiration date in days
    function setCookie(name: string, value: string, days: number): void {
        const date: Date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires: string = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }
</script>

{#if showCookieBanner}
    <div class="cookie-banner">
        <p>Beste gebruiker,<br>
            Ik wil je toestemming vragen voor het gebruik van cookies op deze website, zoals vereist door de GDPR. Cookies helpen de browse-ervaring te verbeteren en deze website te optimaliseren.
            Door op "Accepteren" te klikken stem je in met het gebruik van alle cookies.</p>
        <button on:click={acceptCookies}>Accepteren</button>
    </div>
{/if}

<style>
    .cookie-banner {
        position: fixed;
        bottom: 0; 
        left: 0; 
        width: 100%; 
        background-color: var(--color-bg-1); 
        padding: 10px;
        display: flex;
        justify-content: center; 
        align-items: center;
        box-sizing: border-box;
    }
    
    .cookie-banner p {
        margin: 0px 10px 0px 0px;
    }

    .cookie-banner button {
        flex-shrink: 0; /* Prevents the button from shrinking */
    }
</style>