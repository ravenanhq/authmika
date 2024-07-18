import { config } from "../../../config";
import axios from "@/api/axios";

export class GroupsApi {
  static async addGroupApi(newGroup: any) {
    // const params = {
    //   isCreate: isCreate,
    //   userId: userId,
    // };

    const res = await axios.post(`${config.service}/groups`, newGroup);
    return res.data;
  }

  static async getAllGroupsApi() {
    // const params = {
    //   get: get,
    //   userId: userId,
    // };

    const res = await axios.get(`${config.service}/groups`);
    return res.data;
  }

  static async deleteGroupApi(id: number) {
    const res = await axios.delete(`${config.service}/groups/${id}`);
    return res.data;
  }

  static async updateGroupApi(id: number, updatedData: any) {
    const res = await axios.put(`${config.service}/groups/${id}`, updatedData);
    return res.data;
  }
}
