import { Table } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { prisma } from "../utils/Prisma";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";

export class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const userExists = await prisma.user.findUnique({where: {email}})
        if(userExists) return res.json({err: "User found"})
        
        const hash_password = await hash(password, 8);
        const user = await prisma.user.create({
            data: {
                id: uuidv4(),name, email, password: hash_password
            }
        })

        const table = await prisma.table.create({
            data: {
                id: uuidv4(),
                userId: user.id
            }
        })
        for(let c = 0; c <= 27; c++) {
            await prisma.cell.create({data: {tableId: table.id, name: '-', createdAt: moment().format('YYYY-MM-DD HH:mm:ss') }})
        } 
        
        const token = sign({id: user.id}, process.env.SECRET as string)
        return res.json({id: user.id, name: user.name, tableId: table.id, token})
    }

    async authenticate(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({where: {email}})
        if(!user) return res.json({err: "User not found"})
        const isValuePassword= await compare(password, user.password);
        if(!isValuePassword) return res.json({err: "Password invalid"})

        const tableExists = await prisma.table.findFirst({where: {userId: user.id}}) as Table

        const token = sign({id: user.id}, process.env.SECRET as string)
        return res.json({id: user.id, name: user.name, tableId: tableExists.id, token})
    }

    async read(req: Request, res: Response) {
      const users = await prisma.user.findMany();  
      return res.json({users});
    }
}