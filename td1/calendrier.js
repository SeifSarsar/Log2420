var displayTimeout = null;
var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var months = ["Jan","Feb","Mar","Apr","May","Jui","Jul","Aug","Sep","Oct","Nov","Dec"];
/*Récupérer les données du fichier cal-data.json */
window.requestCalendarData();

function requestCalendarData(){
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        //Si il y a succès...
        if (this.readyState === 4 && this.status === 200){
            var data = JSON.parse(this.responseText);
            displayDatesTable(data);
            displayParticipantsName(data);
            assignIdToColumns(data);
            displayTableCounts(data);
            displayParticipantsDisponibilitiesTable(data);

            displayCalendarDatesRange(data);
            displayCalendarDates(data);
            assignDayToRowsElements();
            displayCalendarDispo(data);

            addListeners();
            
        }
        else {
            console.log("Response status: "+ this.status+" - "+this.statusText);
        }
    }
    httpRequest.open("GET", "./cal-data.json", true);
    httpRequest.send();

} 
/*Ajouter un evenement lorsque l'on click sur les disponibilités du tableau et du calendrier*/
function addListeners(){
    var voteGreenBoxes = document.getElementsByClassName("greenColorVote"); // selectionner boites du tableau
    var dispos = document.getElementsByClassName("dispo"); //selectionner boites du calendrier
    for (var i = 0 ; i < voteGreenBoxes.length ; i++){
        voteGreenBoxes[i].addEventListener("click", viewUpdate);
        dispos[i].addEventListener("click", viewUpdate);
    }
}

function viewUpdate(){
    this.classList.toggle("checked"); //Cocher
    //On click sur une boite du tableau
    if (this.classList[0] == "greenColorVote"){
        //cocher la boite du calendrier qui correspond a celle du tableau
        var columnId = this.parentElement.id;
        var day = columnId.substr(0,2);
        var hour = columnId.substr(2,3);
        document.getElementsByClassName(hour)[0].getElementsByClassName(day)[0].querySelector(".dispo").classList.toggle("checked");
    }
    //On click sur une boite du calendrier
    else if ((this.classList[0] == "dispo")){
         //cocher la boite du tableau qui correspond a celle du calendrier
        var day = this.parentElement.classList[0];
        var hour = this.parentElement.parentElement.classList[1];
        var columnId = day + hour;
        document.getElementById(columnId).querySelector(".greenColorVote").classList.toggle("checked");
    } 
}

//Fonction qui affiche le crayon du tableau pour chaque participant
var displayPencil = function(currentPencilBox){
    var pencilBox = currentPencilBox.querySelector(".pencilBox");
    pencilBox.style.display = "flex";
    
}
//Fonction qui cache le crayon du tableau pour chaque participant
var hidePencil = function(currentPencilBox){
    var pencilBox = currentPencilBox.querySelector(".pencilBox");
    pencilBox.style.display = "none";
}

//Affiche la bulle d'information
var displayInfo = function(currentTimeBox){
    //on execute la fonction apres 1 seconde
    displayTimeout = setTimeout(function(){
        
        var infoBox = currentTimeBox.querySelector(".info")
        
        var dateBox = document.getElementById(infoBox.classList[1]).querySelector(".calendarBox");
        var infoDate = infoBox.querySelector(".calendarBox");
        infoDate.innerHTML = dateBox.innerHTML;

        infoBox.style.display = "flex";
        
        displayTimeout = null;
    },1000);
   
    
}

//Cacher la bulle d'information
var hideInfo = function(currentTimeBox){
    if (displayTimeout != null){
        clearTimeout(displayTimeout);
    }
    var infoBox = currentTimeBox.querySelector(".info");
    infoBox.style.display = "none";
    
}


//Affiche le nombre de disponibilites par plage horaire
function displayTableCounts(data){
    //Afficher nombre de participants
    document.getElementById("nParticipants").innerHTML = (data.Participants.length)+ " participants";

    var nChecks = document.getElementById("table").getElementsByClassName("nChecks");
    var count = 0;
    for (var i = 0 ; i <  nChecks.length ; i++){
        
        for (var j = 0 ; j < data.Participants.length; j++){
            //si la disponibilite est egale a 1, on incremente le nombre de disponibilites
            if (data.Participants[j].Disponibilités[i])
                count++;
        }
        nChecks[i].querySelector(".countOfChecks").innerHTML = count;
        count = 0;
    }
}

//Afficher les disponibilites pour le tableau
function displayDatesTable(data){
     
    var calendarBoxes = document.getElementsByClassName("calendarBox");
    for (var i = 0 ; i < data.Calendrier.length ; i++){
        var date = new Date(data.Calendrier[i][0]);
        //Afficher mois
        calendarBoxes[i].querySelector(".month").innerHTML = months[date.getMonth()];
        //Afficher jour du mois
        calendarBoxes[i].querySelector(".day").innerHTML = date.getDate();
        //Afficher jour de la semaine
        calendarBoxes[i].querySelector(".weekday").innerHTML = days[date.getDay()];
        //Afficher l'heure de dispo
        calendarBoxes[i].querySelector(".time").innerHTML = "<div>"+ date.getHours() + ":00</div><div>"+(date.getHours()+2)+":00</div>";
    }

}
function displayParticipantsName(data){
    var column = document.getElementById("participantsName");
    for (var j = 0 ; j < data.Participants.length ; j++){
            column.innerHTML  += " <div class='higherWidth' onmouseover='displayPencil(this)' onmouseout='hidePencil(this)'><div class='partName'><img src='Images/particip2.png'><div>"+data.Participants[j].Nom+"</div> </div> <div class='pencilBox'><i class='fa fa-pencil'></i></div></div></div>" ;
    }
    
}

//Cette fonction est necessaire pour relier les boites du tableau aux boites du calendrier
//Assigner des id a chaque colonne du tableau
function assignIdToColumns(data){
    var columns = document.getElementsByClassName("tableColumn");
    //Creer des id en combinant la date et l'heure de chaque disponibilite
    for (var i = 0 ; i < data.Calendrier.length ; i++ ){
        var id = (new Date(data.Calendrier[i][0]).getDate()).toString() + (new Date(data.Calendrier[i][0]).getHours()).toString();
        columns[i].setAttribute("id", id);
    }
}
//Afficher dans le tableau des cases vertes ou des cases rouges selon les disponibilites de chaque participants 
function displayParticipantsDisponibilitiesTable(data){
    for (var i = 0 ; i < data.Calendrier.length ; i++ ){
        //Selectionner la colonne
        var columnId = (new Date(data.Calendrier[i][0]).getDate()).toString() + (new Date(data.Calendrier[i][0]).getHours()).toString();
        var column = document.getElementById(columnId);
        for (var j = 0 ; j < data.Participants.length ; j++){
            //Si le participant est disponible... 
            if (data.Participants[j].Disponibilités[i]){
                column.innerHTML += "<div class='normalWidth checked' onmouseover='displayInfo(this)' onmouseout='hideInfo(this)'><div class='info " + columnId + "'><div class = 'calendarBox'></div> <div class='disponibility'><div class = 'personName'>" +data.Participants[j].Nom + "</div> <div class='voteResult'> Voted 'Yes'</div></div> </div> <i class='fa fa-check'></i></div>";
            }
            else {
                column.innerHTML += "<div class='normalWidth' onmouseover='displayInfo(this)' onmouseout='hideInfo(this)'><div class='info " + columnId + "'><div class = 'calendarBox'></div> <div class='disponibility'><div class = 'personName'>" +data.Participants[j].Nom + "</div><div class='voteResult'> Didn't vote for this</div></div></div></div>";
            }
            
        }
    }
}

//Ces deux fonctions permettent de changer de vue
function displayTable(){
    if (document.getElementById("table").style.display="none"){
        document.getElementById("calendarMenu").classList.remove("active");

        document.getElementById("tableMenu").classList.add("active");
        document.getElementById("calendar").style.display = "none";
        document.getElementById("table").style.display = "flex";
    }
}
function displayCalendar(){
    if (document.getElementById("calendar").style.display="none"){
        document.getElementById("tableMenu").classList.remove("active");
        document.getElementById("calendarMenu").classList.add("active");
        document.getElementById("table").style.display = "none";
        document.getElementById("calendar").style.display = "flex";
    }
   
}
////

function displayCalendarDatesRange(data){
    var dateRange = document.getElementById("dateRange");
    var firstDate = new Date(data.Calendrier[0][0]);
    var lastDate = new Date(data.Calendrier[data.Calendrier.length-1][0]);

    dateRange.innerHTML = months[firstDate.getMonth()] + " "+firstDate.getDate() + " - " + months[lastDate.getMonth()] + " " + lastDate.getDate() + ", " + lastDate.getFullYear();
}

//Afficher les 7 jours de la semaine presente
function displayCalendarDates(data){
    var currentDate = new Date(data.Calendrier[0][0]);
    var dates = document.getElementsByClassName("calendarDate");
    //Selectionner le premier jour est incrementer de 1 jour
    for (var i = 0; i< 7;i++){
        dates[i].querySelector(".day").innerHTML = currentDate.getDate();
        dates[i].querySelector(".weekday").innerHTML = days[currentDate.getDay()];
        currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1,
            currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds()
        );
    }
}
//Cette fonction est utile pour relier les blocs du calendrier aux blocs du tableau
function assignDayToRowsElements(){
    var timeRows = document.getElementsByClassName("timeRow");
    var calendarDates = document.getElementsByClassName("calendarDate");
    for (var i = 0 ; i < timeRows.length ; i++){
        for (var j = 0; j < calendarDates.length ; j++){
            var day = calendarDates[j].querySelector(".day").innerHTML;
            timeRows[i].innerHTML += "<div class = '" + day + "'></div>"
        }
        
    }
}
//Afficher les boites bleues dans le calendrier selon les plages horaires 
function displayCalendarDispo(data){

    var dispos = [];
    for (var i = 0 ; i<data.Calendrier.length;i++){
        var dateHour = new Date(data.Calendrier[i]).getHours();
        var dateDay =  new Date(data.Calendrier[i]).getDate();
        var dispo = document.getElementsByClassName(dateHour)[0].getElementsByClassName(dateDay)[0];
        dispo.innerHTML += "<div class='dispo'><div class='whiteSpace'><i class='fa fa-check'></i></div><div class='nChecks'><i class='fa fa-check'></i><div class='countOfChecks'></div></div></div>"
    }
    displayCalendarCounts(data);
}
//Similaire a la fonctions displayTableCounts(data)
function displayCalendarCounts(data){

    for (var i = 0 ; i< data.Calendrier.length;i++){
        var nChecks = 0;
        var dateHour = new Date(data.Calendrier[i]).getHours();
        var dateDay =  new Date(data.Calendrier[i]).getDate();
        var dispo = document.getElementsByClassName(dateHour)[0].getElementsByClassName(dateDay)[0];
        for ( var j = 0 ; j<data.Participants.length ; j++){
            if (data.Participants[j].Disponibilités[i]){
                nChecks++;
            }
        }
        dispo.querySelector(".countOfChecks").innerHTML = nChecks;
    }
}