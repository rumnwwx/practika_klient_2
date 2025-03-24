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
        newNote: {
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
            this.newNote.title = '';
            this.newNote.items = ['', '', ''];
        },
        deleteNote(noteId) {
            Object.keys(this.columns).forEach(column => {
                this.columns[column] = this.columns[column].filter(note => note.id !== noteId);
            });
        },
        checkNoteProgress(note, column) {
            const totalItems = note.items.length;
            const completedItems = note.items.filter(item => item.completed).length;
            const progress = (completedItems / totalItems) * 100;

            if (progress > 50 && column === 'todo') {
                this.moveNote(note.id, 'todo', 'inProgress');
            } else if (progress === 100 && column === 'inProgress') {
                note.completedDate = new Date().toLocaleString();
                this.moveNote(note.id, 'inProgress', 'completed');
            }
        },
        moveNote(noteId, fromColumn, toColumn) {
            const noteIndex = this.columns[fromColumn].findIndex(note => note.id === noteId);
            if (noteIndex !== -1) {
                const note = this.columns[fromColumn].splice(noteIndex, 1)[0];
                this.columns[toColumn].push(note);
            }
        }
    }
});