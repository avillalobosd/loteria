// TOMA LA VARIABLE DE LA URL Y LA GUARDA EN sala
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sala = urlParams.get('sala')
console.log(sala);

// INICIALIZACION DE FIREBASE
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
firebase.initializeApp(firebaseConfig);
var db = firebase.database();


// SE EJECUTRA AL ABRIR PAGINA
document.addEventListener("DOMContentLoaded", function (e) {
    db.ref('/sala/').child(sala).once("value", function (snapshot) {
        // REVISA SI EXISTE LA SALA 
        if (snapshot.exists()) {
            // REVISA SI EXISTE UN USUARIO GUARDADO
            if (localStorage.getItem("laloteID") === null) {
                // SI NO HAY CREA UN USARIO NUEVO
                console.log("NO HAY ID")
                let charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
                var laloteID = '';
                for (var i = 0; i < 4; i++) {
                    var randomPoz = Math.floor(Math.random() * charSet.length);
                    laloteID += charSet.substring(randomPoz, randomPoz + 1);
                }
                console.log(laloteID)
                // GUARDA EL USUARIO EN USUARIOS DE LA SALA 
                db.ref().child("/sala/" + sala + "/usuarios/").child(laloteID).set({
                    nombre: ""
                });
                // GUARDA EL USARIO EN LOCAL STORAGE`
                localStorage.setItem('laloteID', laloteID)
            }
            else {
                // SI EXISTE EL ID REVISA SI ESTA REGISTRADO EL ID EN LA SALA
                db.ref("/sala/" + sala + "/usuarios/").child(localStorage.getItem("laloteID")).once("value", function (snapshot) {
                    if (snapshot.exists()) {
                        console.log("EXISTE ID EN SALA")
                    }
                    else {
                        db.ref().child("/sala/" + sala + "/usuarios/").child(localStorage.getItem("laloteID")).set({
                            nombre: ""
                        });
                        console.log("NO EXISTE ID EN SALA")
                    }
                });
                console.log("SI HAY ID")
            }
        }
        else {
            // SI NO EXISTE LA SALA AVISA QUE NO EXISTE
            alert("SALA NO EXISTE")
            location.href="index.html"
        }
    });
});



// REVISION TIEMPO REAL DE CUALQUIER CAMBIO EN USUARIOS
db.ref().child("/sala/" + sala +"/usuarios").on("value", function(snapshot) {
    var cambios = snapshot.val();
    // GUARDA LOS ID DE USUARIOS EN UN ARREGLO
    var usuarios=Object.keys(cambios)
    var htmlUsuario=""
    usuarios.map(function(usuario){
        htmlUsuario=htmlUsuario+"<h4>"+usuario+"</h4>"

        console.log("Nombre")
        console.log(usuario)
        console.log(cambios[usuario].nombre)
    })
    var x = d3.select(".listaUsuarios");
    x.html(htmlUsuario)
  });


//   CHAT
// ENVIAR MENSAJE
d3.select("#btnEnviar").on("click", enviarMensaje);

function enviarMensaje(){
    console.log("ENVIAR MENSAJE")
    let mensaje = document.getElementById("inputChat").value;
    let usuario=localStorage.getItem("laloteID")
    document.getElementById("inputChat").value=""
    console.log(mensaje)
    console.log(usuario)
    db.ref().child("/sala/" + sala + "/chat/").push({
        nombre: usuario,
        mensaje:mensaje
    }); 
}

// REVISION TIEMPO REAL DEL CHAT 
db.ref().child("/sala/" + sala +"/chat").on("value", function(snapshot) {
    var chat = snapshot.val();
    var mensajeID=Object.keys(chat)
    console.log(mensajeID)
    htmlChat=""

    mensajeID.map(function(id){
        htmlChat=htmlChat+"<p>"+chat[id].nombre+": "+chat[id].mensaje+" </p>"


    })

    var x = d3.select("#mensajesChat");
    x.html(htmlChat)

    var messageBody = document.querySelector('#mensajesChat');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    
  });



