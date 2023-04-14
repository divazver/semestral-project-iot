/*
 * function to calculate downsampled data from the original data
 * @param {Array} data - The list of n (n is arbitrary large) temperature & humidity values passed as an Array of Objects [{temperature: number, humidity: number}, ...]
 * @returns {Array} downsampledData - The list of k temperature & humidity values returned as an Array of Objects [{temperature: number, humidity: number}, ...]
 * where k < n
 */

export function downsampling(data, k) {
    const n = data.length;
    if (n < k) {
        throw new Error("Can't downsample data to a larger dataset!")
    }
    // there will be k elements in the final Array k pivots must be calculated
    const step = n / k;
    // array of pivots to split the original Array into k intervals
    const pivots = [];
    // computing pivots of the dataset
    for (let i = 1; i <= k; i++) {
        pivots.push(Math.floor(i * step));
    }
    // extracting temperatures and humidities from the objects
    const temperatures = data.map(obj => obj.temperature);
    const humidities = data.map(obj => obj.humidity);

    // array to store the means of temperature and humidity in
    const meansTemperature = [];
    const meansHumidity = [];

    // temporary values for the loop
    let sumTemperatures = 0;
    let sumHumidities = 0;
    let count = 0;
    
    // loop iterating through all n values, computing means of deciles
    for (let i = 0; i < n; i++) {
        // pivot = breakpoint --> new mean will be calculated
        if (pivots.includes(i + 1)) {
            // means calculated + pushed to the arrays
            meansTemperature.push(sumTemperatures / count);
            meansHumidity.push(sumHumidities / count);
            // temporary values have to be updated to the current iterated value, not to zero!
            sumTemperatures = temperatures[i];
            sumHumidities = humidities[i];
            count = 1;
        }
        // otherwise simple update of values
        else {
            sumTemperatures += temperatures[i];
            sumHumidities += humidities[i];
            count++;
        }
    }
    
    // storing all data into an object, that will be returned
    const downsampledData = meansTemperature.map((mean, index) => ({
        temperature: mean,
        humidity: meansHumidity[index]
      }));
      
    return downsampledData;
}