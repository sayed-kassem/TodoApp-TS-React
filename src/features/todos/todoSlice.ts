import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    userId: string;
}


interface TodoState {
    todos: Todo[];
    loading: boolean;
}

const initialState: TodoState = {
    todos: [],
    loading: false,
};


export const fetchTodos = createAsyncThunk("todos/fetch", async (userId: string) =>{
    const querySnapshot = await getDocs(collection(db, "todos"));
    const data : Todo[] = [];
    querySnapshot.forEach((docSnap)=>{
        const todo = docSnap.data() as Todo;
        if(todo.userId === userId){
            data.push({...todo, id: docSnap.id});
        }
    });
    return data;
})


export const addTodoToDB = createAsyncThunk(
    "todos/add",
    async ({ text, userId }: { text: string; userId: string }) => {
      const docRef = await addDoc(collection(db, "todos"), {
        text,
        completed: false,
        userId,
      });
      return { id: docRef.id, text, completed: false, userId };
    }
  );
  

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


export const editTodoInDB = createAsyncThunk("todos/edit", async ({id, text} : {id: string, text: string}) =>{
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {text});
    return {id, text};
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
        .addCase(addTodoToDB.fulfilled, (state, action) => {
            state.todos.push(action.payload);
        })
        .addCase(toggleTodoDB.fulfilled, (state, action) => {
            const todo = state.todos.find(t => t.id === action.payload);
            if(todo) todo.completed = !todo.completed;
        })
        .addCase(deleteTodoDB.fulfilled, (state, action) => {
            state.todos = state.todos.filter(t => t.id !== action.payload);
        })
        .addCase(editTodoInDB.fulfilled, (state,action) => {
            const {id, text} = action.payload;
            const todo = state.todos.find(t => t.id === id);
            if(todo) todo.text = text;
        })

    }
});


// export const {addTodo, toggleTodo, removeTodo} = todoSlice.actions;
export default todoSlice.reducer;