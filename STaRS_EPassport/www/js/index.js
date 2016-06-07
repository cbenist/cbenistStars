var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        $('#sendBtn').on("click", sendEmail);
        $('#scanQR').on("click", QRscan);
    },
    

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        

        console.log('Received Event: ' + id);
    }
};

var QRlist = [];
var QRlistTime = [];

function QRscan() {
    
    cordova.plugins.barcodeScanner.scan(
    function(result){
        
        var time = new Date();
        var exactTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + ":" + time.getMilliseconds();
        var element = result.text + " " + exactTime;
        
            if($.inArray(result.text,QRlist) == -1){
                QRlist.push(result.text);
                QRlistTime.push(element);
                updateReport();
                alert("Scan Success! ");
            }
            else{
                alert("Already scanned that one.");
            }
        },
        function(error){
        alert("Scan Failed");
        }
    );
}

function updateReport(){
    document.getElementById("report").innerHTML = QRlistTime;
    
}


function sendEmail() {
	console.log("running sendEmail()");
    var to = document.getElementById('toAddress').value;
    if( to.length == 0 || !validateEmail(to)){
        alert('email address is not valid, please try again.');
        return;
    }
    var last = document.getElementById('lastName').value;
    var first = document.getElementById('firstName').value;
    var msg = document.getElementById('msg').value;
    var cc = document.getElementById('userAddress').value;
    var body = "<h1>Message from: " + last + "," + first + "</h1><br/><br/>" + msg + "<br/><br/>" + QRlistTime;
    
    cordova.plugins.email.open({
        to:      to,
        cc:      cc,
        subject: 'outbound test email',
        body:    body,
        isHtml:  true
    });
    console.log("done running sendEmail()");
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/; // crude test, ok for now
    return re.test(email);
}

app.initialize();


