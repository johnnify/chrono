<script lang="ts">
	import {Confetti} from 'svelte-confetti'
</script>

<div
	class="pointer-events-none fixed -top-12 left-0 flex h-screen w-screen justify-center overflow-hidden"
>
	<Confetti
		x={[-5, 5]}
		y={[0, 0.1]}
		delay={[100, 2_000]}
		infinite
		duration={5_000}
		amount={500}
		fallDistance="100vh"
	/>
</div>
