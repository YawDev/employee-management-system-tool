import { AxiosError, AxiosHeaders } from "axios";
import { createHttpClient, getAuthHeaders } from "@/lib/data/client";
import { getOrganizationById } from "@/lib/data/core/organizations";

jest.mock("@/lib/data/client", () => ({
  createHttpClient: jest.fn(),
  getAuthHeaders: jest.fn(),
}));

const get = jest.fn();
const auth = { Authorization: "Bearer token" };

const httpError = (status: number) =>
  new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    status,
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: {},
  });

beforeEach(() => {
  jest.clearAllMocks();
  (createHttpClient as jest.Mock).mockReturnValue({ get });
  (getAuthHeaders as jest.Mock).mockResolvedValue(auth);
});

describe("getOrganizationById", () => {
  it("calls get-organization-info and unwraps the organization", async () => {
    const organization = { organizationId: 5, name: "Acme Retail" };
    get.mockResolvedValue({ data: { organization } });

    const result = await getOrganizationById(5);

    expect(createHttpClient).toHaveBeenCalledWith("emtCore");
    expect(get).toHaveBeenCalledWith("/sys-api/get-organization-info/5", { headers: auth });
    expect(result).toEqual(organization);
  });

  it("returns undefined when the organization doesn't exist", async () => {
    get.mockRejectedValue(httpError(404));

    expect(await getOrganizationById(99)).toBeUndefined();
  });

  it("rethrows other errors", async () => {
    get.mockRejectedValue(httpError(500));

    await expect(getOrganizationById(5)).rejects.toThrow("Request failed");
  });
});
