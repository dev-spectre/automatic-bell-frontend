export function openSideBar() {
  const sideBar = document.querySelector("aside#nav");
  sideBar?.classList.remove("max-md:-translate-x-60");
}

export function closeSideBar() {
  const sideBar = document.querySelector("aside#nav");
  sideBar?.classList.add("max-md:-translate-x-60");
}
