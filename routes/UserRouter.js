import { Router } from "express";
import UserController from "../controllers/UserController";

export const UserRouter = Router()

UserRouter.post('/users/register', UserController.registration)
UserRouter.post('/users/login', UserController.login)
UserRouter.get('/users/', UserController.getUsers)
UserRouter.get('/users/:id', UserController.getUser)
UserRouter.put('/users/:id', UserController.updateUser)
UserRouter.delete('/users/:id', UserController.deleteUser)