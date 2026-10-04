import "server-only";
import axios from "axios";
import https from "https";
import { cookies } from "next/headers";

const baseUrls = {
  identity: process.env.IDENTITY_URL,
  emtCore: process.env.EMT_CORE_URL,
};

const devHttpsAgent =
  process.env.NODE_ENV !== "production"
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

export const createHttpClient = (service: keyof typeof baseUrls) => {
  const baseURL = baseUrls[service];
  if (!baseURL) {
    throw new Error(`Missing base URL for "${service}" (check .env)`);
  }

  return axios.create({
    httpsAgent: devHttpsAgent,
    timeout: 5000,
    withCredentials: true,
    baseURL: baseURL,
  });
};

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}
