COMPILE = node_modules/.bin/compile

render-to-string.js: src/main.js
	$(COMPILE) -o $@ -f cjs -e fritz $^