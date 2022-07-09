const axios = require('axios'); 
const fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

axios.get('https://swpa.gov/gen/fri.htm', {responseType: "stream"} )  
.then(response => {  
    response.data.pipe(fs.createWriteStream("/tmp/dam.data"));  
})  
    .catch(error => {  
    console.log(error);  
});  

lineReader.eachLine('/tmp/dam.data', function(line, last) {
    if (line.match(/^PROJECTED/)){
        let arr = line.split(/\s+/);
        const dateStr = arr[4] + " " + arr[5] + " " + arr[6]
        const date = new Date(dateStr);
        const iso = date.toISOString();
        console.log(iso)
    }
    if (line.match(/^\s{1,2}[0-24]/)) {
        let arr = line.split('   ');
        console.log(arr[0], arr[12])
     }
});