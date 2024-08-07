This class makes automatic clicks on defined elements.

### Features:

- Click when hovering over an element and stop when the cursor leaves the element;
- Click immediately after loading the document;
- Click after the click event;
- It is possible to specify a delay before the start;
- Enter the number of clicks;
- Interval between clicks;
- Execute the function after the last click.

### Using:

- Copy the code from the autoclicks.js file and paste it into your source;
- In your code, create a new instance of the class with attributes

```javascript
let q = new AutoClicks({
	el: document.body.querySelectorAll('a'), // {Elements} elements for which clicks are made.
	e: // {string}
		"loaded" // clicks after the entire document is loaded;
		"click" // clicks after clicking on an element;
		"hover" // clicks after hover an element. counting of clicks starts from the beginning at the next hover.
		"hovering" // clicks after hover an element. the click count is not canceled on the next hover.
	1 || count // {number} number of clicks.
	false || loop false // {boolean} clicks from beginning to end.
	0 || delay // {number} delay before clicking.
	0 || interval // {number} delay before next click.
	false || action // {function} execute the function after each click.
	false || callback // {function} execute the function after the clicks are finished.
  })

// Stop
q.stop(?el)
```
