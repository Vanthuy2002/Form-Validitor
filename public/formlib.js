function Validator(option){
    let formElement= document.querySelector(option.form);
    if(formElement){
        option.rules.forEach((rule)=>{
            let inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                inputElement.onblur = ()=>{
                 
                }
            }
        });
    }
}

//Defined rules
Validator.isReqiured = function(selector){
    return {
        selector, 
        test(){

        }
    }

}
Validator.isEmail = function(selector){
    return {
        selector, 
        test(){
            
        }
    }
}

//My hope
Validator({
    form: "#form-1",
    rules : [
        Validator.isReqiured("#fullname"),
        Validator.isEmail("#email"),
    ]
});