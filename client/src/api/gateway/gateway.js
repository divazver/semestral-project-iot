import Client from "../client/client";

export const getGateway = (id) =>
  Client({
    url: `gateway/${id}`,
  });

export const getAllGateways = () =>
  Client({
    url: `gateways`,
  });

export const deleteGateway = (id) =>
  Client({
    url: `gateway/${id}`,
    method: 'DELETE',
  });

  export const createGateway = (name) =>
    Client({
      url: `gateway`,
      method: 'POST',
      data: {
        name},
    });
