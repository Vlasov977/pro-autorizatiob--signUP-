define(['lib/route', 'signUp'], function(router, SignUp) {
    route.base('/');

    route('/', function() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("page").innerHTML =
                    this.responseText;
            }
        };
        xhttp.open("GET", "view/home.html", true);
        xhttp.send();
    });
    route('/create-account', function() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("page").innerHTML =
                    this.responseText;

                new SignUp();
            }
        };
        xhttp.open("GET", "view/registration.html", true);
        xhttp.send();
    });
    if (localStorage.getItem('user') !== null) {
        route('/user', function() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    document.getElementById("page").innerHTML =
                        this.responseText;

                }
            };
            xhttp.open("GET", "view/account.html", true);
            xhttp.send();
        });
    }


    route.start(true);
});