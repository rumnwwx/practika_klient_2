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
        },
        columnLimits: {
            todo: 3,
            inProgress: 5,
            completed: Infinity,
        },
        isTodoLocked: false,
        waitingNoteId: null,
    },
    created() {
        const savedData = localStorage.getItem('noteAppData');
        if (savedData) {
            this.columns = JSON.parse(savedData);
        }
    },
    watch: {
        columns: {
            handler() {
                localStorage.setItem('noteAppData', JSON.stringify(this.columns));
            },
            deep: true
        }
    },
    methods: {
        addNote(column) {
            if (this.isTodoLocked && column === 'todo') {
                alert('Добавление карточек в "Начато" временно заблокировано.');
                return;
            }

            if (
                this.newNote.title.trim() === '' ||
                this.newNote.items.some(item => item.trim() === '') ||
                this.newNote.items.length < 3 ||
                this.newNote.items.length > 5
            ) {
                alert('Заполните все поля (от 3 до 5 подзадач)!');
                return;
            }

            if (this.columns[column].length >= this.columnLimits[column]) {
                alert(`Лимит карточек для "${this.columnTitles[column]}" достигнут.`);
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

            if (column === 'todo') {
                if (progress === 100) {
                    note.completedDate = new Date().toLocaleString();
                    this.moveNote(note.id, 'todo', 'completed');
                } else if (progress > 50) {
                    if (this.columns.inProgress.length >= this.columnLimits.inProgress) {
                        this.isTodoLocked = true;
                        this.waitingNoteId = note.id;
                        alert('Столбец "К работе" переполнен. Заметка будет перенесена, когда появится место.');
                    } else {
                        this.moveNote(note.id, 'todo', 'inProgress');
                    }
                }
            }

            if (column === 'inProgress' && progress === 100) {
                note.completedDate = new Date().toLocaleString();
                this.moveNote(note.id, 'inProgress', 'completed');

                if (this.waitingNoteId) {
                    const waitingNote = this.columns.todo.find(n => n.id === this.waitingNoteId);
                    if (waitingNote) {
                        this.moveNote(this.waitingNoteId, 'todo', 'inProgress');
                    }
                    this.waitingNoteId = null;
                }

                this.isTodoLocked = false;
            }
        },
        moveNote(noteId, fromColumn, toColumn) {
            const noteIndex = this.columns[fromColumn].findIndex(note => note.id === noteId);
            if (noteIndex !== -1) {
                if (this.columns[toColumn].length >= this.columnLimits[toColumn]) {
                    alert(`Невозможно переместить карточку в "${this.columnTitles[toColumn]}" — лимит достигнут.`);
                    return;
                }

                const note = this.columns[fromColumn].splice(noteIndex, 1)[0];
                this.columns[toColumn].push(note);
            }
        }
    }
});
