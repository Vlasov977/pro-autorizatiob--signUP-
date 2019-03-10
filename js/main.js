define('main', ['DBOpenRequest'], function(DBOpenRequest) {
    function Modal(opts) {
        this.opts = opts;
        this.modal = document.querySelector('#signUpModal');
        this.signIn = document.querySelector('.authentication');
        this.close = document.querySelector('.popup-close');
        this.signUp = document.querySelector('.sign-up-button');
        this.init();
    }

    function Menu(opts) {
        this.opts = opts;
        this.account = document.querySelector('.user-account');
        this.submenu = document.querySelector('.user-submenu');
        this.subLink = document.querySelector('.sub-account');
        this.signOutButton = document.querySelector('.sign-out');
        this.init();
    }

    function SignIn(opts) {
        this.opts = opts;
        this.form = document.querySelector('.sign-in-form');
        this.input = document.querySelectorAll('.sign-in-input');
        this.user = {};
        this.init();
    }

    Modal.prototype.init = function() {
        var self = this;
        this.signIn.addEventListener('click', function() {
            self.showModalBlock();
        }, false);
        this.close.addEventListener('click', function() {
            self.closeModal();
        }, false);

        this.signUp.addEventListener('click', function() {
            self.closeModal();
        }, false);

        window.addEventListener('click', function(ev) {
            self.closeOutsideModal(ev);
        }, false);
    };

    Modal.prototype.showModalBlock = function() {
        this.modal.style.display = 'flex';
    };

    Modal.prototype.closeModal = function() {
        this.modal.style.display = 'none';
    };

    Modal.prototype.closeOutsideModal = function(ev) {
        if (ev.target === this.modal) {
            this.modal.style.display = 'none';
        }
    };

    Menu.prototype.init = function() {
        var self = this;
        if (localStorage.getItem('user') !== null) {
            var signIn = document.querySelector('.authentication');
            var user = JSON.parse(localStorage.getItem('user'));
            signIn.className += ' disable';
            this.account.innerHTML = user.name;
            this.account.className += ' active';

            this.account.addEventListener('click', function () {
                self.showProfileMenu();
            }, false);

            window.addEventListener('click', function(ev) {
                self.closeOutsideMenu(ev);
            }, false);

            this.signOutButton.addEventListener('click', function(ev) {
                self.signOut(ev);
            }, false);
        }
    };

    Menu.prototype.showProfileMenu = function() {
        this.submenu.classList.toggle('active');
    };

    Menu.prototype.closeOutsideMenu = function(ev) {
        if (ev.target !== this.subLink && ev.target !== this.account) {
            this.submenu.className = this.submenu.className.replace(' active', '');
        }
    };

    Menu.prototype.signOut = function(ev) {
        ev.preventDefault();
        localStorage.clear();
        route('/');
    };

    SignIn.prototype.init = function() {
        var self = this;
        this.form.addEventListener('submit', function(evt) {
            self.checkUser(evt);
        }, false);
    };

    SignIn.prototype.checkUser = function(evt) {
        evt.preventDefault();
        for (var i = 0; i < evt.target.length; i++) {
            if (this.input[i]) {
                this.user[this.input[i].getAttribute('name')] = this.input[i].value;
            }
        }
        getPerson(this.user);
        evt.target.reset();
    };

    function getPerson(user) {
        DBOpenRequest.then(function(db) {
            var transaction = db.transaction(["users"], "readwrite");
            var store = transaction.objectStore("users");
            var request = store.openCursor();
            var indexName = store.index("name");
            var reqName = indexName.get(user.name);
            reqName.onsuccess = function(e) {
                var match = e.target.result;
                if (match) {
                    var indexPassword = store.index("password");
                    var reqPassword = indexPassword.get(user.password);
                    reqPassword.onsuccess = function(e) {
                        var match = e.target.result;
                        if (match) {
                            route('/user');
                            var modal = document.querySelector('#signUpModal');
                            modal.style.display = 'none';
                            localStorage.setItem('user', JSON.stringify(user));
                            console.log('Welcome');
                        } else {
                            console.log('Try again');
                        }
                    }
                } else {
                    console.log('Try again');
                }
            }
        });
    }

    var modal = new Modal();
    var menu = new Menu({ searchString: 'item-collapsed'});
    var signIn = new SignIn();
});