import axios from "axios";
import { config } from "../../../config";

export class DashboardApi {
  static async getApplicationsByUserId(userId: number) {
    const res = await axios.post(
      `${config.service}/user-applications/get-user-applications`,
      userId ? { userId } : {}
    );
    return res.data;
  }
}
