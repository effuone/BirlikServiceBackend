const projectsDirectory = `${process.cwd()}/documents/projects`

class DocumentController {
  async createDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json('No file uploaded');
      }
      let currentDirectory = certificatesDirectory
      const {docType} = req.body
      if(docType !== 'certificate') {
        currentDirectory=projectsDirectory
      }
      // Get the path of the uploaded file and construct the destination path using the custom directory
      const filePath = req.file.path;
      const destinationPath = `${currentDirectory}/${req.file.originalname}`;
  
      // Move the file to the custom directory
      fs.renameSync(filePath, destinationPath);
  
      // Create a new model with the destination path
      const model = await databaseContext.query(
        `INSERT INTO documents (path) VALUES ($1) RETURNING *`,
        [destinationPath]
      );
  
      res.status(200).json(model.rows[0]);
    } catch (e) {
      console.log(e);
      res.status(500).json('Error creating file');
    }
  }

  async getDocument(req, res) {
    try {
      const id = req.params.id
      const model = await databaseContext.query(
        `SELECT * FROM documents WHERE id = $1`,
        [id]
      )

      if (model.rowCount === 0) {
        return res.status(404).json('File not found')
      }

      const file = fs.readFileSync(model.rows[0].path)

      res.setHeader('Content-Type', 'application/pdf')
      res.send(file)
    } catch (e) {
      console.log(e)
      res.status(500).json('Error getting file')
    }
  }

  async getDocuments(req, res) {
    try {
      const models = await databaseContext.query('SELECT * FROM documents')
      res.json(models.rows)
    } catch (e) {
      console.log(e)
      res.status(500).json('Error getting files')
    }
  }

  async updateDocument(req, res) {
    try {
      const id = req.params.id
      const { filename, path } = req.body
      const existingModel = await databaseContext.query(
        `SELECT * FROM documents WHERE id = $1`,
        [id]
      )

      if (existingModel.rowCount === 0) {
        return res.status(404).json('File not found')
      }

      const query = await databaseContext.query(
        `UPDATE documents SET filename = $2, path = $3 WHERE id = $1`,
        [id, filename, path]
      )

      if (query.rowCount === 0) {
        return res.status(400).json('Error updating file')
      }

      res.status(204).json('Successfully updated')
    } catch (e) {
      console.log(e)
      res.status(500).json('Error updating file')
    }
  }

  async deleteDocument(req, res) {
    try {
      const id = req.params.id
      const existingModel = await databaseContext.query(
        `SELECT * FROM documents WHERE id = $1`,
        [id]
      )

      if (existingModel.rowCount === 0) {
        return res.status(404).json('File not found')
      }

      fs.unlinkSync(existingModel.rows[0].path)

      const query = await databaseContext.query(`DELETE FROM documents WHERE id = $1`, [
        id,
      ])

      if (query.rowCount === 0) {
        return res.status(400).json('Error deleting file')
      }

      res.status(204).json('Successfully deleted')
    } catch (e) {
      console.log(e)
      res.status(500).json('Error deleting file')
    }
  }
}

export default new DocumentController()