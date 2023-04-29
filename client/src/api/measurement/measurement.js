import Client from "../client/client";

export const getMeasurementsByGateway = (id, dateFrom, dateTo, granularity) =>
  Client({
    url: `measurement/gateway/${id}`,
    params: {
      dateFrom,
      dateTo,
      granularity,
    },
  });
