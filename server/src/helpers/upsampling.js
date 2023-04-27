/*¨
* 1) vytvořit objekt Upsampling nad dateFrom - dateTo z FE, pokud granularita = 1 min
* 2) zavolat metodu upsamplingTimeTransformation --> return value od - do Date objects na dotaz v DB
* 3) dotaz v DB --> return value  interval osmi hodnot
* 4) zavolat metodu upsamping s daty z DB
* 5) poslat na FE
*/
export class Upsampling {
    // only dateFrom and dateTo are needed - granularity is automaticaly 1-minute
    constructor(dateFrom, dateTo) {
        this.dateFrom = new Date(dateFrom);
        this.dateTo = new Date(dateTo);

        // attributes used for upsampling function
        this.index = null;
        this.datapoints = null;

        // array of calculated datapoints, descriptions
        this.datapointsArray = [];
        this.descriptionsArray = [];

        // merging of datapoints & descriptions - final output
        this.completedWeatherData = [];
    }


    // helper method to create interpolation matrix of n degree
    createInterpolationMatrix(n) {
        let matrix = []
        for (let i = 0; i < n; i++) {
            const row = [];
            for (let j = n - 1; j >= 0; j--) {
            row.push(Math.pow(i + 1, j));
            }
            matrix.push(row);
        }
        return matrix;
    }

    // helper function to solve a LSE given matrix A and vector b
    solveLinearSystem(A, b) {
        // Check that the input is a valid system of linear equations
        if (!Array.isArray(A) || !Array.isArray(b) || A.length !== b.length) {
          throw new Error('Invalid input: A must be a matrix and b must be a vector!');
        }
      
        const n = A.length;
      
        // Forward elimination
        for (let i = 0; i < n; i++) {
          // Find the row with the largest absolute value in the ith column
          let maxRow = i;
          for (let j = i + 1; j < n; j++) {
            if (Math.abs(A[j][i]) > Math.abs(A[maxRow][i])) {
              maxRow = j;
            }
          }
          // Swap the ith row with the row with the largest absolute value in the ith column
          [A[i], A[maxRow]] = [A[maxRow], A[i]];
          [b[i], b[maxRow]] = [b[maxRow], b[i]];
          // Eliminate the ith column in the remaining rows
          for (let j = i + 1; j < n; j++) {
            const factor = A[j][i] / A[i][i];
            for (let k = i + 1; k < n; k++) {
              A[j][k] -= factor * A[i][k];
            }
            b[j] -= factor * b[i];
          }
        }
      
        // Back-substitute to solve for the unknowns
        const x = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
          let sum = 0;
          for (let j = i + 1; j < n; j++) {
            sum += A[i][j] * x[j];
          }
          x[i] = (b[i] - sum) / A[i][i];
        }
      
        return x;
      }
      

    /*
    * method to calculate upsampled data (granularity 1 minute)
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
    * @param {int} index - "index" of the first minute, that should be calculated <1, 34> indexing starts with 1 (better for further calculations)
    * 
    * @param {int} datapoints - number of data points, that should be calculated starting with index, where index + datapoints <= 36 AND 2 <= datapoints <= 30
    * 
    * @returns {Array} upsampledData - The list of n temperature & humidity values passed as an Array of Objects [{temperature: number, humidity: number}, ...] covering the interval
    * 
    */
    upsampling(downsampledData) {
        // checking if the input data is valid (array of length 8)
        if (!Array.isArray(downsampledData) || downsampledData.length !== 8) {
            throw new Error('Invalid parameter "downsampledData: must be an Array of 8 values');
        }
        // checking, if the number of datapoints is correct
        if (this.datapoints < 2 || this.datapoints > 30) {
            throw new Error('Invalid parameter "datapoints": must be an integer between 2 and 30')
        }
        // checking, if the index won't be outside of calculated interval
        if (this.index + this.datapoints > 37) {
            throw new Error('Invalid parameters: indexed values are out of range')
        }  

        // extracting two lists of data - humidity and temperature
        const temperatures = downsampledData.map(obj => obj.temperature);
        const humidities = downsampledData.map(obj => obj.humidity);

        // creating two Arrays for two function calls (will be modified)
        const A1 = this.createInterpolationMatrix(8);
        const A2 = this.createInterpolationMatrix(8);

        // using polynomial interpolation of 7th degree to get coeficients of the temperature/humidity curve
        const [a, b, c, d, e, f, g, h] = this.solveLinearSystem(A1, temperatures);
        const [i, j, k, l, m, n, o, p] = this.solveLinearSystem(A2, humidities);

        // lists to store the upsampled values that will be further used
        const upsampledTemperatures = [];
        const upsampledHumidities = [];
        
        // 1 is the first datapoint on our curve (see graph)
        // one step = one minute = 1/5 = 0.2
        // step length * (number of steps - 1) --> first step is the datapoint x = 1
        const lowerBound = 1 + 0.2 * (this.index - 1)
        //lowerBound + the number of steps specified (1 subtracted - 1st datapoint already included) we need to take in order to get n values
        // +0.1 due to rounding error
        const upperBound = lowerBound + (this.datapoints - 1) * 0.2 + 0.1

        // calculating upsampled data - x-coordinates (index, index + 0.2, index + 0.4 ... index + datapoints * 0.2) of the curve => datapoint values
        for (let q = lowerBound; q <= upperBound; q += 0.2) {
            upsampledTemperatures.push(a * q ** 7 + b * q ** 6 + c * q ** 5 + d * q ** 4 + e * q ** 3 + f * q ** 2 + g * q + h);
            upsampledHumidities.push(i * q ** 7 + j * q ** 6 + k * q ** 5 + l * q ** 4 + m * q ** 3 + n * q ** 2 + o * q + p);
        }

        // storing all data into datapoints array
        this.datapointsArray = upsampledTemperatures.map((temp, index) => ({
            temperature: temp,
            humidity: upsampledHumidities[index]
        }));

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

    // in case the granularity is set to 1 minute, data must be upsampled
    // beforehand the date from - to information has to be converted to the inputs of the upsampling function
    // this is the method to do it
    upsamplingTimeTransformation() {

        // the interval has to be stretched to the nearest multiples of 5-minutes, so that the required time interval fits inside it
        let fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
        let oneMinute = 60 * 1000;

        // storing the number of datapoints that need to be retrieved from the DB
        this.datapoints = 1 + (this.dateTo.getTime() - this.dateFrom.getTime()) / oneMinute;
        console.log("datapoints", this.datapoints)
        
        let datapointTimestamp = this.dateFrom.getTime();
        for (let i = 0; i < this.datapoints; i++){
            this.descriptionsArray.push(new Date(datapointTimestamp + (i * oneMinute)))
        }


        let dateFromFloored = new Date(Math.floor(this.dateFrom.getTime() / fiveMinutes) * fiveMinutes);
        let dateToCeiled = new Date(Math.ceil(this.dateTo.getTime() / fiveMinutes) * fiveMinutes);


        // we need an interval of 8 five minute values(=7 minutes intervals) from the DB - see JSDocs for upsamplnig
        let currentNumberOfIntervals = (dateToCeiled.getTime() - dateFromFloored.getTime()) / fiveMinutes;
        
        let dateFromForUpsampling = new Date(dateFromFloored.getTime() - ((7 - currentNumberOfIntervals) * fiveMinutes));

        //storing the "index" of the first relevant timestamp for upsampling function
        this.index = ((this.dateFrom.getTime() - dateFromForUpsampling.getTime()) / oneMinute) + 1
        console.log("index: ", this.index)

        // V TUTO CHVÍLI SE VRACÍ 2 DATA - OD/DO - Z DB JE POTŘEBA VYTÁHNOUT VŠECHNA DATA (po 5 minutách) LEŽÍCÍ MEZI TĚMITO INTERVALY (VČETNĚ) = CELKEM 8 HODNOT
        return([dateFromForUpsampling, dateToCeiled])

    }

}