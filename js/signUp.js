define('signUp', ['DBOpenRequest'], function (DBOpenRequest) {
        function Registration(opts) {
            this.opts = opts;
            this.form = document.querySelector('.sign-up-form');
            this.input = document.querySelectorAll('.sign-up-input');
            this.res = {};
            this.init();
        }

        Registration.prototype.init = function() {
            var self = this;
            this.form.addEventListener('submit', function(evt) {
                self.createUser(evt);
            }, false);
        };

        Registration.prototype.createUser = function(evt) {
            evt.preventDefault();
            for (var i = 0; i < evt.target.length; i++) {
                if (this.input[i]) {
                    this.res[this.input[i].getAttribute('name')] = this.input[i].value;
                }
            }

            addPerson(this.res);
            evt.target.reset();
        };

        function addPerson(user) {
            DBOpenRequest.then(function(db) {
                var transaction = db.transaction(["users"], "readwrite");
                var store = transaction.objectStore("users");
                var request = store.add({ name: user.name, email: user.email, password: user.password });
                request.onerror = function(e) {
                    alert('error: ' + e.target.error.name);
                };

                request.onsuccess = function(e) {
                    alert('success');
                }
            });
        }

        return Registration;
    }
);