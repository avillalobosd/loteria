var firebaseConfig = {
    apiKey: "AIzaSyDwTNGdcPXSGMdEDd5c_JbWDSIBkQX8a8s",
    authDomain: "loteria-a7d3c.firebaseapp.com",
    databaseURL: "https://loteria-a7d3c.firebaseio.com",
    projectId: "loteria-a7d3c",
    storageBucket: "loteria-a7d3c.appspot.com",
    messagingSenderId: "273374527121",
    appId: "1:273374527121:web:959e61a6b7483266228930",
    measurementId: "G-F7NVBPL9DJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();
//   firebase.analytics();


d3.select("#btnEntrar").on("click", entrar);
d3.select("#btnCrear").on("click", crear);




function entrar() {
    let sala = document.getElementById("inputSala").value;

    db.ref('/sala/').child(sala).once("value", function (snapshot) {
        if (snapshot.exists()) {
            console.log("EXISTE")
            location.href="sala.html?sala="+sala

        }
        else {
          alert("No Existe Sala")     }

    });


}


function crear() {

    

    let charSet ='abcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < 8; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    console.log(randomString)
    db.ref('/sala/').child(randomString).once("value", function (snapshot) {
        if (snapshot.exists()) {
            alert("Vuelva a Intentarlo")

        }
        else {
            db.ref().child("/sala").child(randomString).set({
                nombre: randomString
            });

            location.href="sala.html?sala="+randomString
        }

    });



    console.log(randomString)
    console.log("CLICK ENTRAR")


}