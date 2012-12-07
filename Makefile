TESTS = $(shell find test -name "*_test.js")
JSFILES = $(shell find . -name node_modules -prune -o -name fixtures -prune -o -name test -prune -o -name "*.js" -print)
ARGS = --require should

test:
	./node_modules/.bin/mocha --reporter spec $(ARGS) $(TESTS)


watch:
	./node_modules/.bin/mocha -w -G --reporter spec $(ARGS) $(TESTS)


ci:
	./node_modules/.bin/mocha --reporter xunit $(ARGS) $(TESTS) -e integration

lint:
	./node_modules/.bin/jslint --nomen --node --white --sloppy --vars --regexp $(JSFILES)

.PHONY: test watch ci lint
