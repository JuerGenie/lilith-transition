/**
 * 因为 painter 会重复加载自身（通过 import.meta.url），因此使用 import() 进行
 * 懒加载，确保 rollup 不会将这些代码一起 bundled，并导致 worklet 初始化异常。
 */
import("./painter");
import * as components from "./components";

export { components };
