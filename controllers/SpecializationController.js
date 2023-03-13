import databaseContext from "../database/databaseContext";

class SpecializationController {
    async createSpecialization(req,res){
        try{
            const {name} = req.body;
            const existingModel = await databaseContext.query(`SELECT* from specializations where name like $1`, [name])
            if(existingModel.rowCount > 0) res.status(400).json('Specialization already exists')
            const model = await databaseContext.query(`INSERT INTO specializations (name) VALUES ($1) RETURNING *`, [name])
            res.status(200).json(model.rows[0])
        }catch(e){
            console.log(e)
        }
    }
    async getSpecialization(req,res){
        try{
            const id = req.params.id
            const model = await databaseContext.query(`SELECT* FROM specializations where id = $1`, [id])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('Specialization not found')
        }catch(e){
            console.log(e)
        }
    }
    async getSpecializations(req,res){
        try{
            const models = await databaseContext.query('SELECT* FROM specializations')
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async updateSpecialization(req,res){
        try{
            const id = req.params.id
            const {name} = req.body; 
            const existingModel = await databaseContext.query(`SELECT* FROM specializations where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('specialization not found')
            const query = await databaseContext.query('UPDATE specializations SET name = $2 WHERE id = $1', [id, name])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully updated')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async deleteSpecialization(req,res){
        try{
            const id = req.params.id
            const existingModel = await databaseContext.query(`SELECT* FROM specializations where id = $1`, [id])
            if(existingModel.rowCount < 0)
                return res.status(404).json('Specialization not found')
            const query = await databaseContext.query('DELETE FROM specializations where id = $1', [id])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}
export default new SpecializationController()
