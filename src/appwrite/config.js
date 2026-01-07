import { Client, Databases, Query } from "appwrite";
import conf from "../conf/conf";
import { useSelector } from 'react-redux';

class GraphDataService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteApiEndpoint)
            .setProject(conf.appwriteProjectId)

        this.databases = new Databases(this.client);
    }

    async saveGraphData({ userId, studyHours, date, compositeKey }) {
        try {
            const existingDocuments = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal("compositeKey",compositeKey)
                ]
            )

            if (existingDocuments.total > 0) {
                const existingDocument = existingDocuments.documents[0];
                const updatedDocument = await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    existingDocument.$id,
                    { studyHours },
                )
                return updatedDocument;
            } else {
                const response = await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    compositeKey,
                    {
                        userId,
                        studyHours,
                        date,
                        compositeKey,
                    }
                )
                return response;
            }


        } catch (error) {
            console.log("Appwrite serive :: createPost/updatePost :: error", error);
        }
    }

    async getStudyHoursAndDate(userId) {
        try {
            const allDocuments = [];
            let hasMore = true; // Flag to track if there are more documents to fetch
            let offset = 0; // Start offset
            
            while (hasMore) {
                const response = await this.databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    [
                        Query.equal("userId", userId),
                        Query.limit(100), // Fetch up to 100 documents in one request
                        Query.offset(offset), // Skip already fetched documents
                    ]
                );
    
                // Add fetched documents to the result array
                allDocuments.push(...response.documents);
    
                // Update offset for the next batch
                offset += response.documents.length;
    
                // Check if we need to fetch more documents
                hasMore = response.documents.length === 100;
            }
    
            // Map the results to desired format
            const hoursAndDate = allDocuments.map((document) => ({
                studyHours: document.studyHours,
                date: document.date,
            }));
    
            console.log(hoursAndDate);
            return hoursAndDate || [];
        } catch (error) {
            console.log("Appwrite service :: getAllStudyHoursAndDate :: error", error);
            return [];
        }
    }
    
    
}

const graphService = new GraphDataService();
export default graphService;