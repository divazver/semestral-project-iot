import Client from "../client/client";

export const getGateway = (id) =>
  Client({
    url: `gateway/${id}`,
  });

export const getAllGateways = () =>
  Client({
    url: `gateways`,
  });
