<template>
    <!--Панель управления-->
    <div>
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
                            @click="deleteButton" 
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
                            @click="editButton" 
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
                    @click="$emit('delete', false)" 
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
                    @click="$emit('edit', false)" 
                    :disabled="isTasklistEmpty">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </h3>
            </v-row>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        props: ['listenDelete', 'listenEdit'],
        computed: {
            ...mapState('tasklist', [
                'tasklist',
            ]),
            isTasklistEmpty() {
                return this.tasklist.length === 0;
            },
        },
        methods: {
            showAddModal () {
                this.$emit('add');
            },
            deleteButton () {
                this.$emit('delete', true);
                this.$emit('edit', false);
            },
            editButton () {
                this.$emit('delete', false);
                this.$emit('edit', true);
            }
        }
    }
</script>

<style>

</style>