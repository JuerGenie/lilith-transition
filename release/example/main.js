import('../index.js');
const demo_with_mask = document.querySelector(".with-mask");
const top = demo_with_mask.querySelector(".top");
demo_with_mask.addEventListener("mouseenter", () => {
    console.log("mouse enter");
    top.attributeStyleMap.set("--lilith-transition-position", "20%");
});
demo_with_mask.addEventListener("mouseleave", () => {
    console.log("mouse leave");
    top.attributeStyleMap.delete("--lilith-transition-position");
});
//# sourceMappingURL=main.js.map
