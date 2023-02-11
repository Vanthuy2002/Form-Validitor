function Validitor(){

}

//Defined rules
Validitor.isReqiured = function(){

}
Validitor.isEmail = function(){

}

//My hope
Validitor({
    form: "#form-1",
    rules : [
        Validitor.isReqiured("#fullName"),
        Validitor.isEmail("#email"),
    ]
});