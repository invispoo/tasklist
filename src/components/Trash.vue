<!--Модальное окно добавления задания-->
        <div class="add-modal">
            <modal :dialog="isAddModalVisible" @close="closeAddModal">
                <template #title>
                    <h3 class="modal-title">Создать задание</h3>
                </template>
                <template #body>
                    <div>
                        <v-textarea  
                        label="Задание" 
                        placeholder="Введите текст задания"
                        @input="isSaveAddDisabled = false" 
                        v-model="taskInput"
                        color="teal"
                        rows="4"
                        auto-grow/>
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
                                auto-grow/>
                            
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
                                v-if="index < buffer.length - 1"/>
                            </h5>
                        </v-card>                                                           
                    </div>                
                </template>
                <template #footer>
                    <v-row justify="end">
                        <v-btn 
                        @click="addTask({data: taskInput})" 
                        :disabled="isSaveAddDisabled"
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
                <template #title>
                    <h3 class="modal-title">Изменить задание</h3>
                </template>
                <template #body>
                    <div>
                        <v-textarea  
                        label="Задание" 
                        placeholder="Введите текст задания"
                        @input="isSaveEditDisabled = false" 
                        @focus="taskFocus($event)"
                        @blur="taskBlur($event)"
                        v-model="editBuffer.taskName"
                        color="teal"
                        rows="4"
                        auto-grow
                        />
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
                            auto-grow/>
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
                            <tr v-for="(subtask, subtaskIndex) in editBuffer.subtask">
                                <td>
                                    <input class="mt-4 mx-auto" 
                                    type="checkbox"  
                                    @input="isSaveEditDisabled = false"
                                    v-model="subtask.status">                                               
                                </td>                            
                                <td @click="readItem(subtaskIndex)">                                           
                                    <div>
                                        <v-textarea
                                        @input="isSaveEditDisabled = false" 
                                        @focus="subtaskFocus($event)"
                                        @blur="subtaskBlur(subtaskIndex, $event)"
                                        v-model="subtask.subtaskName"
                                        style="font-size: 14px;"
                                        solo
                                        flat
                                        auto-grow
                                        rows="2"
                                        />
                                    </div>
                                </td>						
                            </tr>                                       
                        </tbody> 
                    </table>                                        
                </template>
                <template #footer>
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
                    :disabled="isSaveEditDisabled">
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
                            :disabled="isTasklistEmpty">
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
                            :disabled="isTasklistEmpty">
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
            <v-row justify="space-around" v-if="listenDelete && !listenEdit">
                <h3 class="white--text">
                    Выберите, какое задание удалить
                    <v-btn
                    icon
                    color="teal lighten-3"
                    x-large
                    v-if="listenDelete" 
                    @click="listenDelete = false" 
                    :disabled="isTasklistEmpty">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </h3>
            </v-row>

            <v-row justify="space-around" v-if="listenEdit && !listenDelete">
                <h3 class="white--text">
                    Выберите, какое задание отредактировать
                    <v-btn
                    icon
                    color="teal lighten-3"
                    x-large
                    v-if="listenEdit" 
                    @click="listenEdit = false" 
                    :disabled="isTasklistEmpty">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </h3>
            </v-row>
        </div> 