import { Router } from "express";
import SpecializationController from "../controllers/SpecializationController";

export const SpecializationRouter = Router()
SpecializationRouter.post('/specializations/', SpecializationController.createSpecialization)
SpecializationRouter.get('/specializations/', SpecializationController.getSpecializations)
SpecializationRouter.get('/specializations/:id', SpecializationController.getSpecialization)
SpecializationRouter.put('/specializations/:id', SpecializationController.updateSpecialization)
SpecializationRouter.delete('/specializations/:id', SpecializationController.deleteSpecialization)
