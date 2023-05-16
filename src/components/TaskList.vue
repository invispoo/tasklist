<!--Основной компонент приложения-->
<template>
    <div class="app-container">
        <!--Панель управления-->
        <v-card
        color="teal lighten-3"
        max-width="240"
        elevation="4"
        class="mx-auto mt-10"
        >
            <v-container>
                <v-row>
                    <v-card-actions>
                        <v-col>
                            <v-btn
                            icon
                            color="white"
                            x-large
                            @click="showAddModal">
                                <v-icon>
                                    mdi-plus-box-outline
                                </v-icon>
                            </v-btn>
                        </v-col>
                        
                        <v-col>
                            <v-btn
                            icon
                            color="white"
                            x-large
                            @click="listenDelete = true, listenEdit = false" 
                            :disabled="isEmpty">
                                <v-icon>
                                    mdi-close-box-outline
                                </v-icon>
                            </v-btn>
                        </v-col>
                        
                        <v-col>
                            <v-btn
                            icon
                            color="white"
                            x-large
                            @click="listenEdit = true, listenDelete = false" 
                            :disabled="isEmpty">
                                <v-icon>
                                    mdi-pencil-outline
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-card-actions>
                </v-row> 
            </v-container>            
        </v-card>  

        <div class="mt-8">
            <v-row justify="space-around" v-if="listenDelete&!listenEdit">
                <h3 class="white--text">
                    Выберите, какое задание удалить
                    <v-btn
                    icon
                    color="teal lighten-3"
                    x-large
                    v-if="listenDelete" 
                    @click="listenDelete = false" 
                    :disabled="isEmpty">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </h3>
            </v-row>

            <v-row justify="space-around" v-if="listenEdit&&!listenDelete">
                <h3 class="white--text">
                    Выберите, какое задание отредактировать
                    <v-btn
                    icon
                    color="teal lighten-3"
                    x-large
                    v-if="listenEdit" 
                    @click="listenEdit = false" 
                    :disabled="isEmpty">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </h3>
            </v-row>
        </div>
        
        <!--Модальное окно добавления задания-->
        <div class="add-modal">
            <modal :dialog="isAddModalVisible" @close="closeAddModal">
                <template v-slot:title>
                    <h3 class="modal-title">Создать задание</h3>
                </template>
                <template v-slot:body>
                    <div>
                        <v-textarea  
                        label="Задание" 
                        placeholder="Введите текст задания"
                        @input="saveAddDisabled = false" 
                        v-model="taskInput"
                        color="teal"
                        rows="4"
                        auto-grow>
                        </v-textarea>
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
                                auto-grow>
                                </v-textarea>
                            
                                <v-btn 
                                @click="addSubtask({data: subtaskAddInput})" 
                                :disabled="addSubtaskDisabled"
                                class="teal--text"
                                small
                                text
                                >
                                    Добавить
                                </v-btn>
                            </v-row>
                        </div>  
                        <v-card 
                        class="mx-auto pt-1" 
                        width="500" 
                        flat 
                        v-if="buffer.length > 0">
                            <h5 v-for="(subtask, index) in buffer">
                                <p class="px-2">
                                    {{ subtask.subtaskName }}
                                </p>
                                <v-divider 
                                v-if="index < buffer.length - 1">
                                </v-divider>
                            </h5>
                        </v-card>                                                           
                    </div>                
                </template>
                <template v-slot:footer>
                    <v-row justify="end">
                        <v-btn 
                        @click="addTask({data: taskInput})" 
                        :disabled="saveAddDisabled"
                        color="green"
                        small
                        class="ma-1 white--text">
                            Сохранить
                        </v-btn>
                        <v-btn 
                        @click="closeAddModal"
                        color="red darken-1"
                        small
                        class="ma-1 white--text">
                            Отмена
                        </v-btn>
                    </v-row>
                </template>
            </modal>
        </div>  

        <!--Модальное окно редактирования задания-->
        <div class="edit-modal">
            <modal :dialog="isEditModalVisible" 
            @close="showRejectEditModal"
            v-if="isEditModalVisible">
                <template v-slot:title>
                    <h4 class="modal-title">Изменить задание</h4>
                </template>
                <template v-slot:body>
                    <div>
                        <v-textarea  
                        label="Задание" 
                        placeholder="Введите текст задания"
                        @input="saveEditDisabled = false" 
                        @focus="taskFocus($event)"
                        @blur="taskBlur($event)"
                        v-model="editBuffer.taskName"
                        color="teal"
                        rows="4"
                        auto-grow
                        >
                        </v-textarea>
                    </div>

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
                            v-model="subtaskEditInput"
                            color="teal"
                            outlined
                            class="pt-4"
                            rows="3"
                            auto-grow>
                            </v-textarea>
                            <v-btn 
                            @click="addEditSubtask()" 
                            :disabled="addSubtaskDisabled"
                            class="teal--text mb-2"
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
                    <table class="table table-bordered subtask-table" v-if="editBuffer.subtask.length > 0">
                        <tbody>
                            <tr>
                                <th class="text-center">Статус</th>
                                <th class="text-center">Название</th>
                            </tr>
                            <tr v-for="(subtask, subtaskIndex, key) in editBuffer.subtask" :key="key">
                                <td>
                                    <input class="mt-4 mx-auto" 
                                    type="checkbox"  
                                    @input="saveEditDisabled = false"
                                    v-model="subtask.status">                                               
                                </td>                            
                                <td @click="readItem(subtaskIndex)">                                           
                                    <div>
                                        <v-textarea
                                        @input="saveEditDisabled = false" 
                                        @focus="subtaskFocus($event)"
                                        @blur="subtaskBlur(subtaskIndex, $event)"
                                        v-model="subtask.subtaskName"
                                        style="font-size: 14px;"
                                        solo
                                        flat
                                        auto-grow
                                        rows="2"
                                        >
                                        </v-textarea>
                                    </div>
                                </td>						
                            </tr>                                       
                        </tbody> 
                    </table>                                        
                </template>
                <template v-slot:footer>
                    <div>
                        <v-btn
                        icon
                        color="black"
                        :disabled="undoJournalActivated" 
                        @click="undo">
                            <v-icon>
                                mdi-restore
                            </v-icon>
                        </v-btn>
                        <v-btn
                        icon
                        color="black"
                        :disabled="redoJournalActivated" 
                        @click="redo">
                            <v-icon>
                                mdi-reload
                            </v-icon>
                        </v-btn>                               
                    </div>
                    <v-btn
                    color="green"
                    small
                    class="ma-1 white--text"
                    @click="confirmEdit" 
                    :disabled="saveEditDisabled">
                        Сохранить
                    </v-btn>
                    <v-btn
                    color="red darken-1"
                    small
                    class="ma-1 white--text"
                    @click="showRejectEditModal">
                        Отмена
                    </v-btn>
                </template>
            </modal>
        </div>

        <!--Модальное окно удаления задания-->
        <div class="delete-modal">
            <modal :dialog="isDeleteModalVisible" 
            @close="closeDeleteModal" 
            @reject="closeDeleteModal" 
            @confirm="confirmDelete">
                <template v-slot:title>
                    <h4 class="modal-title">Удалить задание</h4>
                </template>
                <template v-slot:body>
                    <h5>Вы действительно хотите удалить это задание?</h5>
                </template>
            </modal>
        </div>

        <!--Модальное окно удаления задачи-->
        <div class="delete-sub-modal">
            <modal :dialog="isSubDeleteModalVisible" 
            @close="closeSubDeleteModal" 
            @reject="closeSubDeleteModal" 
            @confirm="confirmSubDelete">
                <template v-slot:title>
                    <h4 class="modal-title">Удалить задачу</h4>
                </template>
                <template v-slot:body>
                    <h5>Вы действительно хотите удалить эту задачу?</h5>
                </template>
            </modal>
        </div>

        <!--Модальное окно подтверждения отмены редактирования-->
        <div class="reject-edit-modal">
            <modal :dialog="isRejectEditModalVisible" 
            @close="closeRejectEditModal" 
            @reject="closeRejectEditModal" 
            @confirm="rejectEdit">
                <template v-slot:title>
                    <h4 class="modal-title">Отменить изменение</h4>
                </template>
                <template v-slot:body>
                    <h5>Вы действительно хотите отменить изменения?</h5>
                    <h5>Несохраненные изменения будут удалены.</h5>
                </template>
            </modal>
        </div>

        <!--Таблица заданий на главном экране-->
        <div>
            <v-simple-table class="main-table elevation-3" v-if="!isEmpty">
                <tbody>
                    <tr>
                        <th class="text-center table-border" style="font-size: 14px;">Задания</th>
                        <v-divider vertical></v-divider>
                        <th class="text-center" style="font-size: 14px;">Задачи</th>
                    </tr>
                    <tr v-for="(task, taskIndex, key) in tasklist" @click="readItem(taskIndex)" :key="key">
                        <td class="table-border main-table-taskname">
                            {{ task.taskName }}                               
                        </td>
                        <v-divider vertical></v-divider>                        
                        <td @mouseenter="showTip(taskIndex)" 
                        @mouseleave="hideTip(taskIndex)">                                           
                            <v-tooltip right v-model="tableMouse[taskIndex]" color="teal lighten-2" transition="scale-transition">
                                <template v-slot:activator="props"> 
                                    <div class="subtask-table-container">
                                        <div class="main-table-row" v-for="(subtask, subtaskIndex) in task.subtask.slice(0,5)" :props="props">
                                            <h5 class="subtask-table-text" >
                                                {{ subtask.subtaskName }}
                                            </h5>
                                            <input class="ma-1" 
                                            type="checkbox" 
                                            :checked="subtask.status"
                                            @input="changeStatus({
                                                taskIndex: taskIndex,
                                                subtaskIndex: subtaskIndex,
                                            })">
                                        </div> 
                                        <h5 v-show="task.subtask.length > 5">...</h5> 
                                    </div>
                                </template>
                                <span class="tooltip-list" v-for="subtask in task.subtask">
                                    <h5 class="tooltip-text">
                                        {{ subtask.subtaskName }}
                                        <v-icon v-if="subtask.status" small color="white">
                                            mdi-check
                                        </v-icon> 
                                    </h5>            
                                </span>
                            </v-tooltip>   
                            
                        </td>					
                    </tr>
                </tbody>  
            </v-simple-table>                  
        </div>
    </div>            
</template>

<script>
    import {mapGetters} from 'vuex';
	import {mapActions} from 'vuex';
    import Modal from './Modal';
    import { tasklistQuery } from "../apollo.js";

    export default {
        apollo: {
            getTask: {
                query: tasklistQuery,
            }
        },
        mounted() {
            const {tasklist} = this.getTask;
            //предотвращение дублирования мок-объектов
            if (JSON.stringify(this.mockCopy) !== JSON.stringify(this.getTask)) {
                //удаление лишних свойст из результата запроса
                for (let i = 0; i < tasklist.length; i++) {
                    delete tasklist[i].__typename;
                    for (let y = 0; y < tasklist[i].subtask.length; y++) {
                        delete tasklist[i].subtask[y].__typename;
                    }
                    //добавляет мок-объекты в массив списка заданий
                    this.addMock({
                        taskName: tasklist[i].taskName,
                        subtask: tasklist[i].subtask
                    });   
                }
            }
            //результат последнего запроса сохраняется, чтобы не использовать данные из него снова
            this.addMockCopy(this.getTask);
        },
        data() {
            return {
                // ADD
                isAddModalVisible: false, //видимость модального окна добавления задания
                taskInput: '', //ввод названия задания
                subtaskAddInput: '', //ввод названия задачи
                showSubtaskInput: false, //показать/скрыть ввод названия задачи
                addSubtaskDisabled: true, //нельзя добавить задачу с пустым названием
                saveAddDisabled: true, //нельзя добавить задание с пустым названием или без задач

                // DELETE
                listenDelete: false, //слушатель выбора задания для удаления
                isDeleteModalVisible: false, //видимость модального окна удаления задания
                isSubDeleteModalVisible: false, //видимость модального окна удаления задачи
                deleteIndex: null, //индекс удаляемого задания
                deleteSubtaskIndex: null, //индекс удаляемой задачи

                // EDIT
                listenEdit: false, //слушатель выбора задания для редактирования
                listenSubtask: false, //слушатель выбора задачи для удаления
                isEditModalVisible: false, //видимость модального окна редактирования задания
                isRejectEditModalVisible: false, //видимость модального окна отмены редактирования задания
                subtaskEditInput: '', //ввод названия задачи
                editIndex: null, //индекс редактируемого задания
                editInput: '', //ввод названия задания
                saveEditDisabled: true, //сохранение задания запрещено                 
                editBuffer: {}, //буфер редактирования задания  
                 
                
                //LOGFILE
                undoJournal: [], //журнал действий, которые можно отменить
                redoJournal: [], //журнал действий, которые можно повторить после отмены
                focusText: '', //текст названия редактируемого задания/задачи перед редактированием
                blurText: '', //текст названия редактируемого задания/задачи после редактирования

                tableMouse: [], //массив флагов присутствия мышки на каждом задании в таблице
                timer: null, //таймер для вывода подсказки на длинных заданиях
            }
        },
        
        computed: {
            ...mapGetters('tasklist', [
                'tasklist',
                'buffer',
                'mockCopy'
            ]),
            isEmpty() {
                return this.tasklist.length === 0;
            },
            undoJournalActivated() {
                return this.undoJournal.length === 0;
            },
            redoJournalActivated() {
                return this.redoJournal.length === 0;
            },
        },
        methods: {
            ...mapActions('tasklist', [
                'clearBuffer',
                'changeStatus',
                'deleteTask',
                'addMock',
                'addMockCopy'
            ]),
            //Считывает элементы под кликом
            readItem(index) {         
                if (this.listenDelete){
                    this.deleteIndex = index; 
                    this.showDeleteModal();                    
                }                    
                if (this.listenEdit) {
                    this.editIndex = index; 
                    this.showEditModal();
                    this.listenEdit = false;
                }
                if (this.listenSubtask) {
                    this.deleteSubtaskIndex = index;
                    this.showSubDeleteModal();
                    this.listenSubtask = false;
                }
            },
            //вывод подсказки на длинных заданиях
            showTip(index) {
                this.tableMouse.splice(this.tasklist.length);
                if (this.tasklist[index].subtask.length > 5) {
                    this.timer = setTimeout(() => this.$set(this.tableMouse, index, true), 500);
                }           
            },
            hideTip(index) {
                clearInterval(this.timer);
                this.$set(this.tableMouse, index, false)
            },


            // ADD
            addTask(payload) {
                this.$store.dispatch('tasklist/addTask', payload);
                this.taskInput = '';
                this.closeAddModal();
            },
            addSubtask(payload) {
                this.$store.dispatch('tasklist/addSubtask', payload); 
                //теперь можно сохранить задание, но опять нельзя добавить безымянную задачу
                this.saveAddDisabled = false;
                this.subtaskAddInput = '';
                this.addSubtaskDisabled = true;
            },
            showAddModal() {
                this.isAddModalVisible = true;
            },
            closeAddModal() {
                //очистка буфера задач
                this.clearBuffer();
                //нельзя добавить пустое задание
                this.saveAddDisabled = true;
                //ввод задачи не показывается
                this.showSubtaskInput = false;
                //очищение инпутов
                this.taskInput = '';
                this.subtaskAddInput = '';
                //вывод окна
                this.isAddModalVisible = false;
            },


            // DELETE
            confirmDelete () {
                if (this.deleteIndex !== null)
                    this.deleteTask(this.deleteIndex);
                this.closeDeleteModal();
                //после подтверждения удаления очищается индекс удаляемого задания и выключается слушатель выбора элемента
                this.deleteIndex = null;
                this.listenDelete = false;
            },
            showDeleteModal() {
                this.isDeleteModalVisible = true;
            },
            closeDeleteModal() {
                this.isDeleteModalVisible = false;
                this.deleteIndex = null;
            },


            // EDIT     
            addEditSubtask() {
                //новая задача добавляется в копию списка заданий
                this.editBuffer.subtask.push({
                    subtaskName: this.subtaskEditInput,
                    status: false
                });
                //в журнал добавляется запись для возможного отката изменений
                this.undoJournal.push({
                    type: 'add',
                    index: this.editBuffer.subtask.length - 1,
                    subtask: this.editBuffer.subtask[this.editBuffer.subtask.length - 1]
                })
                //теперь можно сохранить изменения, опять нельзя добавить безымянную задачу
                this.saveEditDisabled = false;
                this.subtaskEditInput = '';
                this.addSubtaskDisabled = true;
            }, 
            changeBufferStatus(subtaskIndex) {
                //смена состояния задачи в копии списка заданий
                this.editBuffer.subtask[subtaskIndex].status = !this.editBuffer.subtask[subtaskIndex].status;
                this.saveEditDisabled = false;
            },
            confirmEdit() {
                this.$store.dispatch('tasklist/confirmEdit', {
                    index: this.editIndex,
                    object: this.editBuffer
                })
                this.closeEditModal();
            },
            confirmSubDelete () {
                if (this.deleteSubtaskIndex !== null){
                    //в журнал добавляется запись для возможного отката изменений
                    this.undoJournal.push({
                        type: 'delete',
                        index: this.deleteSubtaskIndex,
                        subtask: this.editBuffer.subtask[this.deleteSubtaskIndex]
                    });
                    this.editBuffer.subtask.splice(this.deleteSubtaskIndex, 1);
                }
                this.closeSubDeleteModal();
                this.saveEditDisabled = false;
                this.deleteSubtaskIndex = null;
            },

            //модальное окно редактирования
            showEditModal() {
                //помещение в буфер исходного состояния задания
                this.editBuffer = JSON.parse(JSON.stringify(this.tasklist[this.editIndex]));
                this.isEditModalVisible = true; 
            },
            closeEditModal() {
                this.isEditModalVisible = false;
                //очистка буфера изменений
                this.editBuffer = {};
                //флаг изменения названия в исходное
                this.editFlag = false;
                //ввод новой задачи не показывается             
                this.showSubtaskInput = false;
                //нельзя сохранить неизмененное задание
                this.saveEditDisabled = true;
                //зануление индекса под кликом
                this.editIndex = null; 
                //очищение журналов
                this.undoJournal = [];
                this.redoJournal = [];                             
            },
            
            //модальное окно удаления задачи
            //окно редактирования скрывается, выводится окно подтверждения удаления
            showSubDeleteModal() {
                this.isEditModalVisible = false;
                this.isSubDeleteModalVisible = true;
            },
            closeSubDeleteModal() {
                this.isSubDeleteModalVisible = false;
                this.isEditModalVisible = true;
                this.deleteSubtaskIndex = null;
            },

            //модальное окно отмены изменений
            rejectEdit() {
                this.closeRejectEditModal();
                this.closeEditModal();
            },
            //вывод окна отказа от изменений
            showRejectEditModal() {
                if (this.saveEditDisabled) {
                    this.closeEditModal();
                }
                else {
                    this.isEditModalVisible = false;
                    this.isRejectEditModalVisible = true;
                } 
            },
            closeRejectEditModal() {
                this.isRejectEditModalVisible = false;
                this.isEditModalVisible = true;
            },


            //JOURNAL
            taskFocus(e) {
                //сохранение значения до редактирования
                this.focusText = e.target.value;
            },
            taskBlur(e) {
                //проверка, было ли изменено значение и добавление записи в журнал, если да
                this.blurText = e.target.value;
                if (this.focusText !== this.blurText) {
                    this.undoJournal.push({
                        type: 'editTask',
                        text: this.focusText
                    });
                }
            },
            //те же методы для задач
            subtaskFocus(e) {
                this.focusText = e.target.value;
            },
            subtaskBlur(index, e) {
                this.blurText = e.target.value;
                if (this.focusText !== this.blurText) {
                    this.undoJournal.push({
                        type: 'editSubtask',
                        index: index,
                        text: this.focusText
                    });
                }
                this.focusText = '';
                this.blurText = '';
            },
            //добавление в журнал отмены записи одного из четырех типов:
            //добавление, удаление, изменение текста задания/задачи
            undo() {              
                let lastNote = this.undoJournal[this.undoJournal.length - 1]; 

                if (lastNote.type === 'add') {
                    //удаляем задачу
                    this.editBuffer.subtask.splice(lastNote.index, 1);
                    //помещаем запись в redo журнал
                    this.redoJournal.push({
                        type: 'add',
                        index: lastNote.index,
                        subtask: lastNote.subtask
                    });
                    //очищаем последнюю запись
                    this.undoJournal.splice(this.undoJournal.length - 1, 1);
                }
                if (lastNote.type === 'delete') {
                    //добавляем задачу
                    this.editBuffer.subtask.splice(lastNote.index, 0, lastNote.subtask);
                    //помещаем запись в redo журнал
                    this.redoJournal.push({
                        type: 'delete',
                        index: lastNote.index,
                        subtask: lastNote.subtask
                    });
                    //очищаем последнюю запись
                    this.undoJournal.splice(this.undoJournal.length - 1, 1);
                }
                if (lastNote.type === 'editSubtask') {
                    //помещаем запись в redo журнал
                    this.redoJournal.push({
                        type: 'editSubtask',
                        index: lastNote.index,
                        text: this.editBuffer.subtask[lastNote.index].subtaskName
                    });
                    //редактируем название задачи
                    this.editBuffer.subtask[lastNote.index].subtaskName = lastNote.text;
                    //очищаем последнюю запись
                    this.undoJournal.splice(this.undoJournal.length - 1, 1);
                }
                if (lastNote.type === 'editTask') {
                    //помещаем запись в redo журнал
                    this.redoJournal.push({
                        type: 'editTask',
                        text: this.editBuffer.taskName
                    });
                    //редактируем название задания
                    this.editBuffer.taskName = lastNote.text;
                    //очищаем последнюю запись
                    this.undoJournal.splice(this.undoJournal.length - 1, 1);
                }
            },
            //добавление в журнал повторения записи одного из четырех типов:
            //добавление, удаление, изменение текста задания/задачи
            redo() {                
                let lastNote = this.redoJournal[this.redoJournal.length - 1];  
                if (lastNote.type === 'add') {
                    //добавляем задачу
                    this.editBuffer.subtask.splice(lastNote.index, 0, lastNote.subtask);
                    //помещаем запись в undo журнал
                    this.undoJournal.push({
                        type: 'add',
                        index: lastNote.index,
                        subtask: lastNote.subtask
                    });
                    //очищаем последнюю запись
                    this.redoJournal.splice(this.redoJournal.length - 1, 1);
                }
                if (lastNote.type === 'delete') {
                    //удаляем задачу
                    this.editBuffer.subtask.splice(lastNote.index, 1);
                    //помещаем запись в undo журнал
                    this.undoJournal.push({
                        type: 'delete',
                        index: lastNote.index,
                        subtask: lastNote.subtask
                    });
                    //очищаем последнюю запись
                    this.redoJournal.splice(this.redoJournal.length - 1, 1);
                }
                if (lastNote.type === 'editSubtask') {
                    //помещаем запись в undo журнал
                    this.undoJournal.push({
                        type: 'editSubtask',
                        index: lastNote.index,
                        text: this.editBuffer.subtask[lastNote.index].subtaskName
                    });
                    //редактируем название задачи
                    this.editBuffer.subtask[lastNote.index].subtaskName = lastNote.text;
                    //очищаем последнюю запись
                    this.redoJournal.splice(this.redoJournal.length - 1, 1);
                }
                if (lastNote.type === 'editTask') {
                    //помещаем запись в undo журнал
                    this.undoJournal.push({
                        type: 'editTask',
                        text: this.editBuffer.taskName
                    });
                    //редактируем название задания
                    this.editBuffer.taskName = lastNote.text;
                    //очищаем последнюю запись
                    this.redoJournal.splice(this.redoJournal.length - 1, 1);
                }
            },

        },
        components: {
            Modal,
        }
    }
</script>

<style scoped>
    .app-container {
        margin-top: 10px;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }
    
    .main-table {
        table-layout: fixed;
        margin: 40px auto 20px;
        width: 70%;
        border: 3px solid #00E5FF;
        word-break: break-word;
        white-space: normal;
    }

    .main-table-taskname {
        width: 30%;
    }

    .main-table-row {
        display: flex;
        flex-direction: row;
    }

    .table-border {
        border-right: 1px solid rgb(196, 187, 187);
    }

    .subtask-table-text {
        font-weight: normal;
    }

    .subtask-table-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 15px 0px;
    }
    
    .tooltip-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 300px;
    }

    .tooltip-text {
        white-space: normal;
        line-height: 1.5;
        word-break: break-word;
    }

    .subtask-table {
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        width: 90%;
    }

    .modal-title {
        font-size: 18px;
    }

    .subtask-modal-list {
        display: flex;
        align-items: center;
        justify-content: start;
    }
</style>