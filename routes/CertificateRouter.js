import { Router } from "express";
import CertificateController from "../controllers/CertificateController";
import multer from "multer";

export const CertificateRouter = Router()
let upload = multer({dest: `${process.cwd()}/documents/certificates`})

CertificateRouter.get('/certificates/', CertificateController.getCertificates)
CertificateRouter.get('/certificates/:id', CertificateController.getCertificate)
CertificateRouter.post('/certificates/', upload.single('file'), CertificateController.createCertificate)