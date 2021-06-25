# LILITH-TRANSITION

### WHAT

LILITH-TRANSITION is a toy project that used Paint API (Houdini APIs), it add just one transition-paint to simulation dot-transition.

### WHY

No reason, just want to try **new** things😀.

### HOW

#### How to import `LILITH-TRANSITION`

- Use Node.js (with `rollup.js`):
  1. install `LILITH-TRANSITION`:

     ```shell
     npm install lilith-transition -S
     ```

  2. import `LILITH-TRANSITION` on anywhere:
     
     ```javascript
     // import all (painter and web-components).
     import("lilith-transition");

     // import painter only.
     import("lilith-transition/painter");
     ```

- Use CDN:

  1. add script tag into your html:

     ```html
     <script type="module" src="https://raw.githubusercontent.com/JuerGenie/lilith-transition/master/release/index.js"></script>
     ```

     **TIPS**: this resource always is latest version, if you want to fixed version, you should copy the file into your project's static folder.

  2. add style into your element:
     ```html
     <div style="background-image: paint(lilith-transition); --lilith-transition-position: 50%"></div>
     ```

#### How to use `LILITH-TRANSITION`

- sample:

   ```html
   <div class="lilith-transition"></div>
   
   <style>
       .lilith-transition {
           background-image: paint(lilith-transition);
           --lilith-transition-position: -50%;
           --lilith-transition-length: 50%;
           
           transition: --lilith-transition-position 1s ease-out;
       }
   </style>
   
   <script type="module">
       const div = document.querySelector(".lilith-transition");
       div.addEventListener("mouseenter", () => {
           div.attributeStyleMap.set("--lilith-transition-position", "60%");
       });
       div.addEventListener("mouseleave", () => {
           div.attributeStyleMap.delete("--lilith-transition-position");
       });
   </script>
   ```

See `example` folder, the `scss` file (`example/style.scss`) defined some stylesheet class to help you for use this.

And if you want to know what is the example's look like, you can try:

1. clone this repository
2. run `yarn`
3. run `yarn watch`
4. open new terminal, run `yarn dev`
5. open web page `http://127.0.0.1:8080`

this example page look like:

![Video_2021-06-18_015900](README.assets/Video_2021-06-18_015900.gif)

#### About custom properties

| Property Name                   | Syntax                             | Inherits | Initial Value                      | Description                                                  |
| ------------------------------- | ---------------------------------- | :------: | ---------------------------------- | ------------------------------------------------------------ |
| `--lilith-transition-color`     | `<color>`                          |    √     | `#000`                             | context's fill style.                                        |
| `-–lilith-transition-density`   | `<length> \| <length-percentage>`   |    √     | `100px`                            | distance between dots.<br />recommend use `px` cause now just handle `px` and `per`, and finally all use `px`. |
| `--lilith-transition-direction` | `horizontal \| vertical`            |    √     | `horizontal`                       | transition direction.                                        |
| `–-lilith-transition-length`    | `<length> \| <length-percentage>`   |    √     | `200px`                            | transition length.<br />recommend use `px` cause now just handle `px` and `per`, and finally all use `px`. |
| `–-lilith-transition-max-size`  | `<length> \| <length-percentage>`   |    √     | with `--lilith-transition-density` | dot's radius, range `(0, MAX]`, if value `lt` or `eq` `0`, it will use `--lilith-transition-density`'s value.<br />recommend use `px` cause now just handle `px` and `per`, and finally all use `px`. |
| `--lilith-transition-position`  | `<length> \| <length-percentage>`    |    ×     | `0`                                | current transition progress.<br />recommend use `px` cause now just handle `px` and `per`, and finally all use `px`. |
| `--lilith-transition-style`     | `fade-in \| fade-out \| fade-in-out` |    √     | `fade-in`                          | transition's style, see `example`.                           |

---

### Finally

You can contact me by [email](mailto://juergenie@qq.com).
