function make2darray(csv) {
    var rows = csv.split("\n"); //split array on each new line
    return rows.map(function(row) {
        return row.split(","); //split each element, making a 2d array out of the data
    });
}

//interprets the 2d array, extracting the dates for labels and creating different lines on the graph for each cohort
function makeDataSets(array) {
    var yearmonth = []; //holds dates for labels
    var dataSets = []; //holds the line object

    for (x = 0; x < array.length; x++) {
        if (array[0][x + 1] !== undefined) {
            yearmonth[x] = array[0][x + 1]; //year month is on first row of array
        }
    }

    for (x = 1; x < array.length - 1; x++) {
        var label; //holds the cohort
        var data = []; //holds the cohort's data
        var c = 0; //counter for the data array
        var alive = false; //if cohort has arrived at site or not
        for (y = 0; y < array[array.length - 2].length; y++) { //remove the last element as it is an unremovable empty line for some reason
            if (y == 0) {
                label = array[x][y]; //first column of 2d array is the cohort
            } else {
                if (alive) { //if cohort exists yet
                    if (isNaN(parseInt(array[x][y]))) {
                        data[c] = 0; //if cohort exists and there is no data set to 0
                    } else {
                        data[c] = array[x][y]; //if cohort exists and there is data set to data value
                    }
                } else {
                    if (isNaN(parseInt(array[x][y]))) {
                        data[c] = null; //if cohort doesn't exist and there is no data set to null
                    } else {
                        alive = true;
                        data[c] = array[x][y]; //this will be the first value for any cohort, set to alive
                    }
                }
                c++;
            }
        }

        dataSets.push({
            label: 'Cohort ' + label, //label for each cohort line
            data: data, //data for each cohort
            borderColor: randomColorGenerator(),
            borderWidth: 3,
            fill: false
        });
    }
    return [yearmonth, dataSets];

}

function randomColorGenerator() {
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
}

$.ajax({
    url: 'smalldata.csv',
    dataType: 'text',
    success: function(data) {
        var array = make2darray(data);
        var chartData = makeDataSets(array);
        var ctx = document.getElementById('myChart').getContext('2d');
        var option = {
            responsive: false,
            maintainAspectRatio: false
        };
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData[0],
                datasets: chartData[1]
            },
            options: option
        });
    }
});
$.ajax({
    url: 'data.csv',
    dataType: 'text',
    success: function(data) {
        var array = make2darray(data);
        var chartData = makeDataSets(array);
        var ctx = document.getElementById('myChart2').getContext('2d');
        var option = {
            responsive: false,
            maintainAspectRatio: false
        };
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData[0],
                datasets: chartData[1]
            },
            options: option
        });
    }
});
