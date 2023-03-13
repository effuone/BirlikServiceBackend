import databaseContext from '../database/databaseContext'
import fs from 'fs'
let upload = multer({dest: `${process.cwd()}/documents/certificates`})

const certificatesDirectory = `${process.cwd()}/documents/certificates`

class CertificateController{
    async createCertificate(req,res){
        try {
            
        } catch (e) {
            console.log(e);
            res.status(500).json('Error creating file');
        }
    }
    async getCertificate(req,res){
        try{

        }catch(e){
            console.log(e)
        }
    }
    async getCertificates(req,res){
        try{

        }catch(e){
            console.log(e)
        }
    }
    async updateCertificate(req,res){
        try{

        }catch(e){
            console.log(e)
        }
    }
    async deleteCertificate(req,res){
        try{

        }catch(e){
            console.log(e)
        }
    }
}
export default new CertificateController()