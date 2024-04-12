document.getElementById("myposition").addEventListener("click", geoFindMe)
document.getElementById("skipbtn").addEventListener("click", showQuiz)

let statusText = document.getElementById("status")

let rightAns,
rightNumber = 0,
falseNumber = 0



/*GPS*/

let latitude, 
longitude,
latitude1,
longitude1,
accuracy
let clue



function createLocation(latitude, longitude, clue) {
    return { latitude, longitude, clue };
}

const locations = [
    createLocation(59.39737, 16.475512, "Let's go for a swing!"),
    createLocation(59.39968, 16.47589, "Aye aye, captain!"),
    createLocation(59.39888, 16.47934, "The only place where a nap is allowed during school time!"),
    createLocation(59.39493, 16.47901, "Let's get a bus ride!"),
    createLocation(59.392251188012736, 16.484822283085844, "I always served with Indonesian food here!"),
    createLocation(59.393355037243154, 16.49021308493723, "Emergency goodies and chips!"),
    createLocation(59.39555753917993, 16.490802810070747, "Memorable school events!"),
    createLocation(59.39529182227188, 16.48836728645217, "Let's get your favorite, 50/50 ice cream!"),
    createLocation(59.394970643975135, 16.485879352398882, "Where your very first primary class teacher used to live"),
    createLocation(59.397467091235, 16.47549210713904, "Home sweet home!")
];


function geoFindMe(){
    //alert ("Show my position")

    if (!navigator.geolocation){
        statusText.innerHTML = "There's no geo function"
    }
    else{
        statusText.innerHTML = "Looking....."
        setTimeout(() => {
        navigator.geolocation.watchPosition(success, error)
        },5000)
    }
}



function success(position){
    latitude = position.coords.latitude
    longitude = position.coords.longitude
    accuracy = position.coords.accuracy

    let currentIndex = 0
    let i = 0

    statusText.innerHTML = "Your current coordinate: " + latitude + "" + longitude + "" + accuracy 
    + "\n Distance to next point: " + getDistance(latitude, longitude, locations[i].latitude, locations[i].longitude, "K") + "km. Your clue: " + locations[i].clue

    openStreetMap(latitude,longitude)

    if (getDistance(latitude, longitude, locations[i].latitude, locations[i].longitude, "K") <= 0.001)
    {
        navigator.geolocation.clearWatch(watchId)
        //console.log("Your clue: " + locations[i].clue)
        currentIndex++

        if(currentIndex < locations.length)
        {
            watchId = navigator.geolocation.watchPosition(success,error)
        }
        else{
            showQuiz()
        }
    }
}

function error(error){
    alert(error)
}

function openStreetMap(latitude,longitude){
    let latzoom = 0.01071819/2
    let longzoom = 0.020256042/2

    let marker = latitude + "%2C" + longitude

    let bbox = (longitude - longzoom) + "%2C" + (latitude
         - latzoom) + "%2C" + (longitude + longzoom) + "%2C" + (latitude + latzoom)

         let url = "https://www.openstreetmap.org/export/embed.html?bbox=" + bbox
         + "&layer=mapnik&marker=" + marker
    
    //statusText.innerHTML = url

    document.getElementById("map").src = url
}



function getDistance(lat1, lon1, lat2, lon2, unit) {

    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    if (unit == "M") { dist = dist * 1609.344; dist = Math.round(dist) }
    console.log(dist)
    return dist
}


/*API*/
function showQuiz(){

    addQuestion = () =>{
        const url = "https://opentdb.com/api.php?amount=10&category=27"
        fetch(url)
        .then(data => data.json())
        .then(result => showQuestion(result.results))
        .catch(function(error){
            console.log("Something went wrong: ", error)
        })
    }
    addQuestion();

    validateAnswer = () => {
        if (document.querySelector(".questions .active")){
            verifyAnswer()
        }
        else{
            const errorDiv = document.createElement("div")
            errorDiv.classList.add("alert", "alert-danger","col-md-6")
            errorDiv.textContent = "Please select answer"

            const questionDiv = document.querySelector(".questions")
            questionDiv.appendChild(errorDiv)

            setTimeout(() =>{
                document.querySelector(".alert-danger").remove()
            }, 2000)
        }
    }

    eventListeners = () =>{
        document.querySelector("#check").addEventListener("click", validateAnswer)
    }
    eventListeners();

    // document.addEventListener('DOMContentLoaded', function(){
    //     addQuestion();

    //     eventListeners();
    // })

    

   

    showQuestion = question => {
        const questionHTML = document.createElement("div")
        questionHTML.classList.add("col-12")

        question.forEach(question => {
            rightAns = question.correct_answer

            let possibleAnswer = question.incorrect_answers
            possibleAnswer.splice(Math.floor(Math.random()*3),0,rightAns)

            questionHTML.innerHTML = `<div class = "row justify-content-between heading">
            <p class = "category">Category: ${question.category}</p>
            <div class= "scores">
            <span class ="badge badge-primary">${rightNumber}</span>
            <span class ="badge badge-warning">${falseNumber}</span>
            </div>
            <h2 class="text-center">${question.question}`
    

        const answerDiv = document.createElement("div")
        answerDiv.classList.add("questions", "row", "justify-content-center", "mt-5")

        possibleAnswer.forEach(answer => {
            const answerHTML = document.createElement("li")
            answerHTML.classList.add("col-12", "col-md-5")
            answerHTML.textContent = answer
            answerHTML.onclick = selectAnswer

            answerDiv.appendChild(answerHTML)

        })
        questionHTML.appendChild(answerDiv)

        document.querySelector("#app").appendChild(questionHTML)
    })
    }

    selectAnswer = (e) => {
        if (document.querySelector(".active")){
            const activeAnswer = document.querySelector(".active")
            activeAnswer.classList.remove("active")
        }
        e.target.classList.add("active")
    }

    
    verifyAnswer = () => {
        const userAnswer = document.querySelector(".questions .active")
        if (userAnswer.textContent===rightAns){
            rightNumber++
        }
        else{
            falseNumber++
        }

        const app = document.querySelector("#app")
        while (app.firstChild){
            app.removeChild(app.firstChild)
        }
        addQuestion()
    }
}
