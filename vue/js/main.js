let app = new Vue({
    el: '#app',
    data() {
        return {
            columns: {
                todo: [],
                inProgress: [],
                completed: [],
            },
            columnTitles: {
                todo: 'начато',
                inProgress: 'к работе',
                completed: 'завершено',
            },
        };
    }
});