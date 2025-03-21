let app = new Vue({
    el: '#app',
    data: {
        columns: {
            todo: [],
            inProgress: [],
            completed: [],
        },
        columnTitles: {
            todo: 'Начато',
            inProgress: 'К работе',
            completed: 'Завершено',
        },
    },
    methods: {
        addNote(column) {
            const newNote = {
                id: Date.now(),
                title: 'Новая заметка',
                items: [
                    { text: 'Пункт 1', completed: false },
                    { text: 'Пункт 2', completed: false },
                    { text: 'Пункт 3', completed: false },
                ],
            };
            this.columns[column].push(newNote);
        },
    }
});