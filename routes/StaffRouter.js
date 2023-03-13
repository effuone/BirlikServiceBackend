import { Router } from "express";
import StaffController from "../controllers/StaffController";
import express from 'express'
import path from 'path'
import multer from "multer";
let upload = multer({dest: `${process.cwd()}/documents/resumes`})
export const StaffRouter = Router()

StaffRouter.use('/staffs/resumes', express.static(path.join(process.cwd(), 'documents', 'resumes')));
StaffRouter.post('/staffs/', upload.single('file'), StaffController.createStaff)
StaffRouter.get('/staffs/', StaffController.getStaffs)
StaffRouter.get('/staffs/:id', StaffController.getStaff)
StaffRouter.put('/staffs/:id', StaffController.updateStaff)
StaffRouter.delete('/staffs/:id', StaffController.deleteStaff)
