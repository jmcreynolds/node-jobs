const axios = require('axios'); 
const fs = require('fs');
const lineReader = require('line-reader');
const d = new Date();
const today = 1 //d.getDay();

let schedule = {
    0: { wordDay: "sun", run: [] },
    1: { wordDay: "mon", run: [2] },
    2: { wordDay: "tue", run: [3] },
    3: { wordDay: "wed", run: [4] },
    4: { wordDay: "thu", run: [5] },
    5: { wordDay: "fri", run: [6,0,1] },
    6: { wordDay: "sat", run: [] },
}


const getDamData = async (dam_url, file, parseFile) => {
    const resp = await axios.get(dam_url, {responseType: "stream"} )  
    .then(response => {  
        response.data.pipe(fs.createWriteStream(file));  
        console.log("Got Some")
    })  
    .catch(error => {  
        console.log(error);  
    })

    parseFile(file);
}

const parseFile = (file) => {
    lineReader.eachLine(file, function(line, last) {
        
        if (line.match(/^PROJECTED/)){
            let arr = line.split(/\s+/);
            const dateStr = arr[4] + " " + arr[5] + " " + arr[6]
            const date = new Date(dateStr);
            const iso = date.toISOString();
            console.log(iso)
        }
        if (line.match(/^[ ]{1,2}(2[0-4]|1[0-9]|[1-9])/)) {
            let arr = line.split('   ');
            console.log(arr[0], arr[12])
         }
         
    });
}

Object.entries(schedule[today].run).forEach(entry => {
    const file = "/tmp/dam.data-" + Math.floor(+new Date() / 1000);
    const [key, run_day]  = entry
    console.log(run_day)
    const dam_url = "https://swpa.gov/gen/" + schedule[run_day].wordDay + ".htm";
    console.log(dam_url);
    getDamData(dam_url, file, parseFile);
});
