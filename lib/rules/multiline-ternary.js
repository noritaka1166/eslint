/**
 * @fileoverview Enforce newlines between operands of ternary expressions
 * @author Kai Cataldo
 * @deprecated in ESLint v8.53.0
 */

"use strict";

const astUtils = require("./utils/ast-utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('../types').Rule.RuleModule} */
module.exports = {
	meta: {
		deprecated: {
			message: "Formatting rules are being moved out of ESLint core.",
			url: "https://eslint.org/blog/2023/10/deprecating-formatting-rules/",
			deprecatedSince: "8.53.0",
			availableUntil: "10.0.0",
			replacedBy: [
				{
					message:
						"ESLint Stylistic now maintains deprecated stylistic core rules.",
					url: "https://eslint.style/guide/migration",
					plugin: {
						name: "@stylistic/eslint-plugin",
						url: "https://eslint.style",
					},
					rule: {
						name: "multiline-ternary",
						url: "https://eslint.style/rules/multiline-ternary",
					},
				},
			],
		},
		type: "layout",

		docs: {
			description:
				"Enforce newlines between operands of ternary expressions",
			recommended: false,
			url: "https://eslint.org/docs/latest/rules/multiline-ternary",
		},

		schema: [
			{
				enum: ["always", "always-multiline", "never"],
			},
		],

		messages: {
			expectedTestCons:
				"Expected newline between test and consequent of ternary expression.",
			expectedConsAlt:
				"Expected newline between consequent and alternate of ternary expression.",
			unexpectedTestCons:
				"Unexpected newline between test and consequent of ternary expression.",
			unexpectedConsAlt:
				"Unexpected newline between consequent and alternate of ternary expression.",
		},

		fixable: "whitespace",
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const option = context.options[0];
		const multiline = option !== "never";
		const allowSingleLine = option === "always-multiline";

		//--------------------------------------------------------------------------
		// Public
		//--------------------------------------------------------------------------

		return {
			ConditionalExpression(node) {
				const questionToken = sourceCode.getTokenAfter(
					node.test,
					astUtils.isNotClosingParenToken,
				);
				const colonToken = sourceCode.getTokenAfter(
					node.consequent,
					astUtils.isNotClosingParenToken,
				);

				const firstTokenOfTest = sourceCode.getFirstToken(node);
				const lastTokenOfTest =
					sourceCode.getTokenBefore(questionToken);
				const firstTokenOfConsequent =
					sourceCode.getTokenAfter(questionToken);
				const lastTokenOfConsequent =
					sourceCode.getTokenBefore(colonToken);
				const firstTokenOfAlternate =
					sourceCode.getTokenAfter(colonToken);

				const areTestAndConsequentOnSameLine =
					astUtils.isTokenOnSameLine(
						lastTokenOfTest,
						firstTokenOfConsequent,
					);
				const areConsequentAndAlternateOnSameLine =
					astUtils.isTokenOnSameLine(
						lastTokenOfConsequent,
						firstTokenOfAlternate,
					);

				const hasComments = !!sourceCode.getCommentsInside(node).length;

				if (!multiline) {
					if (!areTestAndConsequentOnSameLine) {
						context.report({
							node: node.test,
							loc: {
								start: firstTokenOfTest.loc.start,
								end: lastTokenOfTest.loc.end,
							},
							messageId: "unexpectedTestCons",
							fix(fixer) {
								if (hasComments) {
									return null;
								}
								const fixers = [];
								const areTestAndQuestionOnSameLine =
									astUtils.isTokenOnSameLine(
										lastTokenOfTest,
										questionToken,
									);
								const areQuestionAndConsOnSameLine =
									astUtils.isTokenOnSameLine(
										questionToken,
										firstTokenOfConsequent,
									);

								if (!areTestAndQuestionOnSameLine) {
									fixers.push(
										fixer.removeRange([
											lastTokenOfTest.range[1],
											questionToken.range[0],
										]),
									);
								}
								if (!areQuestionAndConsOnSameLine) {
									fixers.push(
										fixer.removeRange([
											questionToken.range[1],
											firstTokenOfConsequent.range[0],
										]),
									);
								}

								return fixers;
							},
						});
					}

					if (!areConsequentAndAlternateOnSameLine) {
						context.report({
							node: node.consequent,
							loc: {
								start: firstTokenOfConsequent.loc.start,
								end: lastTokenOfConsequent.loc.end,
							},
							messageId: "unexpectedConsAlt",
							fix(fixer) {
								if (hasComments) {
									return null;
								}
								const fixers = [];
								const areConsAndColonOnSameLine =
									astUtils.isTokenOnSameLine(
										lastTokenOfConsequent,
										colonToken,
									);
								const areColonAndAltOnSameLine =
									astUtils.isTokenOnSameLine(
										colonToken,
										firstTokenOfAlternate,
									);

								if (!areConsAndColonOnSameLine) {
									fixers.push(
										fixer.removeRange([
											lastTokenOfConsequent.range[1],
											colonToken.range[0],
										]),
									);
								}
								if (!areColonAndAltOnSameLine) {
									fixers.push(
										fixer.removeRange([
											colonToken.range[1],
											firstTokenOfAlternate.range[0],
										]),
									);
								}

								return fixers;
							},
						});
					}
				} else {
					if (
						allowSingleLine &&
						node.loc.start.line === node.loc.end.line
					) {
						return;
					}

					if (areTestAndConsequentOnSameLine) {
						context.report({
							node: node.test,
							loc: {
								start: firstTokenOfTest.loc.start,
								end: lastTokenOfTest.loc.end,
							},
							messageId: "expectedTestCons",
							fix: fixer =>
								hasComments
									? null
									: fixer.replaceTextRange(
											[
												lastTokenOfTest.range[1],
												questionToken.range[0],
											],
											"\n",
										),
						});
					}

					if (areConsequentAndAlternateOnSameLine) {
						context.report({
							node: node.consequent,
							loc: {
								start: firstTokenOfConsequent.loc.start,
								end: lastTokenOfConsequent.loc.end,
							},
							messageId: "expectedConsAlt",
							fix: fixer =>
								hasComments
									? null
									: fixer.replaceTextRange(
											[
												lastTokenOfConsequent.range[1],
												colonToken.range[0],
											],
											"\n",
										),
						});
					}
				}
			},
		};
	},
};
