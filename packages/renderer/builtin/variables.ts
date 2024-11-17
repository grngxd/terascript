import { GeneratorContext } from "+renderer/generator";
import { ScratchProject } from "+scratch";
import { TypeChecker, VariableDeclaration } from "ts-morph";

// example code to be rendered by the generator:
//
// const a = 5;
// const b = a + 10;

export const renderVariableDeclaration = (ctx: GeneratorContext, scratchProject: ScratchProject, node: VariableDeclaration, checker: TypeChecker) => {
    
};