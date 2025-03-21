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
        newNote:{
            title: '',
            items: ['', '', ''],
        }
    },
    methods: {
        addNote(column) {
            if (this.newNote.title.trim() === '' || this.newNote.items.some(item => item.trim() === '')) {
                alert('Заполните все поля заметки!');
                return;
            }

            const newNote = {
                id: Date.now(),
                title: this.newNote.title,
                items: this.newNote.items.map(text => ({ text, completed: false })),
                completedDate: null,
            };

            this.columns[column].push(newNote);
            this.resetForm();
        },
        deleteNote(noteId) {
            Object.keys(this.columns).forEach(column => {
                this.columns[column] = this.columns[column].filter(note => note.id !== noteId);
            });
            this.checkBlockStatus();
        },
    }
});