export function closeSideBar() {
  const sideBar = document.querySelector("aside#nav");
  sideBar?.classList.remove("max-md:-translate-x-60");
}
