import express from 'express';
import db from '../db.js';

const documentsRouter = express.Router();

documentsRouter.get('/next-document', async (req, res) => {
  try {

    const result = await db('documents').max('id as maxId').first();
    const maxId = result?.maxId || 0;

    let documentName = `Doc ${Math.floor(Math.random() * maxId * maxId).toString(16)}`;

    res.status(200).json({ nextId: maxId + 1, documentName });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error fetching next document' });
  }
});


documentsRouter.get('/', async (req, res) => {

  const { tableHeader, isAscending, offset, searchText } = req.query;
  const sortByHeader = tableHeader || 'id';
  const direction = isAscending === 'true' ? 'asc' : 'desc';
  const offsetValue = parseInt(offset, 10) || 0;

  const searchCondition = searchText ? `%${searchText}%` : null;

  try {
    let query = db('documents').select('*').where('isDeleted', false).orderBy(sortByHeader, direction).limit(200).offset(offsetValue);

    if (searchCondition) {
      query = query.where('documentName', 'like', searchCondition) 
        .orWhere('documentNumber', 'like', searchCondition)
        .orWhere('state', 'like', searchCondition); 
    }

    const documents = await query;

    const dataCountResult = await db('documents').countDistinct('id as count');
    const dataCount = dataCountResult[0].count;
    res.status(200).json({ dataCount, documents });
  } catch (error) {
    console.error('Error fetching documents:', error.message);
    res.status(500).send('Error fetching documents.');
  }

});


documentsRouter.put('/:id', async (req, res) => {

  const id = req.params.id;
  const { state, documentTotalAmount, stateTime } = req.body;

  try {

    const document = await db('documents').select('*').where('id', id).first();

    if (!document) {
      return res.status(404).json({ message: `Document with id ${id} not found.` });
    }

    const rowsUpdated = await db('documents')
      .where('id', id)
      .update({ state, documentTotalAmount, stateTime });

    if (rowsUpdated) {
      const updatedDocument = await db('documents').select('*').where('id', id).first();
      res.status(200).json({ success: true, document: updatedDocument });
    } else {
      res.status(500).json({ success: false, message: "Failed to update the document." });
    }
  } catch (error) {

    console.error('Error updating document:', error.message);
    res.status(500).json({ success: false, message: 'Error updating document.' });
  }
});


documentsRouter.post('/', async (req, res) => {
  const { id, state, stateTime, documentNumber, documentName, documentDate, documentTotalAmount } = req.body.postDocument;

  if (!id || typeof id !== 'number') {
    console.error('Invalid or missing ID:', id);
    return res.status(400).json({ success: false, message: 'Invalid or missing ID.' });
  }

  try {
    console.log('Inserting document with ID:', id);

    await db('documents').insert({
      id: id,
      state: state,
      stateTime: stateTime,
      documentNumber: documentNumber,
      documentName: documentName,
      documentDate: documentDate,
      documentTotalAmount: documentTotalAmount,
      version: 0,
      isDeleted: 0,
    });

    const updatedDocument = await db('documents')
      .select('*')
      .where('id', id)
      .first();

    if (updatedDocument) {
      res.status(200).json({ success: true, document: updatedDocument });
    } else {
      res.status(500).json({ success: false, message: "Failed to add document." });
    }
  } catch (error) {

    console.error('Error adding document:', error.message);
    res.status(500).json({ success: false, message: 'Error adding document.' });
  }
});

documentsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'id is required' });
  }

  try {
    const document = await db('documents').select('*').where('id', id).first();

    if (!document) {
      return res.status(404).json({ message: `Document with id ${id} not found.` });
    }

    await db('documents')
      .where('id', id)
      .update({ isDeleted: true });

    const result = await db('documents').max('id as maxId').first();
    const maxId = result?.maxId || 0;

    await resetAutoIncrement(maxId);

    res.status(200).json({ success: true, message: 'Document marked as deleted.' });
  } catch (error) {
    console.error('Error deleting document:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting document.' });
  }
});

async function resetAutoIncrement(currentMaxId) {
  try {
    await db.raw(`ALTER TABLE documents AUTO_INCREMENT = ${currentMaxId + 1}`);
    console.log(`Auto-increment reset to ${currentMaxId + 1}`);
  } catch (error) {
    console.error('Error resetting auto-increment:', error);
    throw new Error('Failed to reset auto-increment');
  }
}


export default documentsRouter;