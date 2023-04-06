import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import {validationResult} from 'express-validator'
import 'dotenv/config'
import databaseContext from '../database/databaseContext';
// import sendEmail from '../services/mailService';
import * as fs from 'fs/promises'

const generateAccessToken = (credentials)=> {
    return jwt.sign({...credentials}, process.env.JWT_KEY, {expiresIn:'24h'})
}

class UserController {
    async registration(req,res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Registration error", errors})
            }
            const {username, password, firstName, lastName, email, phoneNumber, position} = req.body
            const candidate = await databaseContext.query('SELECT* FROM users where username like $1', [username])
            if(candidate.rowCount >= 1) {
                return res.status(400).json({message:'This user already exists'})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const newUser = await databaseContext.query(
                'INSERT INTO users (username, first_name, last_name, email, password_hash, phone_number, employment_position)'
                +
                'VALUES ($1,$2,$3,$4,$5,$6, $7) RETURNING *'
            , [username, firstName, lastName, email, hashPassword, phoneNumber, position])
            await databaseContext.query('INSERT INTO user_specializations (user_id, specialization_id) values ($1,$2) RETURNING *', [newUser.rows[0].id, 1])
            return res.json({message: "User created successfully!"})
        }catch(e){
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req,res){
        try{
            const {username, password} = req.body
            const getUserQuery = await databaseContext.query('SELECT* FROM users where username like $1', [username])
            if(getUserQuery.rowCount <= 0 ) {
                return res.status(400).json({message:'User not found or wrong password'})
            }
            const dbUserId = (getUserQuery.rows[0]).id
            const role = await databaseContext.query('SELECT users.id, specializations.name FROM user_specializations, users, specializations where user_specializations.user_id = users.id and user_specializations.specialization_id = specializations.id and users.id = $1', [dbUserId])
            const dbPassword = (getUserQuery.rows[0]).password_hash
            const validPassword = bcrypt.compareSync(password, dbPassword)
            if(!validPassword) return res.status(400).json({message:'User not found or wrong password'})

            // if(!(getUserQuery.rows[0]).email_confirmed) return res.status(400).json({message:"Confirm your email first"})
            const credenetials = (await databaseContext.query(`SELECT* from users where id = $1`, [dbUserId])).rows[0]
            credenetials.role = (role.rows[0]).name
            const token = generateAccessToken(credenetials)
            return res.json({token})
        }catch(e){

        }
    }
    async verifyEmail(req,res){
        try{
            const id = req.params.id
            const existingModel = await databaseContext.query(`SELECT* FROM users where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('User not found')
            const query = await databaseContext.query('UPDATE users SET email_confirmed = $2 WHERE id = $1',[id, true])
            if(query.rowCount >= 0)
            {
                res.redirect(process.env.FRONTAPP_URL);
            }
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async resetPassword(req,res){
        try{
            const id = req.params.id
            const {password} = req.body; 
            const existingModel = await databaseContext.query(`SELECT* FROM users where id = $1`, [id])
            if(existingModel.rowCount <= 0)
                return res.status(404).json('User not found')
            const newHashPassword = bcrypt.hashSync(password, 7);
            const query = await databaseContext.query('UPDATE users SET password_hash = $2 WHERE id = $1',[id, newHashPassword])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully reseted password')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
    async getUsers(req,res){
        try{
            const models = await databaseContext.query(`SELECT * FROM users ORDER BY id`);
            res.json(models.rows)
        }catch(e){
            console.log(e)
        }
    }
    async getUser(req,res){
        try{
            const id = req.params.id
            const model = await databaseContext.query(`SELECT users.id, users.username, users.first_name as "firstName", users.last_name as "lastName", users.email, users.phone_number as "phoneNumber", users.employment_position as position from users where users.id = $1`, [id])
            if(model.rowCount > 0)
                res.json(model.rows[0])
            else 
                return res.status(404).json('User not found')
        }catch(e){
            console.log(e)
        }
    }
    async updateUser(req, res) {
        try {
          const { id } = req.params;
          const { username, firstName, lastName, email, phoneNumber, position } = req.body;
          const candidate = await databaseContext.query('SELECT * FROM users WHERE id = $1', [id]);
          if (!candidate.rows[0]) {
            return res.status(404).json({ message: 'Staff not found' });
          }
      
          const updatedModel = await databaseContext.query(
            'UPDATE users SET username = $1, first_name = $2, last_name = $3, email = $4, phone_number = $5, employment_position = $6 WHERE id = $7 RETURNING *',
            [username, firstName, lastName, email, phoneNumber, position, id]
          );
      
          res.status(204).json(updatedModel.rows[0]);
        } catch (e) {
          console.log(e);
          res.status(400).json({ message: 'Error updating user' });
        }
    }
    async deleteUser(req,res){
        try{
            const id = req.params.id
            const existingModel = await databaseContext.query(`SELECT* FROM users where id = $1`, [id])
            if(existingModel.rowCount < 0)
                return res.status(404).json('User not found')
            const query = await databaseContext.query('DELETE FROM users where id = $1', [id])
            if(query.rowCount >= 0)
                res.status(204).json('Successfully deleted')
            else
                res.status(400)
        }catch(e){
            console.log(e)
        }
    }
}

export default new UserController()