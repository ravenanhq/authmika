import { config } from "../../../config";
import axios from "@/api/axios";

export class RolesApi {
  static async addRoleApi(newRole: any) {
    const res = await axios.post(`${config.service}/roles`, newRole);
    return res.data;
  }

  static async getAllRoleApi() {
    const res = await axios.get(`${config.service}/roles`);
    return res.data;
  }

  static async deleteRoleApi(id: number) {
    const res = await axios.delete(`${config.service}/roles/${id}`);
    return res.data;
  }

  static async updateRoleApi(id: number, updatedData: any) {
    const res = await axios.put(`${config.service}/roles/${id}`, updatedData);
    return res.data;
  }

  static async getUsers(id: number) {
    const res = await axios.put(`${config.service}/roles/users/${id}`);
    return res.data;
  }
}
