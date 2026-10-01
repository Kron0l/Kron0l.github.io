const ADMIN_PASSWORD_SHA256 = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function openAdmin() {
  document.getElementById("admin-login")?.classList.add("hidden");
  document.getElementById("admin-protected")?.classList.remove("hidden");
  window.dispatchEvent(new Event("portfolio-admin-unlocked"));
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("portfolioAdminUnlocked") === "1") {
    openAdmin();
    return;
  }

  document.getElementById("admin-login-form")?.addEventListener("submit", async event => {
    event.preventDefault();
    const input = document.getElementById("admin-password");
    const error = document.getElementById("admin-login-error");
    const candidate = await sha256(input.value);

    if (candidate === ADMIN_PASSWORD_SHA256) {
      sessionStorage.setItem("portfolioAdminUnlocked", "1");
      if (error) error.textContent = "";
      input.value = "";
      openAdmin();
    } else {
      if (error) error.textContent = "Mot de passe incorrect.";
      input.select();
    }
  });
});
