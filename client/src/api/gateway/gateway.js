import Client from "../client/client";

export const getAllGateways = () =>
  Client({
    url: `gateways`,
  });
