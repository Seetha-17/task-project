import { Client, Databases, Query } from "appwrite";
import {ID} from "appwrite";
import conf from "../conf/conf";

class TodoService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteApiEndpoint)
            .setProject(conf.appwriteProjectId)

        this.databases = new Databases(this.client);
    }

    async addTodo({ userId, todo, isCompleted }) {
        try {
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTodosCollectionId,
                ID.unique(),
                {
                    userId,
                    todo,
                    isCompleted,
                }
            )
            return response;
        } catch (error) {
            console.log("Appwrite serive :: addTodo :: error", error);
        }
    }

    async removeTodo(todoId){
        try {
            const response = await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTodosCollectionId,
                todoId
            )
            return response;
        } catch (error) {
            console.log("Appwrite serive :: removeTodo :: error", error);
        }
    }

    async getTodos(userId){
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteTodosCollectionId,
                [Query.equal("userId", userId)]
            )
            return response || [];
        } catch (error) {
            console.log("Appwrite serive :: removeTodo :: error", error);
            return [];
        }
    }

    async updateTodoStatus(todoId, isCompleted){
        try {
            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTodosCollectionId,
                todoId,
                {
                    isCompleted
                }
            )
            return response;
        } catch (error) {
            console.log("Appwrite serive :: updateTodoStatus :: error", error);
        }
    }

    async updateTodo(todoId,todoText){
        try {
            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteTodosCollectionId,
                todoId,
                {
                    todo:todoText
                }
            )
            return response;
        } catch (error) {
            console.log("Appwrite serive :: updateTodo :: error", error);
            
        }
    }


}

const todoService = new TodoService();
export default todoService;