import "./style.scss";
// import in module file, or import on script tag with 'type="module"', like this: <script type="module" src="../src/index.ts"></script>
import "../src";

const demo_under_mask = document.querySelector(".under-mask") as HTMLDivElement;
const demo_transition = demo_under_mask.querySelector(
  ".inner"
) as HTMLDivElement;

demo_under_mask.addEventListener("mouseenter", () => {
  console.log("mouse enter");
  demo_transition.attributeStyleMap.set("--lilith-transition-position", "60%");
});
demo_under_mask.addEventListener("mouseleave", () => {
  console.log("mouse leave");
  demo_transition.attributeStyleMap.delete("--lilith-transition-position");
});
