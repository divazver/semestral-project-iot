// function for solving LSE
import {solveLinearSystem} from './solve-lse.js'

/*
 * function to calculate upsampled data from downsampled data
 * @param {Array} downsampledData - The list of 5 temperature & humidity values passed as an Array of Objects [{temperature: number, humidity: number}, ...]
 * | - - - - | - - - - | - - - - | - - - - |
 * 0 min     5 min    10 min    15 min    20 min
 * @returns {Array} upsampledData - The list of 11 temperature & humidity values passed as an Array of Objects [{temperature: number, humidity: number}, ...] covering the "second half" of the time inputed
 * - - - - - - - - - - | | | | | | | | | | |
 *                    10 min              20 min
 */
export function upsampling(downsampledData) {
    // checking if the input data is valid (array of length 5)
    if (!Array.isArray(downsampledData) || downsampledData.length !== 5) {
        throw new Error('Invalid parameter: must be an Array of 5 values');
    }
    // extracting two lists of data - humidity and temperature
    const temperatures = downsampledData.map(obj => obj.temperature);
    const humidities = downsampledData.map(obj => obj.humidity);

    // creating two Arrays for two function calls (will be modified)
    const A1 = []
    const A2 = []

    /* 
    creating matrices for LSE
        [ 1    1    1   1  1 ] 
        [ 16   8    4   2  1 ]
        [ 81   27   9   3  1 ]
        [ 256  64   16  4  1 ]
        [ 625  125  25  5  1 ]
    */
    for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 4; j >= 0; j--) {
          row.push(Math.pow(i + 1, j));
        }
        A1.push(row);
        // shallow copy
        A2.push([...row])
      }      

    // using polynomial interpolation of 4th degree to get coeficients of the temperature/humidity curve
    const [a, b, c, d, e] = solveLinearSystem(A1, temperatures);
    const [f, g, h, i, j] = solveLinearSystem(A2, humidities);

    // lists to store the upsampled values that will be further used
    const upsampledTemperatures = [];
    const upsampledHumidities = [];

    // calculating upsampled data - x-coordinates 3.0, 3.2, 3.4 ... 4.8, 5.0 of the curve => 11 values
    for (let q = 3.0; q <= 5.1; q += 0.2) {
        upsampledTemperatures.push(a * q ** 4 + b * q ** 3 + c * q ** 2 + d * q + e);
        upsampledHumidities.push(f * q ** 4 + g * q ** 3 + h * q ** 2 + i * q + j);
    }

    // storing all data into an object, that will be returned
    const upsampledData = upsampledTemperatures.map((temp, index) => ({
        temperature: temp,
        humidity: upsampledHumidities[index]
    }));

    return upsampledData;
}
