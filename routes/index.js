import { Router } from "express";
import { UserRouter } from "./UserRouter";
import { SpecializationRouter } from "./SpecializationRouter";
import { StaffRouter } from "./StaffRouter";
import { CertificateRouter } from "./CertificateRouter";
export const routes = Router()
routes.use(UserRouter)
routes.use(SpecializationRouter)
routes.use(StaffRouter)
routes.use(CertificateRouter)