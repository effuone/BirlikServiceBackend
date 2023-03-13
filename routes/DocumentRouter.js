import { Router } from "express";
import DocumentController from "../controllers/DocumentController";
import multer from "multer";

export const DocumentRouter = Router()

DocumentRouter.get('/documents/', DocumentController.getDocuments)
DocumentRouter.post('/documents/', upload.single('file'), DocumentController.createDocument)