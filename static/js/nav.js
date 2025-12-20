
function go(page) {
  window.location.href = page;
}

document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname.split("/").pop();

  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === current) {
      link.style.fontWeight = "bold";
      link.style.textDecoration = "underline";
      link.style.color = "#38bdf8";
    }
  });
});


