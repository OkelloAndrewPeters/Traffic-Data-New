 $(function(){
    
        $("#btn-get-pixel").on('click', function(){
        var location = $("#location").val();
        getPixelData();
        })

        $("#location").on('keyup', function(){
            getLocationOnKey();
        })

    })


    function getLocationOnKey(){
        var keyword = $("#location").val();
        var settings = {
        "url": "http://localhost/pixel/getLocationOnKey.php",
        "method": "GET",
        "data" : {'q':keyword},
        error(error){
            $("#results").html("No results");
            console.log(error.responseText);
            document.querySelector("#btn-get-pixel").disabled = true;
        }
       }
$.ajax(settings).done(function (response) {
  console.log(response);
  displayLocation(response);
});
    }

    function displayLocation(response){
     if(response.length > 0){
        document.querySelector("#btn-get-pixel").disabled = false;
     var displayname = response[0].display;
     var image_link = response[0].image_link;
     var locationid = response[0].location_id;

     $("#location_id").val(locationid);

     $("#results").html(displayname + "<br>" + image_link + "<p></p>");
     }else{
        $("#results").html("No results");
        document.querySelector("#btn-get-pixel").disabled = true;
     }
    }

    function getPixelData(){
        var locationid =   $("#location_id").val();
        if(locationid.length > 0){
        var settings = {
            "url": "http://localhost/pixel/getPixelData.php",
            "method": "GET",
            data: {"location_id": locationid},
            beforeSend: function(){
            $("#loader").removeClass("hide-it");
            $("#loader").html("Fetching pixel values, from network...");
            },
            error(error){
                console.log(error.responseText);
                $("#loader").html(error.responseText);
            }
        };
        $.ajax(settings).done(function (response) {
             console.log(response);
            if(response.status == "success"){
            document.querySelector("#loader").innerHTML = "Generating pixel swatches, please wait...";
            displaySwatches(response);
            
            }else{
            $("#loader").html(response.message);
            //$("#pixel-count-container").html("");
            }
           
        });
    }
    }

 function displaySwatches(response){
var encode = response.IMG_DATA;
var TDI_ID = response.TDI_ID;
var TDI_DATETIME = response.TDI_DATETIME;
$("#pixel-details").html("<br><p>Time: " + TDI_DATETIME + "</p>")
var actual = JSON.parse(atob(encode));
drawColorSwatch(actual, TDI_ID, TDI_DATETIME);

  // scroll to color swatch section
  const pixelCountContainer = document.getElementById('pixel-count-container'); 
        //pixelCountContainer.scrollIntoView({ behavior: 'smooth'});
        const colorCountLabel = document.getElementById('color-count');
        //colorCountLabel.innerText = Object.keys(actual).length;
 }

   // scroll to color swatch section
   const pixelCountContainer = document.getElementById('pixel-count-container'); 
        //pixelCountContainer.scrollIntoView({ behavior: 'smooth'});

        drawColorSwatch = (colorCount, TDI_ID, TDI_DATETIME) => {
            
            console.log(colorCount);
    let colorSwatches = document.getElementById('color-swatches');
    for(const color in colorCount) {
        const container = document.createElement("section");
        const swatch = document.createElement("div");
        const colorCountLabel = document.createElement("span");

        container.classList.add("color-swatch-container");

        swatch.classList.add("color-swatch");
        swatch.style.background = color;
        swatch.title = color;

        colorCountLabel.innerHTML = `: ${colorCount[color]}`;

        container.appendChild(swatch);
        container.appendChild(colorCountLabel);
        colorSwatches.appendChild(container);
    }
    let pixelCountContainer = document.getElementById('pixel-count-container');
    $("#loader").addClass("hide-it");
    $("#loader").html("");
};

