import "./style.scss";

const demo_with_mask = document.querySelector(".with-mask") as HTMLDivElement;
const top = demo_with_mask.querySelector(".top") as HTMLDivElement;

demo_with_mask.addEventListener("mouseenter", () => {
  console.log("mouse enter");
  top.attributeStyleMap.set("--lilith-transition-position", "20%");
});
demo_with_mask.addEventListener("mouseleave", () => {
  console.log("mouse leave");
  top.attributeStyleMap.delete("--lilith-transition-position");
});
