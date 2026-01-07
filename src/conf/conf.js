const conf = {
    appwriteApiEndpoint:String(import.meta.env.VITE_APPWRITE_API_ENDPOINT),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteTodosCollectionId:String(import.meta.env.VITE_APPWRITE_TODOS_DATA_COLLECTION_ID),
    appwriteActivityLogsCollectionId:String(import.meta.env.VITE_APPWRITE_ACTIVITY_LOGS_COLLECTION_ID),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default conf;