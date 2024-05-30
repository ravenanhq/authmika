import { config } from "../../../config";
import axios from "@/api/axios";

export class RolesApi {
  static async addRoleApi(id: number, newRole: any) {
    const res = await axios.post(`${config.service}/roles/${id}`, newRole);
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

  static async updateRole() {
    const res = await axios.get(`${config.service}/roles/get-active-roles`);
    return res.data;
  }
}
