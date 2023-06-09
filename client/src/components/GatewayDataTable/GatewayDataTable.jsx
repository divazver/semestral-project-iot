import React from "react";
import {format, parseISO} from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import {Box} from "@mui/material";

const columns = [
  { field: 'id', headerName: 'Date', width: 150 },
  {
    field: 'temperature',
    headerName: 'Temperature',
    width: 150,
    editable: false,
  },
  {
    field: 'humidity',
    headerName: 'Humidity',
    width: 110,
    editable: false,
  },
];

const GatewayDataTable = ({measurements}) => {

  const rows = measurements.map((measurement) => ({
    id: format(parseISO(measurement?.time), 'HH:mm dd.LL.yyyy'),
    temperature: `${measurement?.temperature.toFixed(1)}°`,
    humidity: `${measurement?.humidity.toFixed(2)}%`,
  }))

  return <Box sx={{width: '100%', height: 550}}>
    <DataGrid
      rowSelection={false}
      rows={rows}
      columns={columns}
      bulkActionButtons={false}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 15,
          },
        },
      }}
      pageSizeOptions={[15]}
      disableRowSelectionOnClick
    />
  </Box>
}

export default GatewayDataTable;
