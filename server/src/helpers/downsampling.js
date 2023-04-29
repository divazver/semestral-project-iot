// the date from - to information has to be converted to the inputs of the downsampling function
function downsamplingTimeTransformation(dateFrom, dateTo, granularity) {
    let fiveMinutes = 5 * 60 * 1000;
    let descriptionsArray = [];
    let datapoints = 0;
    granularity = granularity * 60 * 1000;
    // dateFrom must be ceiled, so that the graph starts with an existing datapoint
    let dateFromCeiled = new Date(Math.ceil(dateFrom.getTime() / fiveMinutes) * fiveMinutes);
    // calculating timestamps (so that it doesn't have to be done every iteration)
    let dateFromCeiledTimestamp = dateFromCeiled.getTime();
    let dateToTimestamp = dateTo.getTime();
    let dateToFloored;
    // we want to "floor" dateTo, but not to the closest 5-min interval - it has to take granularity into account
    while (dateFromCeiledTimestamp <= dateToTimestamp) {
        // every iteration timestamp is pushed into descriptions
        descriptionsArray.push(new Date(dateFromCeiledTimestamp));
        // number of datapoints is increased
        datapoints++;
        // dateToFloored (final output) is updated
        dateToFloored = new Date(dateFromCeiledTimestamp);
        // chosen granularity is added
        dateFromCeiledTimestamp += granularity;
    }

    return([dateFromCeiled, dateToFloored, datapoints, descriptionsArray])

}

/*
* method to calculate downsampled data from the original data
* @param {Array} data - The list of n (n is arbitrary large) temperature & humidity values passed as an Array of Objects [{temperature: number, humidity: number}, ...]
* @returns {Array} downsampledData - The list of k temperature & humidity values returned as an Array of Objects [{temperature: number, humidity: number}, ...]
* where k < n AND k = this.datapoints
*/
function downsampling(data, datapoints, descriptionsArray) {

    let completedWeatherData = [];
    const n = data.length;
    if (n < datapoints) {
        throw new Error("Can't downsample data to a larger dataset!")
    }
    // there will be k elements in the final Array k pivots must be calculated
    const step = n / datapoints;
    // array of pivots to split the original Array into k intervals
    const pivots = [];
    // computing pivots of the dataset
    // starting with 2, because the first "pivot"- datapoint - will be the first DB entry
    for (let i = 2; i <= datapoints; i++) {
        pivots.push(Math.floor(i * step));
    }
    // extracting temperatures and humidities from the objects
    const temperatures = data.map(obj => obj.temperature);
    const humidities = data.map(obj => obj.humidity);

    // array to store the means of temperature and humidity in- first element will be always the first datapoint
    const meansTemperature = [data[0].temperature];
    const meansHumidity = [data[0].humidity];

    // temporary values for the loop
    let sumTemperatures = 0;
    let sumHumidities = 0;
    let count = 0;
    
    // loop iterating through all n values, computing means of deciles
    for (let i = 0; i < n + 1; i++) {
        // pivot = breakpoint --> new mean will be calculated
        if (pivots.includes(i)) {
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
    let datapointsArray = meansTemperature.map((mean, index) => ({
        temperature: mean,
        humidity: meansHumidity[index]
      }));

    // creating compound objects
    for (let i = 0; i < datapointsArray.length; i++) {
    let obj = {
        temperature: datapointsArray[i].temperature,
        humidity: datapointsArray[i].humidity,
        description: new Date(descriptionsArray[i]).toISOString()
    };
    completedWeatherData.push(obj);
    }

    return completedWeatherData;
}