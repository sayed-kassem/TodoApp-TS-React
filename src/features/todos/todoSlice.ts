import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}


interface TodoState {
    todos: Todo[];
    loading: boolean;
}

const initialState: TodoState = {
    todos: [],
    loading: false,
};


export const fetchTodos = createAsyncThunk("todos/fetch", async () =>{
    const querySnapshot = await getDocs(collection(db, "todos"));
    const data : Todo[] = [];
    querySnapshot.forEach((docSnap)=>{
        data.push({...(docSnap.data() as Todo), id: docSnap.id});
    });
    return data;
})


export const addTodoDB = createAsyncThunk("todos/add", async (text: string) => {
    const docRef = await addDoc(collection(db, "todos"), {
        text,
        completed: false,
    });
    return {id: docRef.id, text, completed: false};
})

export const toggleTodoDB = createAsyncThunk("todos/toggle", async ({id, completed}: {id: string; completed:boolean}) => {
    await updateDoc(doc(db, "todos", id), {
        completed: !completed,
    });
    return id;
});


export const deleteTodoDB = createAsyncThunk("todos/delete", async(id:string)=>{
    await deleteDoc(doc(db, "todos", id));
    return id;
})

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        // addTodo(state, action: PayloadAction<Todo>) {
        //     state.todos.push(action.payload);
        // },
        // toggleTodo(state, action: PayloadAction<string>) {
        //     const todo = state.todos.find(t => t.id === action.payload);
        //     if(todo) todo.completed = !todo.completed;
        // },
        // removeTodo(state, action: PayloadAction<string>) {
        //     state.todos = state.todos.filter(t =>t.id !== action.payload);
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodos.fulfilled, (state, actions) => {
            state.todos = actions.payload;
            state.loading = false;
        })
        .addCase(fetchTodos.pending, (state) => {
            state.loading = true;
        })
        .addCase(addTodoDB.fulfilled, (state, action) => {
            state.todos.push(action.payload);
        })
        .addCase(toggleTodoDB.fulfilled, (state, action) => {
            const todo = state.todos.find(t => t.id === action.payload);
            if(todo) todo.completed = !todo.completed;
        })
        .addCase(deleteTodoDB.fulfilled, (state, action) => {
            state.todos = state.todos.filter(t => t.id !== action.payload);
        })

    }
});


// export const {addTodo, toggleTodo, removeTodo} = todoSlice.actions;
export default todoSlice.reducer;