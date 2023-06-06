<template>
    <div>
        <modal :dialog="isModalVisible" 
        @close="close()"
        v-if="isModalVisible">
            <template #title>
                <h3 class="modal-title">{{ modalTitle }}</h3>
            </template>
            <template #body>
                <div>
                    <v-textarea  
                    label="Задание" 
                    placeholder="Введите текст задания"
                    @input="taskIn" 
                    @focus="focus"
                    @blur="blur"
                    :value="taskInput"
                    color="teal"
                    rows="4"
                    auto-grow
                    />
                </div>
                <div>
                    <h4 class="subtask-modal-list pb-3">Список задач    
                        <v-btn
                        icon
                        color="teal"
                        small
                        @click="showSubtaskInput = !showSubtaskInput">
                            <v-icon>
                                mdi-plus-box-outline
                            </v-icon>
                        </v-btn>  
                        <slot name="delete-subtask"/>                     
                    </h4>  
                    <div v-if="showSubtaskInput">
                        <v-row class="d-flex justify-center align-center pl-3">
                            <v-textarea 
                            placeholder="Введите текст задачи"
                            v-model="subtaskInput"
                            color="teal"
                            outlined
                            class="pt-4"
                            rows="3"
                            auto-grow/>
                            <v-btn 
                            @click="addSubtask" 
                            :disabled="isSubtaskEmpty"
                            class="teal--text"
                            small
                            text
                            >
                                Добавить
                            </v-btn>
                        </v-row>
                    </div>   
                    <slot name="taskview"/>
                </div>
            </template>      
            <template #footer>
                <slot name="journal-buttons"/>
                <v-btn 
                @click="confirm" 
                :disabled="isSaveDisabled && isSaveEditDisabled"
                color="green"
                small
                class="ma-1 white--text">
                    Сохранить
                </v-btn>
                <v-btn 
                @click="close"
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
        components: {
            Modal
        },
        props: {
            isModalVisible: Boolean,
            isSaveEditDisabled: Boolean,
            modalTitle: String,
            taskInput: String,
        },

        data () {
            return {
                showSubtaskInput: false,
                isSaveDisabled: true,
                subtaskInput: '',
                addSubtaskDisabled: true
            }
        },
        computed: {
            isSubtaskEmpty () {
                return this.subtaskInput === '';
            },
        },
        methods: {
            close () {
                //ввод задачи не показывается
                this.showSubtaskInput = false;
                this.clearInputFlags(true);
                this.$emit('close');
            },
            confirm () {
                //ввод задачи не показывается
                this.showSubtaskInput = false;
                this.clearInputFlags(true);
                this.$emit('confirm');
            },
            focus (e) {
                this.$emit('focus', e);
            },
            blur (e) {
                this.$emit('blur', e);
            },
            addSubtask () {
                this.$emit('addsubtask', this.subtaskInput);
                this.clearInputFlags(false);
            },
            taskIn (e) {
                this.isSaveDisabled = false;
                this.$emit('taskinput', {
                    taskInput: e,
                })
            },
            clearInputFlags (flag) {
                //нельзя добавить пустое задание
                this.isSaveDisabled = flag;
                //очищение инпута задачи
                this.subtaskInput = '';
            }
        },
    }
</script>

<style>
     .modal-title {
        font-size: 18px;
    }

    .subtask-modal-list {
        display: flex;
        align-items: center;
        justify-content: start;
    }
</style>