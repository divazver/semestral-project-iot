/*¨
* 1) vytvořit objekt Downsampling nad dateFrom - dateTo z FE, pokud granularita > 1 min
* 2) zavolat metodu downsamplingTimeTransformation --> return value od - do Date objects na dotaz v DB
* 3) dotaz v DB --> return value  interval x hodnot
* 4) zavolat metodu downsamping s daty z DB
* 5) poslat na FE
*/
export class Downsampling {
    // dateFrom, dateTo and granularity are needed
    constructor(dateFrom, dateTo, granularity) {
        this.dateFrom = new Date(dateFrom);
        this.dateTo = new Date(dateTo);
        // min to ms
        this.granularity = granularity * 60 * 1000;

        // attribute used for downsampling function
        this.datapoints = null;

        // array of calculated datapoints, descriptions
        this.datapointsArray = [];
        this.descriptionsArray = [];

        // merging of datapoints & descriptions - final output
        this.completedWeatherData = [];
    }


    /*
    * method to calculate downsampled data from the original data
    * @param {Array} data - The list of n (n is arbitrary large) temperature & humidity values passed as an Array of Objects [{temperature: number, humidity: number}, ...]
    * @returns {Array} downsampledData - The list of k temperature & humidity values returned as an Array of Objects [{temperature: number, humidity: number}, ...]
    * where k < n AND k = this.datapoints
    */
    downsampling(data) {
        const n = data.length;
        if (n < this.datapoints) {
            throw new Error("Can't downsample data to a larger dataset!")
        }
        // there will be k elements in the final Array k pivots must be calculated
        const step = n / this.datapoints;
        // array of pivots to split the original Array into k intervals
        const pivots = [];
        // computing pivots of the dataset
        // starting with 2, because the first "pivot"- datapoint - will be the first DB entry
        for (let i = 2; i <= this.datapoints; i++) {
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
        this.datapointsArray = meansTemperature.map((mean, index) => ({
            temperature: mean,
            humidity: meansHumidity[index]
          }));

        // creating compound objects
        for (let i = 0; i < this.datapointsArray.length; i++) {
        let obj = {
            temperature: this.datapointsArray[i].temperature,
            humidity: this.datapointsArray[i].humidity,
            description: new Date(this.descriptionsArray[i])
        };
        this.completedWeatherData.push(obj);
        }
        return this.completedWeatherData;
    
    }



    // in case the granularity is set to >1minute, data must be downsampled
    // beforehand the date from - to information has to be converted to the inputs of the downsampling function
    // this is the method to do it
    downsamplingTimeTransformation() {
        let fiveMinutes = 5 * 60 * 1000;
        // dateFrom must be ceiled, so that the graph starts with an existing datapoint
        let dateFromCeiled = new Date(Math.ceil(this.dateFrom.getTime() / fiveMinutes) * fiveMinutes);
        // calculating timestamps (so that it doesn't have to be done every iteration)
        let dateFromCeiledTimestamp = dateFromCeiled.getTime();
        let dateToTimestamp = this.dateTo.getTime();
        let dateToFloored;
        // we want to "floor" dateTo, but not to the closest 5-min interval - it has to take granularity into account
        while (dateFromCeiledTimestamp < dateToTimestamp) {
            // every iteration timestamp is pushed into descriptions
            this.descriptionsArray.push(new Date(dateFromCeiledTimestamp));
            // number of datapoints is increased
            this.datapoints++;
            // dateToFloored (final output) is updated
            dateToFloored = dateFromCeiledTimestamp;
            // chosen granularity is added
            dateFromCeiledTimestamp += this.granularity;
        }

        return([dateFromCeiled, dateToFloored])

    }
    
}