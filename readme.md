# MicroFrontend Implementation

This is a prototype of a MicroFrontend class that extends HTML with a web component ```<micro-frontend>``` and exposes logic to the code that runs inside the component's ```<iframe>```.

# Features
- simple to use ```<micro-frontend />``` tag that works like a [*seamless*](https://www.w3schools.com/tags/att_iframe_seamless.asp) ```<iframe />``` ([the seamless attribute never made it](https://github.com/whatwg/html/issues/331#issuecomment-169636370))
- Styles from the parent are passed to the child windows at runtime
- ```base href ``` and ```target``` added to embedded page for relative hyperlinks to open in parent window
- Loader animation is shown until child window has loaded content
- [```postMessage```](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) used to pass context & events for cross-domain compliance

# Using MicroFrontend

## Main Window setup

Include a reference to the ```MicroFrontend``` module.

```html
 <script src="dist/micro-frontend.js"></script>
```

Use a ```micro-frontend``` html tag to embed a MicroFrontend.

```html
<section>
    <micro-frontend id="app1" src="micro-frontend.html"></micro-frontend>
</section>

```

Use ```MicroFrontend.get(<ID>)``` to reference a given MicroFrontend.

```js
const app1 = MicroFrontend.get("app1")
```

Then, you can talk to the MicroFrontend.

For instance, if you want to pass contextual data to the page running in the ```micro-frontend```, this is the way to do it:

```js
app1.data = {
    token: sessionState["jwt-token"]
}
```

And if you want to listen to events the MicroFrontend dispatches, use this:

```js
app1.on("action", e => {
    alert("action: " + JSON.stringify(e.detail, null, 2));
})
```

Since the ```on()``` method is chainable, you can combine the two:

```js
MicroFrontend.get("app1").on("action", e => {
    alert("action: " + JSON.stringify(e.detail, null, 2));
}).data = {
    jwtToken: sessionState["jwt-token"]
}
```

## Child Window Setup

In the page that is embedded using the ```micro-frontend``` tag, you have to first reference the same ```MicroFrontend``` module:

```html
<script src="dist/micro-frontend.js"></script>
```

```js
MicroFrontend.run();
```

Then, if you need to communicate to the Main (parent) frame, you can use events:

```js
MicroFrontend.trigger("<EVENT-NAME>", {
    [...]
})
```

Here's a simple example putting it all together: after setting things up, the child window makes its parent's MicroFrontend element trigger an 'action' event, in this case to tell the main window it should select a menu.

```html
<script type="module">
    MicroFrontend.run(); // make child window aware of MicroFrontend setup

    document.getElementById("ping").addEventListener("click", e => {
        // make main window select 'contacts' route
        MicroFrontend.trigger("action", {
            action: "navigate",
            route: "contacts"
        })
    })
</script>

```
