import serverless from "serverless-http";
import { appPromise } from "../../server";

export const handler = async (event: any, context: any) => {
  const app = await appPromise;
  return serverless(app)(event, context);
};
