define('DBOpenRequest', [],
    function () {
        return new Promise(function(resolve, reject) {
            var DBOpenRequest = window.indexedDB.open("database", 1);
            DBOpenRequest.onupgradeneeded = function(event) {
                var thisDb = event.target.result;
                if (!thisDb.objectStoreNames.contains('users')) {
                    var users = thisDb.createObjectStore('users', { autoIncrement: true });
                    users.createIndex("name", "name", { unique: false });
                    users.createIndex("email", "email", { unique: true });
                    users.createIndex("password", "password", { unique: false });
                }

            };
            DBOpenRequest.onsuccess = function(e) {
                resolve(DBOpenRequest.result);
            };
            DBOpenRequest.onerror = function(e) {
                reject(e);
            };
        })
    }
);