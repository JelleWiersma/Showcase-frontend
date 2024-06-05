<script>
	import { page } from '$app/stores';
	import { hideNavigation } from '$lib/store';
    import { onMount } from 'svelte';

	let shouldHide = false;
	let isHidden = false;
	hideNavigation.subscribe(value => {
		shouldHide = value;
		isHidden = value;
	});

	
	/**
     * @type {NodeJS.Timeout | undefined}
     */
	let timeoutId;

	onMount(() => {
		if (shouldHide) {
			isHidden = true;
		} else {
			isHidden = false;
		}
	});
	
	function onMouseEnter() {
		if (shouldHide) {
			if(timeoutId){
				clearTimeout(timeoutId);
			}
			isHidden = false;
		} else{ 
			isHidden = false;
		}
	}

	function onMouseLeave() {
		if (shouldHide) {
			timeoutId = setTimeout(() => {
				isHidden = true;
			}, 2000);
		} else {
			isHidden = false;
		}
	}
</script>

<header role="navigation" class:hideNav={isHidden} on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
	<nav>
		<div class="box">
            <a href="/" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>Home</a>
        </div>
        <div class="box">
            <a href="/contact" aria-current={$page.url.pathname === '/contact' ? 'page' : undefined}>Contact</a>
        </div>
        <div class="box">
            <a href="/showcase" aria-current={$page.url.pathname.startsWith('/showcase') ? 'page' : undefined}>Showcase</a>
        </div>
    </nav>
</header>

<style>
	header {
		position: fixed;
		top: calc(2.3svh + 10px);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		z-index: 1000;
		transition: top 0.5s ease-in-out;
	}

	.hideNav {
		top: -30px;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		gap: 1rem;
		--background: var(--color-bg-1);
	}

	.box {
        position: relative;
        width: 130px;
        height: 35px;
        
    }

    .box::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
		border-radius: 5px;
        background-color: var(--color-bg-1);
        box-shadow: 0 0 0.3vw #000000;
        transition: transform 0.1s ease-in-out;
        z-index: -1;
    }

    .box:hover::before {
        transform: scale(1.04);
    }

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: center;
		color: var(--color-theme-1);
		font-weight: 600;
		font-size: 24px;
		text-decoration: underline transparent;
		transition: text-decoration 0.5s ease-in-out;
	}
	
	nav a[aria-current='page'] {
		text-decoration: underline;
	}

	@media (max-width: 720px) {
		header {
			top: 10px;
		}

        .box {
            width: 100px;
            height: 25px;
        }

		nav a {
			font-size: 20px;
		}
    }
</style>
