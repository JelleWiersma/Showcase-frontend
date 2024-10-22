<script>
    /**
     * @type {{ message: any; }}
     */
    export let form;

    import { user } from "$lib/store";
</script>
You are loggin in with a valid token
<form method="POST">
    <button type="submit">Check Status</button>
</form>
{#if form?.message}
    <p>{form.message}</p>
{/if}
{#if $user.loggedIn}
    <p>Logged in as {$user.username}</p>
{/if}
