// Contact form: package pre-select from ?paket= and inline validation on top of the
// native form. The form still submits to Netlify without JS.
const messages = {
  namn: { valueMissing: "Skriv ditt namn." },
  epost: { valueMissing: "Skriv din e-postadress.", typeMismatch: "Kontrollera e-postadressen, t.ex. namn@foretag.se." },
  meddelande: { valueMissing: "Berätta kort om ditt projekt.", tooShort: "Skriv minst 20 tecken så jag förstår vad du behöver." },
  hemsida: { typeMismatch: "Skriv hela adressen, t.ex. https://dittforetag.se." },
  samtycke: { valueMissing: "Du behöver godkänna att vi sparar dina uppgifter för att vi ska kunna svara." },
};

function errorFor(field) {
  const { validity } = field;
  const custom = messages[field.name] ?? {};
  for (const key of ["valueMissing", "typeMismatch", "tooShort"]) {
    if (validity[key]) return custom[key] ?? field.validationMessage;
  }
  return field.validationMessage;
}

function showError(field) {
  const id = `${field.id}-fel`;
  let error = document.getElementById(id);
  const container = field.closest(".form__field");

  if (field.validity.valid) {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
    error?.remove();
    return true;
  }

  if (!error) {
    error = document.createElement("p");
    error.id = id;
    error.className = "form__error";
    container.append(error);
  }
  error.textContent = errorFor(field);
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", id);
  return false;
}

function preselectPackage(form) {
  const paket = new URLSearchParams(location.search).get("paket");
  const select = form.querySelector("#paket");
  if (paket && select?.querySelector(`option[value="${CSS.escape(paket)}"]`)) select.value = paket;
}

export default function initForm() {
  document.querySelectorAll("[data-form]").forEach((form) => {
    preselectPackage(form);
    form.noValidate = true;
    const fields = [...form.querySelectorAll("input:not([type=hidden]):not([type=radio]), textarea")].filter((f) => f.id);

    fields.forEach((field) => {
      field.addEventListener("blur", () => field.value && showError(field));
      field.addEventListener("input", () => field.hasAttribute("aria-invalid") && showError(field));
      field.addEventListener("change", () => field.type === "checkbox" && showError(field));
    });

    form.addEventListener("submit", (event) => {
      const invalid = fields.filter((field) => !showError(field));
      if (invalid.length) {
        event.preventDefault();
        invalid[0].focus();
      }
    });
  });
}
