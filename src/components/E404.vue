<!--Компонент, отображающийся при вводе некорректного адреса страницы-->
<template>
	<div class="container">
		<h1 class="white--text">Страница не найдена</h1>
		<v-divider></v-divider>
		<router-link :to="{name: 'tasklist'}" class="white--text">Вернуться на главную</router-link>
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style>
	.container{
		margin-left: 3px
	}
</style>