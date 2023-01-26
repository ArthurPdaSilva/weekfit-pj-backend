import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
}

export function AuthMiddlewares(
    req: Request, res: Response, next: NextFunction
) {
    const { authorization } = req.headers;

    if(!authorization) return res.json({err: 'Token not provided'})

    const [, token] = authorization.split(" ");

    try {
        const decoded = verify(token, process.env.SECRET as string);
        const { id } = decoded as TokenPayload;
        req.userId = id;
        next();
    } catch(err) {
        return res.json({err: 'Token invalid'})
    }
}