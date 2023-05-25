<template>
    <div class="edit-modal">
        <modal :dialog="isModalVisible" 
        @close="close()"
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
                    />
                </div>

                <div>
                    <h4 class="subtask-modal-list">Список задач   
                        <v-btn
                        icon
                        color="teal"
                        small
                        @click="showSubtaskInput = !showSubtaskInput">
                            <v-icon>
                                mdi-plus-box-outline
                            </v-icon>
                        </v-btn>  
                        <v-btn
                        icon
                        color="teal"
                        small
                        @click="listenSubtask = !listenSubtask"
                        v-if="editBuffer.subtask.length > 0">
                            <v-icon>
                                mdi-close-box-outline
                            </v-icon>
                        </v-btn>                         
                    </h4>  
                    <div v-if="showSubtaskInput">
                        <v-row class="d-flex justify-center align-center pl-3">
                            <v-textarea 
                            placeholder="Введите текст задачи"
                            @input="addSubtaskDisabled = false" 
                            v-model="subtaskAddInput"
                            color="teal"
                            outlined
                            class="pt-4"
                            rows="3"
                            auto-grow/>
                        
                            <v-btn 
                            @click="addSubtask()" 
                            :disabled="addSubtaskDisabled"
                            class="teal--text"
                            small
                            text
                            >
                                Добавить
                            </v-btn>
                        </v-row>
                    </div>   
                    <v-row justify="center" v-if="listenSubtask">
                        <h4>Выберите, какую задачу удалить
                            <v-btn
                            icon
                            color="teal lighten-3"
                            @click="listenSubtask = false">
                                <v-icon>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                        </h4>
                    </v-row>
                    <slot name="taskview">
                        Default content
                    </slot>
                </div>
            </template>      
            <template #footer>
                <slot name="journal-buttons">
                    Default content
                </slot>

                <!--v-row justify="end"-->
                <v-btn 
                @click="confirm()" 
                :disabled="isSaveDisabled"
                color="green"
                small
                class="ma-1 white--text">
                    Сохранить
                </v-btn>
                <v-btn 
                @click="close()"
                color="red darken-1"
                small
                class="ma-1 white--text">
                    Отмена
                </v-btn>
            </template>
        </modal>
    </div>    

 
</template>

<script>
    import Modal from './Modal';
    export default {
        props: ['isModalVisible', 'closingFunction', 'modalTitle', 'isSaveDisabled', 'inputModel', 'showSubtaskInput',
        'addSubtaskDisabled', 'subtaskInput'],
        components: {
            Modal
        }
    }
</script>

<style>

</style>