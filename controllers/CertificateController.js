import databaseContext from '../database/databaseContext'
import fs from 'fs'
import { removeSpacesBetweenWords } from '../utils/removeSpacesBetweenWords';

const certificatesDirectory = `${process.cwd()}/documents/certificates`

class CertificateController{
    async createCertificate(req,res){
        try {
            const { description, achievementDate, staffId } = req.body;
            const documentIds = []
            for (let i = 0; i < req.files.length; i++) {
              const file = req.files[i];
              const filePath = file.path;
              const destinationPath = `${certificatesDirectory}/${removeSpacesBetweenWords(file.originalname)}`;
              fs.renameSync(filePath, destinationPath);
              const documentModel = await databaseContext.query(
                `INSERT INTO documents (path, filename) VALUES ($1, $2) RETURNING *`,
                [destinationPath, file.originalname]
              );
              if (documentModel.rowCount !== 1) {
                throw new Error("Could not create document for certificate");
              }
              documentIds.push(documentModel.rows[0].id)
            }
            const certificateModel = await databaseContext.query(
              `INSERT INTO certificates (description, achievement_date, staff_id) VALUES ($1, $2, $3) RETURNING *`,
              [description, achievementDate, staffId]
            );
            if (certificateModel.rowCount !== 1) {
              throw new Error("Could not create certificate");
            }
            const certificateId = certificateModel.rows[0].id;
            const certificateDocumentsModel = await databaseContext.query(
              `INSERT INTO certificates_documents (certificate_id, document_id) VALUES ${documentIds
                .map((id) => `(${certificateId}, ${id})`)
                .join(", ")}`
            );
            if (certificateDocumentsModel.rowCount !== documentIds.length) {
              throw new Error("Could not associate all documents with certificate");
            }
            return res.status(200).json({ message: "Certificate created successfully!" });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Error creating certificate" });
        }
    }
    async getCertificate(req,res){
        try{
          
        }catch(e){
            console.log(e)
        }
    }
    async getCertificates(req,res){
      try {
        const certificatesModel = await databaseContext.query(
          `SELECT 
           users.first_name, users.last_name, users.employment_position, staff.pedagogical_excellence, certificates.id 
           FROM users, staffs, certificates, certificates_documents 
           WHERE users.id = staffs.user_id and staffs.id = certificates.staff_id and certificates_documents.certificate_id = certificates.id`)
      } catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Error getting staff' });
      }
    }
    async getuSERCertificates(req,res){
      try {
        const certificateModels = await databaseContext.query('SELECT users.first_name, users.last_name, users.employment_position, staffs.pedagogical_excellence, certificates.id FROM certificates');
        const documentsData = [];
  
        for (let i = 0; i < certificateModels.rows.length; i++) {
          const documentId = certificateModels.rows[i].resume_id;
          const document = await databaseContext.query('SELECT * FROM documents WHERE id = $1', [documentId]);
          if (!document.rows[0]) {
            return res.status(404).json({ message: 'document not found' });
          }
          const certificateUrl = `${process.env.BACKEND_URL}/api/certificates/documents/${path.basename(document.rows[0].path)}`;
          const certificateItem = {
            id: certificateModels.rows[i].id,
            firstName: certificateModels.rows[i].first_name,              
            lastName: certificateModels.rows[i].last_name,              
            email: certificateModels.rows[i].email,              
            phoneNumber: certificateModels.rows[i].phone_number, 
            position: certificateModels.rows[i].employment_position,  
            excellence: certificateModels.rows[i].pedagogical_excellence,        
            progressPlan: certificateModels.rows[i].progress_plan,        
            resumeUrl: resumeUrl
          };
          documentsData.push(certificateItem);
        }
        res.json(documentsData);
      } catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Error getting staff' });
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