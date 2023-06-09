import Client from "../client/client";
import {formatISO} from 'date-fns';

export const getMeasurementsByGateway = (id, dateFrom, dateTo, granularity = 5) =>
  Client({
    url: `measurement/gateway/${id}`,
    params: {
      dateFrom: formatISO(dateFrom),
      dateTo: formatISO(dateTo),
      granularity,
    },
  });
