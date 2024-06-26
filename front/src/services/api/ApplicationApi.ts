import axios from "@/api/axios";
import { config } from "../../../config";

export class ApplicationApi {
    static async getApplications() {
        const res = await axios.get(`${config.service}/applications`);
        return res.data;
    }
    static async addApplication(newApplication: any) {
        const res = await axios.post(
            `${config.service}/applications`,
            newApplication
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
}
