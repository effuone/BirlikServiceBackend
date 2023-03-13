import { Router } from "express";
import ProjectController from "../controllers/ProjectController";
import multer from "multer";

export const ProjectRouter = Router()
let upload = multer({dest: `${process.cwd()}/documents/certificates`})

ProjectRouter.get('/projects/', ProjectController.getProjects)
ProjectRouter.get('/projects/:id', ProjectController.getProject)
ProjectRouter.post('/projects/', upload.single('file'), ProjectController.createProject)