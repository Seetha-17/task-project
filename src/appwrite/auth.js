import {Client,Account,ID} from "appwrite"
import conf from "../conf/conf"

class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
        .setEndpoint(conf.appwriteApiEndpoint)
        .setProject(conf.appwriteProjectId)

        this.account = new Account(this.client);
    }

    async createAccount({email,password,name}){
        try {
            const userAccount = await this.account.create(ID.unique(),email,password,name);
            if(userAccount){
                this.login({email,password});
                return userAccount;
            }
        } catch (error) {
            throw error
        }
    }

    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password)
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error", error);
            if (error.code === 401) {
                // Unauthenticated user
                return null;
            }
            throw error; // Re-throw for other unexpected errors
        }
    }
    

    async logout(){
        try {
           await this.account.deleteSession("current")
        } catch (error) {
            console.error("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();
export default authService;