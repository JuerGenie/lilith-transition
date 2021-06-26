function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

// Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
// at the end of hydration without touching the remaining nodes.
let is_hydrating = false;
function start_hydrating() {
    is_hydrating = true;
}
function end_hydrating() {
    is_hydrating = false;
}
function upper_bound(low, high, key, value) {
    // Return first index of value larger than input value in the range [low, high)
    while (low < high) {
        const mid = low + ((high - low) >> 1);
        if (key(mid) <= value) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }
    return low;
}
function init_hydrate(target) {
    if (target.hydrate_init)
        return;
    target.hydrate_init = true;
    // We know that all children have claim_order values since the unclaimed have been detached
    const children = target.childNodes;
    /*
    * Reorder claimed children optimally.
    * We can reorder claimed children optimally by finding the longest subsequence of
    * nodes that are already claimed in order and only moving the rest. The longest
    * subsequence subsequence of nodes that are claimed in order can be found by
    * computing the longest increasing subsequence of .claim_order values.
    *
    * This algorithm is optimal in generating the least amount of reorder operations
    * possible.
    *
    * Proof:
    * We know that, given a set of reordering operations, the nodes that do not move
    * always form an increasing subsequence, since they do not move among each other
    * meaning that they must be already ordered among each other. Thus, the maximal
    * set of nodes that do not move form a longest increasing subsequence.
    */
    // Compute longest increasing subsequence
    // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
    const m = new Int32Array(children.length + 1);
    // Predecessor indices + 1
    const p = new Int32Array(children.length);
    m[0] = -1;
    let longest = 0;
    for (let i = 0; i < children.length; i++) {
        const current = children[i].claim_order;
        // Find the largest subsequence length such that it ends in a value less than our current value
        // upper_bound returns first greater value, so we subtract one
        const seqLen = upper_bound(1, longest + 1, idx => children[m[idx]].claim_order, current) - 1;
        p[i] = m[seqLen] + 1;
        const newLen = seqLen + 1;
        // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
        m[newLen] = i;
        longest = Math.max(newLen, longest);
    }
    // The longest increasing subsequence of nodes (initially reversed)
    const lis = [];
    // The rest of the nodes, nodes that will be moved
    const toMove = [];
    let last = children.length - 1;
    for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
        lis.push(children[cur - 1]);
        for (; last >= cur; last--) {
            toMove.push(children[last]);
        }
        last--;
    }
    for (; last >= 0; last--) {
        toMove.push(children[last]);
    }
    lis.reverse();
    // We sort the nodes being moved to guarantee that their insertion order matches the claim order
    toMove.sort((a, b) => a.claim_order - b.claim_order);
    // Finally, we move the nodes
    for (let i = 0, j = 0; i < toMove.length; i++) {
        while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
            j++;
        }
        const anchor = j < lis.length ? lis[j] : null;
        target.insertBefore(toMove[i], anchor);
    }
}
function append(target, node) {
    if (is_hydrating) {
        init_hydrate(target);
        if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
            target.actual_end_child = target.firstChild;
        }
        if (node !== target.actual_end_child) {
            target.insertBefore(node, target.actual_end_child);
        }
        else {
            target.actual_end_child = node.nextSibling;
        }
    }
    else if (node.parentNode !== target) {
        target.appendChild(node);
    }
}
function insert(target, node, anchor) {
    if (is_hydrating && !anchor) {
        append(target, node);
    }
    else if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
        target.insertBefore(node, anchor || null);
    }
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}
function attribute_to_object(attributes) {
    const result = {};
    for (const attribute of attributes) {
        result[attribute.name] = attribute.value;
    }
    return result;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            start_hydrating();
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        end_hydrating();
        flush();
    }
    set_current_component(parent_component);
}
let SvelteElement;
if (typeof HTMLElement === 'function') {
    SvelteElement = class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
            const { on_mount } = this.$$;
            this.$$.on_disconnect = on_mount.map(run).filter(is_function);
            // @ts-ignore todo: improve typings
            for (const key in this.$$.slotted) {
                // @ts-ignore todo: improve typings
                this.appendChild(this.$$.slotted[key]);
            }
        }
        attributeChangedCallback(attr, _oldValue, newValue) {
            this[attr] = newValue;
        }
        disconnectedCallback() {
            run_all(this.$$.on_disconnect);
        }
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            // TODO should this delegate to addEventListener?
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    };
}

/* src\components\carousel\carousel.svelte generated by Svelte v3.38.3 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	child_ctx[14] = list;
	child_ctx[15] = i;
	return child_ctx;
}

// (63:4) {#each content_element as _, index}
function create_each_block(ctx) {
	let div;
	let slot;
	let t;
	let div_class_value;
	let index = /*index*/ ctx[15];
	const assign_div = () => /*div_binding*/ ctx[7](div, index);
	const unassign_div = () => /*div_binding*/ ctx[7](null, index);

	return {
		c() {
			div = element("div");
			slot = element("slot");
			t = space();
			attr(slot, "name", /*index*/ ctx[15]);
			attr(div, "part", `wrapper wrapper-${/*index*/ ctx[15]}`);

			attr(div, "class", div_class_value = [
				"wrapper",
				/*index*/ ctx[15] === /*current_index*/ ctx[0]
				? "top"
				: ""
			].join(" "));
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, slot);
			append(div, t);
			assign_div();
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*current_index*/ 1 && div_class_value !== (div_class_value = [
				"wrapper",
				/*index*/ ctx[15] === /*current_index*/ ctx[0]
				? "top"
				: ""
			].join(" "))) {
				attr(div, "class", div_class_value);
			}

			if (index !== /*index*/ ctx[15]) {
				unassign_div();
				index = /*index*/ ctx[15];
				assign_div();
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			unassign_div();
		}
	};
}

function create_fragment(ctx) {
	let div;
	let div_style_value;
	let mounted;
	let dispose;
	let each_value = /*content_element*/ ctx[4];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.c = noop;
			attr(div, "style", div_style_value = `width: ${/*width*/ ctx[1]}; height: ${/*height*/ ctx[2]}; position: relative;`);
			attr(div, "part", "content");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			if (!mounted) {
				dispose = [
					listen(div, "mouseenter", /*mouseenter_handler*/ ctx[8]),
					listen(div, "mouseleave", /*mouseleave_handler*/ ctx[9])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*current_index, content_element*/ 17) {
				each_value = /*content_element*/ ctx[4];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*width, height*/ 6 && div_style_value !== (div_style_value = `width: ${/*width*/ ctx[1]}; height: ${/*height*/ ctx[2]}; position: relative;`)) {
				attr(div, "style", div_style_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { current_index = 0 } = $$props;
	let { width = "200px" } = $$props;
	let { height = "200px" } = $$props;
	let { stop_when_hover = false } = $$props;
	const self_component = get_current_component();
	let content_element = [];

	function update_content() {
		$$invalidate(4, content_element = []);
		const children = self_component.children;

		for (let i = 0; i < children.length; i++) {
			content_element.push({ div: null, source: children.item(i) });
		}

		content_element.forEach((el, i) => el.source.slot = String(i));
		clearInterval(timer);

		timer = setInterval(
			() => {
				if (canTrans) {
					$$invalidate(0, current_index += 1);

					if (current_index >= content_element.length) {
						$$invalidate(0, current_index = 0);
					}

					dispatch("change", { current_index });
				}
			},
			4000
		);
	}

	const dispatch = createEventDispatcher();
	let timer = 0;
	let canTrans = true;

	onMount(() => {
		update_content();
	});

	onDestroy(() => {
		clearInterval(timer);
	});

	function div_binding($$value, index) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			content_element[index].div = $$value;
			$$invalidate(4, content_element);
		});
	}

	const mouseenter_handler = () => stop_when_hover && $$invalidate(5, canTrans = false);
	const mouseleave_handler = () => stop_when_hover && $$invalidate(5, canTrans = true);

	$$self.$$set = $$props => {
		if ("current_index" in $$props) $$invalidate(0, current_index = $$props.current_index);
		if ("width" in $$props) $$invalidate(1, width = $$props.width);
		if ("height" in $$props) $$invalidate(2, height = $$props.height);
		if ("stop_when_hover" in $$props) $$invalidate(3, stop_when_hover = $$props.stop_when_hover);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*content_element, current_index*/ 17) {
			{
				const target = content_element[current_index];

				if (target && target.div) {
					content_element.forEach(el => {
						if (el.div.style.zIndex > target.div.style.zIndex) {
							el.div.style.zIndex = String(Number(el.div.style.zIndex) - 1);
						}

						el.div.classList.remove("top");
					});

					target.div.style.zIndex = "3";
					target.div.classList.add("top");
				}
			}
		}
	};

	return [
		current_index,
		width,
		height,
		stop_when_hover,
		content_element,
		canTrans,
		update_content,
		div_binding,
		mouseenter_handler,
		mouseleave_handler
	];
}

class Carousel extends SvelteElement {
	constructor(options) {
		super();
		this.shadowRoot.innerHTML = `<style>:root{--lilith-transition-density:20px}:host(::part(content)){overflow:hidden}.wrapper{position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;mask-image:paint(lilith-transition);-webkit-mask-image:paint(lilith-transition);--lilith-transition-position:100%}.top{animation:lilith-carousel-animation 2s linear}@keyframes lilith-carousel-animation{0%{--lilith-transition-position:-100%}100%{--lilith-transition-position:100%}}</style>`;

		init(
			this,
			{
				target: this.shadowRoot,
				props: attribute_to_object(this.attributes),
				customElement: true
			},
			instance,
			create_fragment,
			safe_not_equal,
			{
				current_index: 0,
				width: 1,
				height: 2,
				stop_when_hover: 3,
				update_content: 6
			}
		);

		if (options) {
			if (options.target) {
				insert(options.target, this, options.anchor);
			}

			if (options.props) {
				this.$set(options.props);
				flush();
			}
		}
	}

	static get observedAttributes() {
		return ["current_index", "width", "height", "stop_when_hover", "update_content"];
	}

	get current_index() {
		return this.$$.ctx[0];
	}

	set current_index(current_index) {
		this.$set({ current_index });
		flush();
	}

	get width() {
		return this.$$.ctx[1];
	}

	set width(width) {
		this.$set({ width });
		flush();
	}

	get height() {
		return this.$$.ctx[2];
	}

	set height(height) {
		this.$set({ height });
		flush();
	}

	get stop_when_hover() {
		return this.$$.ctx[3];
	}

	set stop_when_hover(stop_when_hover) {
		this.$set({ stop_when_hover });
		flush();
	}

	get update_content() {
		return this.$$.ctx[6];
	}
}

customElements.define("lilith-carousel", Carousel);

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Carousel: Carousel
});

/**
 * 因为 painter 会重复加载自身（通过 import.meta.url），因此使用 import() 进行
 * 懒加载，确保 rollup 不会将这些代码一起 bundled，并导致 worklet 初始化异常。
 */
import('./index-0cd6d89f.js');

export { index as components };
//# sourceMappingURL=index-b6133c8d.js.map
