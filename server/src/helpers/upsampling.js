// function for solving LSE
import {solveLinearSystem} from './solve-lse.js'

/*
 * function to calculate upsampled data from downsampled data
 * @param {Array} downsampledData - The list of 8 temperature & 8 humidity values passed as an Array of Objects [{temperature: number, humidity: number}, ...]
 * covering the longest possible interval with 1 minute granularity - 30 min - starting at any index <0, 4>
 * 
 * | - - - - | - - - - | - - - - | - - - - | - - - - | - - - - | - - - - |
 * 0 min     5 min    10 min    15 min    20 min    25 min    30 min    35 min
 * 
 * 
 *                                                                                  "x" = datapoint input - every 5 minutes
 *                                                           /-x---------x          "-", "/", "\" - polynomial representation
 *      -----x---------x------                    /-x--------
 *     /                      \--x---------x------    
 * x--/
 * 
 * _______________________________________________________________________   x-Axe
 * 1         2         3         4         5         6         7         8
 * 
 * @param {int} index - "index" of the first minute, that should be calculated <0, 34> indexing starts with 1 (better for further calculations)
 * 
 * @param {int} datapoints - number of data points, that should be calculated starting with index, where index + datapoints <= 36 AND 2 <= k <= 30
 * 
 * @returns {Array} upsampledData - The list of n temperature & humidity values passed as an Array of Objects [{temperature: number, humidity: number}, ...] covering the interval
 * 
 */
export function upsampling(downsampledData, index, datapoints) {
    // checking if the input data is valid (array of length 8)
    if (!Array.isArray(downsampledData) || downsampledData.length !== 8) {
        throw new Error('Invalid parameter "downsampledData: must be an Array of 8 values');
    }
    // checking, if the number of datapoints is correct
    if (datapoints < 2 || datapoints > 30) {
        throw new Error('Invalid parameter "datapoints": must be an integer between 2 and 30')
    }
    // checking, if the index won't be outside of calculated interval
    if (index + datapoints > 36) {
        throw new Error('Invalid parameters: indexed values are out of range')

    }  

    // extracting two lists of data - humidity and temperature
    const temperatures = downsampledData.map(obj => obj.temperature);
    const humidities = downsampledData.map(obj => obj.humidity);

    // creating two Arrays for two function calls (will be modified)
    const A1 = []
    const A2 = []

    /* 
    creating matrices for LSE
    */
    for (let i = 0; i < 8; i++) {
        const row = [];
        for (let j = 7; j >= 0; j--) {
          row.push(Math.pow(i + 1, j));
        }
        A1.push(row);
        // shallow copy
        A2.push([...row])
      }      

    // using polynomial interpolation of 7th degree to get coeficients of the temperature/humidity curve
    const [a, b, c, d, e, f, g, h] = solveLinearSystem(A1, temperatures);
    const [i, j, k, l, m, n, o, p] = solveLinearSystem(A2, humidities);

    // lists to store the upsampled values that will be further used
    const upsampledTemperatures = [];
    const upsampledHumidities = [];
    
    // 1 is the first datapoint on our curve (see graph)
    // one step = one minute = 1/5 = 0.2
    // step length * (number of steps - 1) --> first step is the datapoint x = 1
    const lowerBound = 1 + 0.2 * (index - 1)
    //lowerBound + the number of steps specified (1 subtracted - 1st datapoint already included) we need to take in order to get n values
    // +0.1 due to rounding error
    const upperBound = lowerBound + (datapoints - 1) * 0.2 + 0.1

    // calculating upsampled data - x-coordinates (index, index + 0.2, index + 0.4 ... index + datapoints * 0.2) of the curve => datapoint values
    for (let q = lowerBound; q <= upperBound; q += 0.2) {
        upsampledTemperatures.push(a * q ** 7 + b * q ** 6 + c * q ** 5 + d * q ** 4 + e * q ** 3 + f * q ** 2 + g * q + h);
        upsampledHumidities.push(i * q ** 7 + j * q ** 6 + k * q ** 5 + l * q ** 4 + m * q ** 3 + n * q ** 2 + o * q + p);
    }

    // storing all data into an object, that will be returned
    const upsampledData = upsampledTemperatures.map((temp, index) => ({
        temperature: temp,
        humidity: upsampledHumidities[index]
    }));

    return upsampledData;
}
