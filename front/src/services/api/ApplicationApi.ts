import axios from "@/api/axios";
import { config } from "../../../config";

export class ApplicationApi {
    static async getApplications(get: string,userId:number | undefined
    ) {
        const params = {
           get: get,
           userId: userId,
          };
        const res = await axios.get(`${config.service}/applications`,{params});
        return res.data;
    }
    static async addApplication(newApplication: any,isAdd:string | boolean,userId: number | undefined) {
        const params = {
            isAdd: isAdd,
            userId: userId
           };
        const res = await axios.post(
            `${config.service}/applications`,newApplication,{params}
        );
        return res.data;
    }
    static async updateApplication(applicationId: number, updatedData: any) {
        const res = await axios.put(
            `${config.service}/applications/${applicationId}`,
            updatedData
        );
        return res.data;
    }

    static async deleteApplication(id: number) {
        const res = await axios.delete(`${config.service}/applications/${id}`);
        return res.data;
    }

    static async getApplicationByClientId(clientId: string) {
        const res = await axios.get(
            `${config.service}/applications/get/${clientId}`
        );
        return res.data;
    }

    static async getUserId(id: number) {
        const res = await axios.get(
            `${config.service}/applications/users/${id}`
        );
        return res.data;
    }
}
