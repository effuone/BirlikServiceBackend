import databaseContext from "../database/databaseContext"
import fs from 'fs'
import path from "path";
import { removeSpacesBetweenWords } from "../utils/removeSpacesBetweenWords";
const plansDirectory = `${process.cwd()}/documents/plans`

class StaffController {
    async createStaff(req,res){ 
        try{
            let {userId, progressPlan, pedagogicalExcellence} = req.body;
            userId = parseInt(userId)
            const candidate = await databaseContext.query('SELECT* FROM staffs where user_id = $1', [userId])
            if(candidate.rowCount >= 1) {
                return res.status(400).json({message:'This staff already exists'})
            }
            if (!req.file) {
                return res.status(400).json({message:'Resume is missing'})
            }
            // Get the path of the uploaded file and construct the destination path using the custom directory
            const filePath = req.file.path;
            const destinationPath = `${plansDirectory}/${removeSpacesBetweenWords(req.file.originalname)}`;
        
            // Move the file to the custom directory
            fs.renameSync(filePath, destinationPath);
        
            // Create a new model with the destination path
            const documentModel = await databaseContext.query(
              `INSERT INTO documents (path, filename) VALUES ($1, $2) RETURNING *`,
              [destinationPath, req.file.originalname]
            );
            if(!documentModel.rows[0]){
                res.status(400).json("Bad request with file upload");
            }
            const resumeId = documentModel.rows[0].id;
            const newStaff = await databaseContext.query(
                'INSERT INTO staffs (user_id, resume_id, progress_plan, pedagogical_excellence)'
                +
                'VALUES ($1,$2,$3,$4) RETURNING *'
            , [userId, resumeId, progressPlan, pedagogicalExcellence])
            if(newStaff.rows[0]) return res.json({message: "Staff created successfully!"})
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }
    async getStaffs(req, res) {
        try {
          const staffModels = await databaseContext.query('SELECT staffs.id as id, users.id as user_id, users.username, users.first_name, users.last_name, users.email, users.phone_number, users.employment_position, staffs.pedagogical_excellence, staffs.progress_plan, staffs.resume_id from users, staffs where users.id = staffs.user_id');
          const staffData = [];
    
          for (let i = 0; i < staffModels.rows.length; i++) {
            const resumeId = staffModels.rows[i].resume_id;
            const resume = await databaseContext.query('SELECT * FROM documents WHERE id = $1', [resumeId]);
            if (!resume.rows[0]) {
              return res.status(404).json({ message: 'Resume not found' });
            }
            const resumeUrl = `${process.env.BACKEND_URL}/api/staffs/resumes/${path.basename(resume.rows[0].path)}`;
            const staffItem = {
              id: staffModels.rows[i].id,
              firstName: staffModels.rows[i].first_name,              
              lastName: staffModels.rows[i].last_name,              
              email: staffModels.rows[i].email,              
              phoneNumber: staffModels.rows[i].phone_number, 
              position: staffModels.rows[i].employment_position,  
              excellence: staffModels.rows[i].pedagogical_excellence,        
              progressPlan: staffModels.rows[i].progress_plan,        
              resumeUrl: resumeUrl
            };
            staffData.push(staffItem);
          }
          res.json(staffData);
        } catch (e) {
          console.log(e);
          res.status(400).json({ message: 'Error getting staff' });
        }
    }
    async getStaff(req, res) {
        try {
          const { id } = req.params;
          const staff = await databaseContext.query('SELECT * FROM staffs WHERE id = $1', [id]);
          if (!staff.rows[0]) {
            return res.status(404).json({ message: 'Staff not found' });
          }
      
          const resumeId = staff.rows[0].resume_id;
          const resume = await databaseContext.query('SELECT * FROM documents WHERE id = $1', [resumeId]);
          if (!resume.rows[0]) {
            return res.status(404).json({ message: 'Resume not found' });
          }
      
          const resumeUrl = `${process.env.BACKEND_URL}/api/staffs/resumes/${path.basename(resume.rows[0].path)}`;
          const staffData = {
            id: staff.rows[0].id,
            user_id: staff.rows[0].user_id,
            progress_plan: staff.rows[0].progress_plan,
            resume_url: resumeUrl,
          };
          res.json(staffData);
        } catch (e) {
          console.log(e);
          res.status(400).json({ message: 'Error getting staff' });
        }
      }
    async updateStaff(req, res) {
        try {
          const { id } = req.params;
          const { userId, progressPlan } = req.body;
          const candidate = await databaseContext.query('SELECT * FROM staffs WHERE id = $1', [id]);
      
          if (!candidate.rows[0]) {
            return res.status(404).json({ message: 'Staff not found' });
          }
      
          const updatedStaff = await databaseContext.query(
            'UPDATE staffs SET user_id = $1, progress_plan = $2 WHERE id = $3 RETURNING *',
            [userId, progressPlan, id]
          );
      
          res.status(204).json(updatedStaff.rows[0]);
        } catch (e) {
          console.log(e);
          res.status(400).json({ message: 'Error updating staff' });
        }
    }
    async deleteStaff(req, res) {
        try {
          const { id } = req.params;
          const staff = await databaseContext.query('SELECT * FROM staffs WHERE id = $1', [id]);
          if (!staff.rows[0]) {
            return res.status(404).json({ message: 'Staff not found' });
          }
          const resumeId = staff.rows[0].resume_id;
          const resume = await databaseContext.query('SELECT * FROM documents WHERE id = $1', [resumeId]);
          await databaseContext.query('DELETE FROM staffs WHERE id = $1', [id]);
          await databaseContext.query('DELETE FROM documents WHERE id = $1', [resumeId]);
      
          const filePath = path.join(process.cwd(), 'documents', 'resumes', resume.rows[0].filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
      
          res.json({ message: 'Staff and resume deleted successfully' });
        } catch (e) {
          console.log(e);
          res.status(400).json({ message: 'Error deleting staff and resume' });
        }
    }
}

export default new StaffController();