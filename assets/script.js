function include_error_path(elm) {
  elm.innerHTML = "unter <code>" + window.location.pathname + "</code>";
}

function execute_bound_code(__PGRMR__code, __PRGRMR__elm) {
  new Function(__PGRMR__code).bind(__PRGRMR__elm).call();
}

function run_data_load_from() {
  let elms = document.querySelectorAll("[data-load-from]");
  for (let elm of elms) {
    let code = elm.getAttribute("data-load-from");
    elm.innerHTML = "Lade...";
    fetch(code, {"headers" : {"Access-Control-Allow-Origin" : "*"}})
        .then(response => response.text())
        .then(text => {
          elm.innerHTML = text;
          run_data_run(elm);
        })
        .catch(error => {
          console.error(error);
          elm.innerHTML =
              "Fehler beim Laden von Inhalten: <code>" + error + "</code>";
        });
  }
}

function run_data_run(scope) {
  scope = scope || document;
  let elms = scope.querySelectorAll(":scope [data-run]");
  for (let elm of elms) {
    let code = elm.getAttribute("data-run");
    execute_bound_code(code, elm);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  run_data_run();
  run_data_load_from();
});
