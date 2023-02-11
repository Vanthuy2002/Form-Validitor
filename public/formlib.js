function Validator(option) {
  //Ham thuc thi validate
  function validate(inputElement, rule) {
    let errorMess = rule.test(inputElement.value);
    let errorElement = inputElement.parentElement.querySelector(option.error);
    if (errorMess) {
      errorElement.innerText = errorMess;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
  }
  //Get element of form need validate
  let formElement = document.querySelector(option.form);
  if (formElement) {
    option.rules.forEach((rule) => {
      let inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        //Xử lý khi blur ra ngoài
        inputElement.onblur = () => {
          validate(inputElement, rule);
        };
      }
      //Xử lý khi nhập vào ô input
      inputElement.oninput = () => {
        let errorElement = inputElement.parentElement.querySelector(
          option.error
        );
        errorElement.innerText = "";
        inputElement.parentElement.classList.remove("invalid");
      };
    });
  }
}

//Defined rules
//Nguyên tắc của rule
//1. When has a error , then return mess
//2. When pass, return nothing
Validator.isReqiured = function (selector) {
  return {
    selector,
    test(value) {
      return value.trim()
        ? undefined
        : "Well, have something is not funny, please try again";
    },
  };
};
Validator.isEmail = function (selector) {
  return {
    selector,
    test(value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : "Well, have something is not a email, please try again";
    },
  };
};

Validator.minLength = function (selector, min) {
  return {
    selector,
    test(value) {
      return value.length >= min
        ? undefined
        : "Enter at least " + min + " characters";
    },
  };
};

//My hope
Validator({
  form: "#form-1",
  error: ".form-message",
  rules: [
    Validator.isReqiured("#fullname"),
    Validator.isEmail("#email"),
    Validator.minLength("#password", 6),
  ],
});
