import { config } from "../../../config";
import axios from "@/api/axios";

export class RoleApi {
  static async addRoleApi(id: number, newRole: any) {
    const res = await axios.post(`${config.service}/role/${id}`, newRole);
    return res.data;
  }

  static async getAllRoleApi() {
    const res = await axios.get(`${config.service}/role`);
    return res.data;
  }

  static async deleteRoleApi(id: number) {
    const res = await axios.delete(`${config.service}/role/${id}`);
    return res.data;
  }

  static async updateRoleApi(id: number, updatedData: any) {
    const res = await axios.put(`${config.service}/role/${id}`, updatedData);
    return res.data;
  }

  static async updateRole() {
    const res = await axios.get(`${config.service}/role/get-active-roles`);
    return res.data;
  }
}
