/**
 * @fileoverview Tests for quotes rule.
 * @author Matt DuVall <http://www.mattduvall.com/>, Michael Paulukonis
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/quotes"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 5,
		sourceType: "script",
	},
});

ruleTester.run("quotes", rule, {
	valid: [
		'var foo = "bar";',
		{ code: "var foo = 'bar';", options: ["single"] },
		{ code: 'var foo = "bar";', options: ["double"] },
		{ code: "var foo = 1;", options: ["single"] },
		{ code: "var foo = 1;", options: ["double"] },
		{ code: 'var foo = "\'";', options: ["single", { avoidEscape: true }] },
		{ code: "var foo = '\"';", options: ["double", { avoidEscape: true }] },
		{
			code: "var foo = <>Hello world</>;",
			options: ["single"],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var foo = <>Hello world</>;",
			options: ["double"],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var foo = <>Hello world</>;",
			options: ["double", { avoidEscape: true }],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var foo = <>Hello world</>;",
			options: ["backtick"],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var foo = <div>Hello world</div>;",
			options: ["single"],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: 'var foo = <div id="foo"></div>;',
			options: ["single"],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var foo = <div>Hello world</div>;",
			options: ["double"],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var foo = <div>Hello world</div>;",
			options: ["double", { avoidEscape: true }],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var foo = `bar`;",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `bar 'baz'`;",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'var foo = `bar "baz"`;',
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{ code: "var foo = 1;", options: ["backtick"] },
		{
			code: 'var foo = "a string containing `backtick` quotes";',
			options: ["backtick", { avoidEscape: true }],
		},
		{
			code: 'var foo = <div id="foo"></div>;',
			options: ["backtick"],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: "var foo = <div>Hello world</div>;",
			options: ["backtick"],
			languageOptions: {
				ecmaVersion: 6,
				parserOptions: { ecmaFeatures: { jsx: true } },
			},
		},
		{
			code: 'class C { "f"; "m"() {} }',
			options: ["double"],
			languageOptions: { ecmaVersion: 2022 },
		},
		{
			code: "class C { 'f'; 'm'() {} }",
			options: ["single"],
			languageOptions: { ecmaVersion: 2022 },
		},

		// Backticks are only okay if they have substitutions, contain a line break, or are tagged
		{
			code: "var foo = `back\ntick`;",
			options: ["single"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `back\rtick`;",
			options: ["single"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `back\u2028tick`;",
			options: ["single"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `back\u2029tick`;",
			options: ["single"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `back\\\\\ntick`;", // 2 backslashes followed by a newline
			options: ["single"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `back\\\\\\\\\ntick`;",
			options: ["single"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `\n`;",
			options: ["single"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `back${x}tick`;",
			options: ["double"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = tag`backtick`;",
			options: ["double"],
			languageOptions: { ecmaVersion: 6 },
		},

		// Backticks are also okay if allowTemplateLiterals
		{
			code: "var foo = `bar 'foo' baz` + 'bar';",
			options: ["single", { allowTemplateLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `bar 'foo' baz` + \"bar\";",
			options: ["double", { allowTemplateLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "var foo = `bar 'foo' baz` + `bar`;",
			options: ["backtick", { allowTemplateLiterals: true }],
			languageOptions: { ecmaVersion: 6 },
		},

		// `backtick` should not warn the directive prologues.
		{
			code: '"use strict"; var foo = `backtick`;',
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: '"use strict"; \'use strong\'; "use asm"; var foo = `backtick`;',
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: 'function foo() { "use strict"; "use strong"; "use asm"; var foo = `backtick`; }',
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "(function() { 'use strict'; 'use strong'; 'use asm'; var foo = `backtick`; })();",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: '(() => { "use strict"; "use strong"; "use asm"; var foo = `backtick`; })();',
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},

		// `backtick` should not warn import/export sources.
		{
			code: "import \"a\"; import 'b';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "import a from \"a\"; import b from 'b';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},
		{
			code: "export * from \"a\"; export * from 'b';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6, sourceType: "module" },
		},

		// `backtick` should not warn module export names.
		{
			code: "import { \"a\" as b, 'c' as d } from 'mod';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "let a, c; export { a as \"b\", c as 'd' };",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "export { \"a\", 'b' } from 'mod';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "export { a as \"b\", c as 'd' } from 'mod';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "export { \"a\" as b, 'c' as d } from 'mod';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "export { \"a\" as \"b\", 'c' as 'd' } from 'mod';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "export * as \"a\" from 'mod';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},
		{
			code: "export * as 'a' from 'mod';",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022, sourceType: "module" },
		},

		// `backtick` should not warn property/method names (not computed).
		{
			code: "var obj = {\"key0\": 0, 'key1': 1};",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class Foo { 'bar'(){} }",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class Foo { static ''(){} }",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
		},
		{
			code: "class C { \"double\"; 'single'; }",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022 },
		},
	],
	invalid: [
		{
			code: "var foo = 'bar';",
			output: 'var foo = "bar";',
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: 'var foo = "bar";',
			output: "var foo = 'bar';",
			options: ["single"],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = `bar`;",
			output: "var foo = 'bar';",
			options: ["single"],
			languageOptions: {
				ecmaVersion: 6,
			},
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "var foo = 'don\\'t';",
			output: 'var foo = "don\'t";',
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: 'var msg = "Plugin \'" + name + "\' not found"',
			output: "var msg = 'Plugin \\'' + name + '\\' not found'",
			options: ["single"],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
					column: 11,
				},
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
					column: 31,
				},
			],
		},
		{
			code: "var foo = 'bar';",
			output: 'var foo = "bar";',
			options: ["double"],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = `bar`;",
			output: 'var foo = "bar";',
			options: ["double"],
			languageOptions: {
				ecmaVersion: 6,
			},
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: 'var foo = "bar";',
			output: "var foo = 'bar';",
			options: ["single", { avoidEscape: true }],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = 'bar';",
			output: 'var foo = "bar";',
			options: ["double", { avoidEscape: true }],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = '\\\\';",
			output: 'var foo = "\\\\";',
			options: ["double", { avoidEscape: true }],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: 'var foo = "bar";',
			output: "var foo = 'bar';",
			options: ["single", { allowTemplateLiterals: true }],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = 'bar';",
			output: 'var foo = "bar";',
			options: ["double", { allowTemplateLiterals: true }],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = 'bar';",
			output: "var foo = `bar`;",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = 'b${x}a$r';",
			output: "var foo = `b\\${x}a$r`;",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: 'var foo = "bar";',
			output: "var foo = `bar`;",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: 'var foo = "bar";',
			output: "var foo = `bar`;",
			options: ["backtick", { avoidEscape: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = 'bar';",
			output: "var foo = `bar`;",
			options: ["backtick", { avoidEscape: true }],
			languageOptions: { ecmaVersion: 2015 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},

		// "use strict" is *not* a directive prologue in these statements so is subject to the rule
		{
			code: 'var foo = `backtick`; "use strict";',
			output: "var foo = `backtick`; `use strict`;",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: '{ "use strict"; var foo = `backtick`; }',
			output: "{ `use strict`; var foo = `backtick`; }",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: 'if (1) { "use strict"; var foo = `backtick`; }',
			output: "if (1) { `use strict`; var foo = `backtick`; }",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},

		// `backtick` should warn computed property names.
		{
			code: "var obj = {[\"key0\"]: 0, ['key1']: 1};",
			output: "var obj = {[`key0`]: 0, [`key1`]: 1};",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "class Foo { ['a'](){} static ['b'](){} }",
			output: "class Foo { [`a`](){} static [`b`](){} }",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},

		// https://github.com/eslint/eslint/issues/7084
		{
			code: '<div blah={"blah"} />',
			output: "<div blah={'blah'} />",
			options: ["single"],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "<div blah={'blah'} />",
			output: '<div blah={"blah"} />',
			options: ["double"],
			languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "<div blah={'blah'} />",
			output: "<div blah={`blah`} />",
			options: ["backtick"],
			languageOptions: {
				parserOptions: { ecmaFeatures: { jsx: true } },
				ecmaVersion: 2015,
			},
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},

		// https://github.com/eslint/eslint/issues/7610
		{
			code: "`use strict`;",
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "function foo() { `use strict`; foo(); }",
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "foo = function() { `use strict`; foo(); }",
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "() => { `use strict`; foo(); }",
			output: null,
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "() => { foo(); `use strict`; }",
			output: null, // no autofix
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "foo(); `use strict`;",
			output: null, // no autofix
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},

		// https://github.com/eslint/eslint/issues/7646
		{
			code: "var foo = `foo\\nbar`;",
			output: 'var foo = "foo\\nbar";',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "var foo = `foo\\\nbar`;", // 1 backslash followed by a newline
			output: 'var foo = "foo\\\nbar";',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "var foo = `foo\\\\\\\nbar`;", // 3 backslashes followed by a newline
			output: 'var foo = "foo\\\\\\\nbar";',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "````",
			output: '""``',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
					line: 1,
					column: 1,
				},
			],
		},

		// Strings containing octal escape sequences. Don't autofix to backticks.
		{
			code: 'var foo = "\\1"',
			output: "var foo = '\\1'",
			options: ["single"],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = '\\1'",
			output: 'var foo = "\\1"',
			options: ["double"],
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "var notoctal = '\\0'",
			output: "var notoctal = `\\0`",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = '\\1'",
			output: null,
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: 'var foo = "\\1"',
			output: null,
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = '\\01'",
			output: null,
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = '\\0\\1'",
			output: null,
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = '\\08'",
			output: null,
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = 'prefix \\33'",
			output: null,
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var foo = 'prefix \\75 suffix'",
			output: null,
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "var nonOctalDecimalEscape = '\\8'",
			output: null,
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},

		// class members
		{
			code: "class C { 'foo'; }",
			output: 'class C { "foo"; }',
			options: ["double"],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "class C { 'foo'() {} }",
			output: 'class C { "foo"() {} }',
			options: ["double"],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: 'class C { "foo"; }',
			output: "class C { 'foo'; }",
			options: ["single"],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
				},
			],
		},
		{
			code: 'class C { "foo"() {} }',
			output: "class C { 'foo'() {} }",
			options: ["single"],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "singlequote" },
					type: "Literal",
				},
			],
		},
		{
			code: 'class C { ["foo"]; }',
			output: "class C { [`foo`]; }",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: 'class C { foo = "foo"; }',
			output: "class C { foo = `foo`; }",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 2022 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},

		// https://github.com/eslint/eslint/pull/17022
		{
			code: "() => { foo(); (`use strict`); }",
			output: '() => { foo(); ("use strict"); }',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "('foo'); \"bar\";",
			output: "(`foo`); `bar`;",
			options: ["backtick"],
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
				{
					messageId: "wrongQuotes",
					data: { description: "backtick" },
					type: "Literal",
				},
			],
		},
		{
			code: "; 'use asm';",
			output: '; "use asm";',
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "Literal",
				},
			],
		},
		{
			code: "{ `foobar`; }",
			output: '{ "foobar"; }',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
		{
			code: "foo(() => `bar`);",
			output: 'foo(() => "bar");',
			languageOptions: { ecmaVersion: 6 },
			errors: [
				{
					messageId: "wrongQuotes",
					data: { description: "doublequote" },
					type: "TemplateLiteral",
				},
			],
		},
	],
});
