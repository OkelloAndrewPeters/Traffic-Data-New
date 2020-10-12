var http = require('http');
var fs = require('fs');
var request = require("request");
const puppeteer = require('puppeteer');
const {Image, createCanvas} = require('canvas')
var isTakingShot = false;

   function getImageData(imgLocation, locationid){
    console.log("generating image data...");
    const canvas = createCanvas(800, 600)
    const ctx = canvas.getContext('2d')
    fs.readFile(imgLocation, function(err, data) {
        if (err) throw err
        const img = new Image()
        img.onload = () => ctx.drawImage(img, 0, 0)
        img.onerror = err => { throw err }
        img.src = data
        var _IMAGE_DATA = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var countResults = countPixels(_IMAGE_DATA.data);
         //console.log(countResults);
         var jsonString = JSON.stringify(countResults);
        base64data  =  encodeBase64(jsonString);
        console.log("Image data generated...");
       //console.log(base64data);
       sendDataToDb(base64data, locationid);
    });
    }


    function takeShot(url, locationid){
      isTakingShot = true;
        var imgname = Math.ceil(Math.random() * 1000000) + '_screenshot.png';
        (async () => {
          console.log("taking shoot: " + imgname);
          console.log(url);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
          await page.goto(url);
          await page.screenshot({path: imgname});
        await browser.close();
        console.log("Shot  taken\n");
        getImageData(imgname, locationid);
      })();
      }


getLocationData();
function getLocationData(){
    console.log("fetching locations....");
    var options = { method: 'GET',
    url: 'http://localhost/pixel/getLocations.php'};
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log("finished***");
    var locationData = JSON.parse(body);
    initTakeScreenShot(locationData);
  });  
}

function initTakeScreenShot(locationData){
  var startIndex = 0;
  var stopIndex = locationData.length-1;

  setInterval(()=>{
    if(!isTakingShot && (startIndex !== stopIndex)){
    startIndex++;
    var url = locationData[startIndex].image_link;
    var locationid = locationData[startIndex].location_id;
    takeShot(url, locationid);
    }
    }, 5000);
}

function countPixels(data) {   
    const colorCounts = {};
    for(let index = 0; index < data.length; index += 4) {
        const rgba = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${(data[index + 3] / 255)})`;

        if (rgba in colorCounts) {
            colorCounts[rgba] += 1;
        } else {
            colorCounts[rgba] = 1;
        }
    }    
    return colorCounts;
}


function encodeBase64(data){
    let buff = new Buffer(data);
    let base64data = buff.toString('base64');
    return base64data;
}

function decodeBase64(data){
    let buff = new Buffer(data, 'base64');
    let text = buff.toString('ascii');
    return text;
}

function sendDataToDb(imgData, locationid){
    console.log("Sending data to db...");
    var options = { method: 'POST',
    url: 'http://localhost/pixel/savetodb.php',
    body: { IMAGE_DATA: imgData, LOCATION_ID: locationid},
    json: true };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log("data send....");
    console.log(body);
    isTakingShot = false;
  });
  
}