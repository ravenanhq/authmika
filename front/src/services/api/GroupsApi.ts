import { config } from "../../../config";
import axios from "@/api/axios";

export class GroupsApi {
  static async addGroupApi(newGroup: any,isCreate:string | boolean,userId: number | undefined) {
    const params = {
      isCreate: isCreate,
      userId: userId,
    };

    const res = await axios.post(`${config.service}/groups`, newGroup,{params});
    return res.data;
  }

  static async getAllGroupsApi(get:string,userId:number | undefined) {
    const params = {
      get: get,
      userId: userId,
    };

    const res = await axios.get(`${config.service}/groups`,{params});
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
