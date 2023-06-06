<!--Компонент модального окна-->
<template>
    <div>
        <v-dialog
            v-model="dialog"
            persistent
            width="600"
            color="black"
            scrollable>
            <v-card class="modal">
                <v-card-title class="modal-header">
                    <div class="header-container white--text">
                        <slot name="title">
                            default title     
                        </slot>                     
                        <v-btn
                        icon
                        @click="close"
                        class="btn-close">
                            <v-icon
                            color="white">
                                mdi-close
                            </v-icon>
                        </v-btn>
                    </div>
                </v-card-title>             

                <v-card-text class="modal-body black--text">
                    <slot name="body" >
                        default body
                    </slot>
                </v-card-text>

                <v-card-actions class="modal-footer">
                    <slot name="footer">
                        <v-btn 
                        color="green"
                        class="ma-1 white--text"
                        @click="confirm">
                            Да
                        </v-btn>
                        <v-btn 
                        color="red darken-1"
                        class="ma-1 white--text"
                        @click="reject">
                            Нет
                        </v-btn>
                    </slot>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            dialog: Boolean,
        },
        methods: {
            close() {
                this.$emit('close'); //событие закрытия окна
            },
            confirm() {
                this.$emit('confirm'); //событие подтверждения действий
            },
            reject() {
                this.$emit('reject'); //событие отмены действий
            },
        },
    }
</script>

<style scoped>
.modal {
  max-height: 800px;
  min-height: 150px;
}

.header-container {
    width: 600px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header {
    border-bottom: 2px solid rgb(78, 230, 244);
    height: 60px;
    background-color: teal;
}

.modal-body {
    margin-top: 15px; 
    text-align: center;
    color: black;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
    padding: 20px;
    display: flex;
    height: 60px; 
}
</style>