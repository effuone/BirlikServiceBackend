import databaseContext from '../database/databaseContext'
import fs from 'fs'

const projectsDirectory = `${process.cwd()}/documents/projects`

let upload = multer({dest: projectsDirectory})

class ProjectController{
    async createProject(req,res){
        try{    
            
        }catch(e){
            console.log(e)
        }
    }
    async getProject(req,res){
        try{

        }catch(e){
            console.log(e)
        }
    }
    async getProjects(req,res){
        try{

        }catch(e){
            console.log(e)
        }
    }
    async updateProject(req,res){
        try{

        }catch(e){
            console.log(e)
        }
    }
    async deleteProject(req,res){
        try{

        }catch(e){
            console.log(e)
        }
    }
}
export default new ProjectController()