<script>
    import { user } from "$lib/store";

    let message = "";
    async function sendRequest() {
        const response = await fetch("/api/sendrequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                endpoint: "status/loggedin",
                method: "GET"
             }),
        });
        console.log(response);
        if (response.ok) {
            message = "client side request is logged in";
        } else {
            message = "Failed to send request";
        }
    }
    
</script>
You are loggin in with a valid token
{#if $user.loggedIn}
    <p>Logged in as {$user.username}</p>
{/if}
<button on:click={sendRequest}>Send client side request</button>
<br>
<p>{message}</p>


