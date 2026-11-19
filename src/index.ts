import { randomInt } from "crypto";
class User {
    private notebooks: NoteBook[] = [];   // [Q5 - Aggregation]

    constructor(
        public userId: number,
        public userName: string,
        public userEmail: string,
        private userPassword: string,
        protected userAge: number,
        protected userPhone: string
    ) {
        if (userAge < 18 || userAge > 60) {
            throw new Error("Invalid user age");
        }
    }

    public displayInfo(): void {
        console.log(`User name is ${this.userName} with id ${this.userId} and email ${this.userEmail} and phone ${this.userPhone} and age ${this.userAge}`);
    }

    //user can add notebooks or add note or get his notebooks
    public addNotebook(notebook: NoteBook): void {
        this.notebooks.push(notebook);
    }

    public getNotebooks(): NoteBook[] {
        return [...this.notebooks];
    }

    public addNote(notebook: NoteBook, title: string, content: string): Note {
        return notebook.addNote(title, content, this);
    }
}

// [Q2 - Inheritance]
class Admin extends User {
    constructor(
        userId: number,
        userName: string,
        userEmail: string,
        userPassword: string,
        userAge: number,
        userPhone: string
    ) {
        super(userId, userName, userEmail, userPassword, userAge, userPhone);
    }
    //admin can delete note or add note or view all notes for all users
    public deleteNote(notebook: NoteBook, noteId: number): boolean {
        const removed = notebook.removeNote(noteId);
        if (removed===true) {
            console.log(`Note ${noteId} deleted by admin ${this.userName}`);
        }
        return removed;
    }

    public viewAllNotes(notebook: NoteBook): void {
        notebook.getNotes().forEach(note => {
            console.log(`Note ${note.noteId} contains ${note.noteContent} is created by ${note.author.userName} `);
        });
    }
}

class Note {
    public userId: number;   // [Q3]

    constructor(
        public noteId: number,
        public noteTitle: string,
        public noteContent: string,
        public author: User   // [Q6 - Association]
    ) {
        this.userId = author.userId;
    }

    public preview(): string {
        if (this.noteContent.length <= 20) {
            return this.noteContent;
        }
        return this.noteContent.substring(0, 20) + "...";
    }
}

// [Q4 - Composition]
class NoteBook {
    private notes: Note[] = [];   // الـ NoteBook هو اللي يملك الـ notes

    constructor(public title: string) {}
    public addNote(title: string, content: string, author: User): Note {
        const id = randomInt(1, 1000000);
        const note = new Note(id, title, content, author);
        this.notes.push(note);
        return note;
    }

    public removeNote(noteId: number): boolean {
        const index = this.notes.findIndex((n) => n.noteId === noteId);
        if (index === -1) {
            console.log("Note not found.");
            return false;
        }
        this.notes.splice(index, 1);
        return true;
    }

    public getNotes(): Note[] {
        return [...this.notes];
    }
}

// [Q7 - Generics]
class Storage<Type> {
    private items: Type[] = [];

    public addItem(item: Type): void {
        this.items.push(item);
    }

    public removeItem(item: Type): boolean {
        const index = this.items.indexOf(item);
        if (index === -1) return false;
        this.items.splice(index, 1);
        return true;
    }

    public getAllItems(): Type[] {
        return [...this.items];
    }
}

// ===== Test =====
const user1 = new User(1, "Arwa", "arwa@gmail.com", "secret123", 25, "54565565")
const user2 = new User(1, "Eman", "eman@gmail.com", "6546565vs", 25, "215432569");

const admin = new Admin(100, "Ahmed", "ahmed@gmail.com", "admin123", 35, "5656596596596");
const admin2 = new Admin(100, "emad", "emad@gmail.com", "admin123", 35, "5656596596596");

const personal = new NoteBook("Personal");
user1.addNotebook(personal); //add notebook with user

const work = user2.addNote(personal, "Work", "task1");
user1.addNote(personal, "Todo", "authentication"); //add note with user

admin.viewAllNotes(personal); //view all notes of users
admin.deleteNote(personal, work.noteId); //delete note of work with admin Ahmed
admin.viewAllNotes(personal); //notes after delete
//Note with User Association ==> user just know who write note.
//User with Notebook Aggregation ==> User own notebook, but we can deal with it as a separated object.
//Note with Notebook Composition ==> Notebook own Note, and we cannot deal with it as a separated object.
