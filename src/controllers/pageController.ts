import { Request, Response } from "express";

export const getHomePage = async(req:Request,res:Response)=>{

    res.status(200).json({message:" home page loaded success full"})

}