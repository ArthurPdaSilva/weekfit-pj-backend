// Adicionei uma tipagem a mais no express
declare namespace Express {
    export interface Request {
        userId: string
    }
}