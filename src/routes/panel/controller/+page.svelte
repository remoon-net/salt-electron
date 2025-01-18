<script lang="ts">
	const { data } = $props()

	import ICEs from './ices.svelte'
	import Linkers from './linkers.svelte'
</script>

<Linkers linkers={data.status.Linker}></Linkers>
<hr />
<ICEs Tags={data.status.ICETags} ICEs={data.status.ICE}></ICEs>
