/****************************************************
 * PREDICT-OR
 * Frontend JavaScript
 ****************************************************/


/*
 * ==================================================
 * PASTE YOUR APPS SCRIPT WEB APP URL HERE
 * ==================================================
 */

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwyklzHj98SHu2qoYFFuqVGllciMYQGfNNwyH7CnEVdJGPfM33wbQJW2-G2uJ5mO1Uw/exec";


/*
 * ==================================================
 * ELEMENTS
 * ==================================================
 */

const form =
  document.getElementById("predictForm");

const loadingBox =
  document.getElementById("loadingBox");

const successBox =
  document.getElementById("successBox");

const errorBox =
  document.getElementById("errorBox");

const successMessage =
  document.getElementById("successMessage");

const errorMessage =
  document.getElementById("errorMessage");

const calculateBtn =
  document.getElementById("calculateBtn");

const buttonText =
  document.getElementById("buttonText");

const buttonArrow =
  document.getElementById("buttonArrow");

const againBtn =
  document.getElementById("againBtn");

const errorAgainBtn =
  document.getElementById("errorAgainBtn");


/*
 * ==================================================
 * FORM SUBMIT
 * ==================================================
 */

form.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    /*
     * Read form values
     */

    const userName =
      document
        .getElementById("userName")
        .value
        .trim();

    const userDob =
      document
        .getElementById("userDob")
        .value;

    const personName =
      document
        .getElementById("personName")
        .value
        .trim();

    const personDob =
      document
        .getElementById("personDob")
        .value;

    const email =
      document
        .getElementById("email")
        .value
        .trim();


    /*
     * Required-field validation
     */

    if (!userName) {

      showError(
        "Please enter your full name."
      );

      return;
    }


    if (!userDob) {

      showError(
        "Please enter your date of birth."
      );

      return;
    }


    if (!personName) {

      showError(
        "Please enter the person's name."
      );

      return;
    }


    if (!email) {

      showError(
        "Please enter your email address."
      );

      return;
    }


    /*
     * Build request
     */

    const requestData = {

      action: "calculate",

      userName: userName,

      userDob: userDob,

      personName: personName,

      personDob: personDob || "",

      email: email

    };


    /*
     * Show loading
     */

    form.style.display = "none";

    successBox.style.display = "none";

    errorBox.style.display = "none";

    loadingBox.style.display = "block";

    calculateBtn.disabled = true;


    /*
     * JSONP request
     */

    sendToAppsScript(requestData);

  }
);


/*
 * ==================================================
 * SEND TO GOOGLE APPS SCRIPT
 * ==================================================
 */

function sendToAppsScript(data) {

  /*
   * Unique callback name
   */

  const callbackName =
    "predictORCallback_" +
    Date.now();


  /*
   * Create global callback
   */

  window[callbackName] =
    function(result) {

      /*
       * Remove script element
       */

      cleanup();


      /*
       * Hide loading
       */

      loadingBox.style.display = "none";


      /*
       * Handle response
       */

      if (
        result &&
        result.success
      ) {

        successMessage.textContent =
          result.message ||
          "Your Predict-OR report has been sent to your email.";

        successBox.style.display =
          "block";

      } else {

        showError(
          result &&
          result.message
            ? result.message
            : "Something went wrong. Please try again."
        );

      }

    };


  /*
   * Create timeout
   */

  const timeout =
    setTimeout(
      function() {

        cleanup();

        showError(
          "The server took too long to respond. Please try again."
        );

      },
      30000
    );


  /*
   * Create URL
   */

  const params =
    new URLSearchParams();


  Object.keys(data).forEach(
    function(key) {

      params.append(
        key,
        data[key]
      );

    }
  );


  params.append(
    "callback",
    callbackName
  );


  const requestUrl =
    SCRIPT_URL +
    "?" +
    params.toString();


  /*
   * Create script tag.
   *
   * This allows the external website
   * to communicate with Apps Script
   * without browser CORS blocking.
   */

  const script =
    document.createElement("script");


  script.src =
    requestUrl;

  script.async = true;


  /*
   * If the request itself fails
   */

  script.onerror =
    function() {

      cleanup();

      showError(
        "Unable to connect to the Predict-OR server."
      );

    };


  document
    .body
    .appendChild(script);


  /*
   * Cleanup
   */

  function cleanup() {

    clearTimeout(timeout);

    delete window[callbackName];

    if (script.parentNode) {

      script.parentNode.removeChild(
        script
      );

    }

  }

}


/*
 * ==================================================
 * SHOW ERROR
 * ==================================================
 */

function showError(message) {

  form.style.display = "none";

  loadingBox.style.display = "none";

  successBox.style.display = "none";

  errorMessage.textContent =
    message;

  errorBox.style.display =
    "block";

  calculateBtn.disabled =
    false;

}


/*
 * ==================================================
 * RESET
 * ==================================================
 */

function resetPage() {

  form.reset();

  form.style.display =
    "block";

  loadingBox.style.display =
    "none";

  successBox.style.display =
    "none";

  errorBox.style.display =
    "none";

  calculateBtn.disabled =
    false;

  buttonText.textContent =
    "Calculate Connection";

  buttonArrow.textContent =
    "→";


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/*
 * ==================================================
 * BUTTON EVENTS
 * ==================================================
 */

againBtn.addEventListener(
  "click",
  resetPage
);


errorAgainBtn.addEventListener(
  "click",
  resetPage
);