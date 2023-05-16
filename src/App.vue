<template>
    <v-app class="app">
        <v-app-bar 
        app
        color="teal lighten-2">
            <v-toolbar-title class="white--text">
                Список заданий
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    icon
                    color="white"
                    @click="clearStorage"
                    v-bind="attrs"
                    v-on="on">
                        <v-icon>
                            mdi-delete-outline
                        </v-icon>
                    </v-btn>
                </template>
                <span>
                    Очистка localStorage
                </span>
                
            </v-tooltip>
        </v-app-bar>
        
        <v-main style="background-color: #00796B">
            <router-view></router-view>
        </v-main>
    
    </v-app>
</template>

<script>
    export default {
        components: {
        },
        methods: {
            clearStorage() {
                window.localStorage.clear();
            }
        }
    }
</script>