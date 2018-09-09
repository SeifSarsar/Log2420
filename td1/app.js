var displayTimeout = null;
var displayPencil = function(currentPencilBox){
    var pencilBox = currentPencilBox.querySelector(".pencilBox");
    pencilBox.style.display = "flex";
    
}

var hidePencil = function(currentPencilBox){
    var pencilBox = currentPencilBox.querySelector(".pencilBox");
    pencilBox.style.display = "none";
}

var displayInfo = function(currentTimeBox){
    displayTimeout = setTimeout(function(){
         var infoBox = currentTimeBox.querySelector(".info");
    infoBox.style.display = "flex";
        displayTimeout = null;
    },1000)
   
    
}

var vote = function(currentBox){
    currentBox.classList.toggle("checked");
}

var hideInfo = function(currentTimeBox){
    if (displayTimeout != null){
        clearTimeout(displayTimeout);
    }
    var infoBox = currentTimeBox.querySelector(".info");
    infoBox.style.display = "none";
    
}



