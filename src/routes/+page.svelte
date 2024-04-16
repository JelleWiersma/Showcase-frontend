<script>
	import face from '$lib/images/face.jpg'
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Jelle Wiersma's showcase" />
</svelte:head>

<div class="content">
	<img src={face} alt="Face" class="round-image" />
    <span class="title-text">Jelle Wiersma</span>
	<div class="horizontal-line"></div>
	<p style="margin: 0px">
		Welkom bij mijn showcase! Op deze site introduceer ik mijzelf, en laat ik een applicatie uit mijn portfolio zien. Voel je vrij om met mij contact op te nemen via het contactformulier, of via de onderstaande informatie. <br><br>
	</p>
	<div class="horizontal-line"></div>
	<span class="subtitle">Opleidingen</span>
	<ul class="bulleted-list">
		<li>Havo Natuur en Techniek</li>
		<li>HBO-ICT Software Engineering</li>
	</ul>
	<div class="horizontal-line"></div>
	<span class="subtitle">Vaardigheden</span>
	<ul class="bulleted-list">
		<li>PHP</li>
		<li>Java</li>
		<li>Javascript</li>
		<li>Typescript</li>
		<li>C#</li>
		<li>.NET</li>
		<li>.NET Blazor</li>
		<li>Angular</li>
		<li>Svelte</li>
		<li>Python</li>
		<li>MySQL</li>
		<li>SQL Server</li>
		<li>Google Firebase</li>
	</ul>
	<span class="subtitle">Gegevens</span>
	<ul class="bulleted-list">
		<li><a  href="https://www.linkedin.com/in/jelle-wiersma-9730a2207/" target="_blank" rel="noopener">LinkedIn</a></li>
	</ul>
</div>

<style>
	.round-image {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		object-fit: cover;
		display: block;
		align-self: center;
	}

	.title-text {
		text-align: center;
		font-weight: 800;
		font-size: 24px;
		align-self: center;
	}

	.subtitle {
		font-weight: 800;
		font-size: 24px;
	}

	.bulleted-list {
        column-count: 3;
        column-fill: auto;
        max-height: 100px;
        overflow: auto;
		margin: 0;
    }

	.bulleted-list li {
		page-break-inside: avoid;
		break-inside: avoid-column;
	}
</style>