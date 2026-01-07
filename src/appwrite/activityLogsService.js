import { Client, Databases, Query } from "appwrite";
import {ID} from "appwrite";
import conf from "../conf/conf";

class ActivityLogsService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteApiEndpoint)
            .setProject(conf.appwriteProjectId)

        this.databases = new Databases(this.client);
    }

    async addPost({ userId, title, content,date}) {
        try {
            const response = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteActivityLogsCollectionId,
                ID.unique(),
                {
                    title,
                    userId,
                    content,
                    createdDate:date
                }
            )
            return response;
        } catch (error) {
            console.log("Appwrite serive :: addPost :: error", error);
        }
    }

    async removePost(postId){
        try {
            const response = await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteActivityLogsCollectionId,
                postId
            )
            return response;
        } catch (error) {
            console.log("Appwrite serive :: removePost :: error", error);
        }
    }

    async getPosts(userId){
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteActivityLogsCollectionId,
                [Query.equal("userId", userId)]
            )
            return response || [];
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
        }
    }

    async updatePost({postId,userId, title, content,date}){
        try {
            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteActivityLogsCollectionId,
                postId,
                {
                    userId,
                    title,
                    content,
                    createdDate:date,
                }
            )
            return response;
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

}

const activityLogsService = new ActivityLogsService();
export default activityLogsService;
