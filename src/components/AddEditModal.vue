<template>
    <div class="edit-modal">
        <modal :dialog="isModalVisible" 
        @close="closingFunction"
        v-if="isModalVisible">
            <template #title>
                <h3 class="modal-title">{ modalTitle }</h3>
            </template>
            <template #body>
                <div>
                    <v-textarea  
                    label="Задание" 
                    placeholder="Введите текст задания"
                    @input="isSaveDisabled = false" 
                    @focus="taskFocus($event)"
                    @blur="taskBlur($event)"
                    v-model="inputModel"
                    color="teal"
                    rows="4"
                    auto-grow
                    /> <!--inputModel-->
                </div>

 
</template>

<script>
    import Modal from './Modal';
    export default {
        props: ['isModalVisible', 'closingFunction', 'modalTitle', 'isSaveDisabled', 'inputModel']
        components: {
            Modal
        }
    }
</script>

<style>

</style>