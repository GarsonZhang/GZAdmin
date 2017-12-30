let GZStorage ={};

GZStorage.getInstance = function() {
    // debugger
    if (!this.instance) {
        this.instance = new GZStorage();
    }
    return this.instance;
};
GZStorage.clear=function(){
    localStorage.removeItem('token');  
    localStorage.removeItem('secretID');
    localStorage.removeItem('secretKey');
    localStorage.removeItem('pwd');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLogin');
    this.token=null;
    this.secretID=null;
    this.secretKey=null;
    this.pwd=null;
    this.userName=null;
    this.isLogin=undefined;
};
GZStorage.setToken = function (token) {
    // debugger
    localStorage.setItem('token', token);
    this.token = token;
};

GZStorage.getToken = function () {
    // debugger
    if (!this.token)
        this.token = localStorage.getItem('token');
    return this.token;
};


GZStorage.setSecretKey = function (id, token) {
    localStorage.setItem('secretID', id);
    localStorage.setItem('secretKey', token);
    this.secretKey = token;
    this.secretID = id;
};

GZStorage.getSecretKey = function () {
    if (!this.secretKey)
        this.secretKey = localStorage.getItem('secretKey');
    return this.secretKey;
};
GZStorage.getSecretID = function () {
    if (!this.secretID)
        this.secretID = localStorage.getItem('secretID');
    return this.secretID;
};

GZStorage.setAccount = function (account) {
    localStorage.setItem('account', account);
    this.account = account;
};

GZStorage.getAccount = function () {
    if (!this.account)
        this.account = localStorage.getItem('account');
    return this.account;
};


GZStorage.setPwd = function (pwd) {
    localStorage.setItem('pwd', pwd);
    this.pwd = pwd;
};

GZStorage.getPwd = function () {
    if (!this.pwd)
        this.pwd = localStorage.getItem('pwd');
    return this.pwd;
};

GZStorage.setUserName = function (userName) {
    localStorage.setItem('userName', userName);
    this.userName = userName;
};

GZStorage.getUserName = function () {
    if (!this.userName)
        this.userName = localStorage.getItem('userName');
    return this.userName;
};


GZStorage.setLogin = function (val) {
    localStorage.setItem('isLogin', val);
    this.isLogin = val;
};

GZStorage.getLoginStatus = function () {
    if (this.isLogin === undefined)
        this.isLogin = localStorage.getItem('isLogin') === 'true';
    return this.isLogin;
};

export default GZStorage;