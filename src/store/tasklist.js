export default {
    namespaced: true,
    
    state: {
		tasklist: [],
		buffer: [],
        mockCopy: []     
    },

    getters: {
    },

    mutations: {
        //добавить мок-обьект
        addMock(state, payload) {
            state.tasklist.push(payload);
        },
        //проверка дублирования мок-объектов
        addMockCopy(state, payload) {
            state.mockCopy = payload;
        },
        //добавить задание
        addTask(state, payload){
            state.tasklist.push({
                taskName: payload.data,
                subtask: state.buffer
            });
            state.buffer = [];
        },
        //добавить задачу
        addSubtask(state, payload){
            state.buffer.push({
                subtaskName: payload.data,
                status: false
            });
        },
        //очистить буфер задач
        clearBuffer(state){
            state.buffer = [];
        },
        //проставить чекбокс
        changeStatus(state, payload) {
            state.tasklist[payload.taskIndex].subtask[payload.subtaskIndex].status = !state.tasklist[payload.taskIndex].subtask[payload.subtaskIndex].status;
        },
        //сохранить изменения
        confirmEdit(state, payload) {
            state.tasklist[payload.index] = payload.object;
        },
        //удалить задание
        deleteTask(state, payload) {
            state.tasklist.splice(payload, 1);
        },
    },

    actions: {
        addTask(store, payload){
            store.commit('addTask', payload);
        },
        addSubtask(store, payload){
            store.commit('addSubtask', payload);
        },
        clearBuffer(store) {
            store.commit('clearBuffer');
        },
        changeStatus(store, payload) {
            store.commit('changeStatus', payload);
        },
        confirmEdit(store, payload) {
            store.commit('confirmEdit', payload);
        },
        deleteTask(store, payload){
            store.commit('deleteTask', payload);
        },
        addMock(store, payload){
            store.commit('addMock', payload);
        },
        addMockCopy(store, payload){
            store.commit('addMockCopy', payload);
        },
    },
}