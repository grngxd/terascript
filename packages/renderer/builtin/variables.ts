import { ScratchProject } from "+scratch";
import { Expression, ts, TypeChecker, VariableDeclaration } from "ts-morph";

// example code to be rendered by the generator:
//
// const a = 5;
// const b = a + 10;

export const renderVariableDeclaration = (scratchProject: ScratchProject, node: VariableDeclaration, checker: TypeChecker) => {
    // Evaluate the expression, handling both direct assignments and expressions with variable references
    const evaluateExpression = (expression: Expression<ts.Expression>, context: { [x: string]: any; }) => {
        const text = expression.getText();
        if (context[text] !== undefined) {
            return context[text];
        }
        try {
            return eval(text.replace(/([a-zA-Z_$][0-9a-zA-Z_$]*)/g, (match: string | number) => context[match] !== undefined ? context[match] : match));
        } catch (e) {
            console.log(`Could not evaluate: ${text}`);
            return text;
        }
    };

    // Context to store evaluated variable values
    const context: { [x: string]: any; } = {};

    // Loop through all variable declarations in the source file to populate the context
    const sourceFile = node.getSourceFile();
    sourceFile.getVariableDeclarations().forEach(declaration => {
        const name = declaration.getName();
        const initializer = declaration.getInitializer();
        if (initializer) {
            context[name] = evaluateExpression(initializer, context);
        }
    });

    // Get the value of the current variable declaration
    const name = node.getName();
    const initializer = node.getInitializer();
    let value;
    if (initializer) {
        value = evaluateExpression(initializer, context);
    }

    scratchProject.variable("Stage", name, value);
}
