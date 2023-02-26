function Validator(option) {
  let selectorRules = {};
  function getSelector(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
        //return ra thẻ cha chứa form-message
      }
      element = element.parentElement;
    }
  }

  //Ham thuc thi validate
  function validate(inputElement, rule) {
    let errorMess;
    //Lấy ra hàm test theo selector tương ứng
    let rules = selectorRules[rule.selector];

    //Lặp qua từng rules, nếu có lỗi thì break (dừng kiểm tra)
    //Nếu isReqiued("#email") mà bắn ra mess báo lỗi, thì isEmail("#email") sẽ không được thực thi
    for (let i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMess = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMess = rules[i](inputElement.value);
          break;
      }
      if (errorMess) break;
    }
    let errorElement = getSelector(
      inputElement,
      option.parentValue
    ).querySelector(option.error);
    if (errorMess) {
      errorElement.innerText = errorMess;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }

    return !errorMess;
  }
  //Get element of form need validate
  let formElement = document.querySelector(option.form);
  //submit form
  if (formElement) {
    formElement.onsubmit = (e) => {
      e.preventDefault();

      let isFormValid = true;

      //Lap qua tung rules va validate
      option.rules.forEach((rule) => {
        let inputElement = formElement.querySelector(rule.selector);
        let valid = validate(inputElement, rule);
        if (!valid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        if (typeof option.onSubmit === "function") {
          let enableInputs = formElement.querySelectorAll(
            "[name]:not([disable])"
          );

          let formValue = Array.from(enableInputs);
          let resultsForm = formValue.reduce((values, input) => {
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector(
                  `input[name=${input.name}]:checked`
                ).value;
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;

              default:
                values[input.name] = input.value;
            }
            return values;
          }, {});
          localStorage.setItem("user", JSON.stringify(resultsForm));
          option.onSubmit(resultsForm);
        }
      }
    };
  }

  //Xử lý form
  if (formElement) {
    option.rules.forEach((rule) => {
      //luu lai rules cho moi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      let inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        //Xử lý khi blur ra ngoài
        inputElement.onblur = () => {
          validate(inputElement, rule);
        };
      }
      //Xử lý khi nhập vào ô input
      inputElement.oninput = () => {
        let errorElement = getSelector(
          inputElement,
          option.parentValue
        ).querySelector(option.error);
        errorElement.innerText = "";
        getSelector(inputElement, option.parentValue).classList.remove(
          "invalid"
        );
      };
    });
  }
}

//Defined rules
//Nguyên tắc của rule
//1. When has a error , then return mess
//2. When pass, return nothing
Validator.isReqiured = function (selector, msg) {
  return {
    selector,
    test(value) {
      return value
        ? undefined
        : msg || "Well, have something is not funny, please try again";
    },
  };
};
Validator.isEmail = function (selector, msg) {
  return {
    selector,
    test(value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : msg || "Well, have something is not a email, please try again";
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

Validator.isConfirm = function (selector, getConfirmValue, msg) {
  return {
    selector,
    test(value) {
      return value === getConfirmValue()
        ? undefined
        : msg || "Input data is incorrect, please try again";
    },
  };
};

//My hope
Validator({
  form: "#form-1",
  error: ".form-message",
  parentValue: ".form-group",
  rules: [
    Validator.isReqiured("#fullname"),
    Validator.isReqiured("#email", "Vui lòng nhập trường này"),
    Validator.isEmail("#email", "Vui lòng nhập định dạng email"),
    Validator.minLength("#password", 4),
    Validator.isReqiured("#password_confirmation"),
    Validator.isReqiured("input[type='checkbox']"),
    Validator.isReqiured("#img"),
    Validator.isConfirm(
      "#password_confirmation",
      () => {
        return document.querySelector("#form-1 #password").value;
      },
      "Mật khẩu nhập lại không đúng"
    ),
  ],
  onSubmit(data) {
    //Call API để gửi (POST) về database
    console.log(data);
  },
});
