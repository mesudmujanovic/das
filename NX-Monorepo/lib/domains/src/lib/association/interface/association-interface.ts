import { FieldI } from "./field-interface";

export interface AssociationI {
    id: number;
    fields: FieldI[];
    finalSolutions: string;
    solutions: {
        "A": string;
        "B": string;
        "C": string;
        "D": string;
    };

}
