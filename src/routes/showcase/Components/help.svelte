{#if isOpen}
<div class="background" role="presentation" on:click={close}>
    <div class="card-background" role="presentation" on:click|stopPropagation transition:slide="{{duration: 500, easing: backIn, axis: 'y'}}">
        <button class="close-button" on:click={close}>X</button>
        <div class="card-content">
            <span class="title-text">Speluitleg</span>
            <p>Het kaartspel Zweeds Pesten wordt met 2-4 spelers gespeeld. Het spel begint door iedere speler 3 gesloten kaarten los op tafel te delen. Op iedere gesloten kaart wordt een open kaart gedeeld. Ook krijgt iedere speler drie kaarten in de hand, welke de speler voor zichzelf dient te houden. Voor het spel begint mag iedere speler één kaart uit de hand omruilen met een open kaart op tafel.</p>
            <img class="table-image" alt="table explanation" src={table_image} />
            <span><b>Spelverloop</b></span>
            <p>Gedurende het spel spelen de spelers om de beurt één of meerdere kaarten op de pot. Een kaart mag alleen gespeeld worden als de waarde van de kaart hoger of gelijk is aan de laatst gespeelde kaart, waar de 2 het laagst is, en de A het hoogst. Er zijn geen jokers. Kaarten met dezelfde waarde mogen tegelijk gespeeld worden.
                De speler die als eerst een 4 kan opleggen begint, als er geen 4 is de 5, enzovoort.</p>
            <p>Er zijn 4 pestkaarten, die altijd gespeeld mogen worden:</p>
            <ul>
                <li>De 2: Geen effect, is de laagste kaart mogelijk.</li>
                <li>De 3: Is 'doorzichtig', waardoor de kaart er onder telt voor de volgende speler.</li>
                <li>De 7: De volgende speler moet lager dan een 7 of pestkaart spelen.</li>
                <li>De 10: De kaarten in de pot verdwijnen uit het spel en de speler mag een nieuwe kaart opleggen naar keuze.</li>
            </ul>
            <div class="card-images">
                <img class="card-image" alt="two of clubs" src={two_of_clubs} />
                <img class="card-image" alt="three of diamonds" src={three_of_diamonds} />
                <img class="card-image" alt="seven of spades" src={seven_of_spades} />
                <img class="card-image" alt="ten of hearts" src={ten_of_hearts} />
            </div>
            <p>Naast de 10 gaan de kaarten in de pot ook weg als er 4 dezelfde kaarten achtereenvolgend op de pot liggen.</p>
            <p>Als een speler geen kaart(en) op kan leggen moet deze speler de gehele pot in de hand nemen, en is de volgende speler. Zolang er nog kaarten op de stapel liggen trekt iedere speler aan het eind van de beurt kaarten bij todat de speler 3 kaarten in de hand heeft.</p>
            <span><b>Einde</b></span>
            <p>Wanneer de stapel leeg is, moet iedere speler zijn hand leeg spelen. Daarna kan de speler de open kaarten op tafel spelen. Deze kaarten mogen ook met meerderen tegelijk, maar zijn niet te combineren met kaarten uit de hand. Als de speler niet kan moet een (of meerdere) gekozen kaart samen met de kaarten in de pot in de hand genomen worden. Na het wegspelen van de open kaarten moet de speler één gesloten kaart per beurt blind spelen.
                De speler die als laatst nog kaarten over heeft verliest het spel, de andere spelers winnen gezamenlijk.</p>
        </div>
    </div>
</div>
{/if}

<script>
    import { slide } from 'svelte/transition';
    import { backIn } from 'svelte/easing';
    import two_of_clubs from '$lib/images/cards/two_of_clubs.webp';
    import three_of_diamonds from '$lib/images/cards/three_of_diamonds.webp';
    import seven_of_spades from '$lib/images/cards/seven_of_spades.webp';
    import ten_of_hearts from '$lib/images/cards/ten_of_hearts.webp';
    // import table_image from 'https://placehold.co/500x150.png'
    let table_image = 'https://placehold.co/500x150.png'

    let isOpen = false;

    function open() {
        isOpen = true;
    }

    function close() {
        isOpen = false;
    }
    
    export { open, close, isOpen };
</script>

<style>
    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 5px;
        border: none;
        cursor: pointer;
        box-shadow: none;
        width: 2rem;
        height: 2rem;
        
    }

    .card-background {
        position: fixed;
        top: 40px;
        left: calc(50vw - 360px);
        width: 720px;
        height: calc(100svh - 80px);
        background-color: var(--color-bg-1);
        border-radius: 5px;
        z-index: 9999;
    }

    .card-content {
        display: flex;
        flex-direction: column;
        align-items: start;
        overflow-y: auto;
        padding: 3rem 2rem;
        box-sizing: border-box;
        height: 100%;
    }
    
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
    }

    .table-image {
        margin-bottom: 10px;
        align-self: center;
    }
    
    .card-image {
        width: 75px;
        height: 100px;
        margin-left: 10px;
    }

    .card-images {
        display: flex;
        justify-content: space-between;
        align-self: center;
        margin-bottom: 10px;
    }

    p {
        margin-top: 0;
    }
</style>