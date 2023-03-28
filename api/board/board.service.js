const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '' }) {
	try {
		const criteria = {
			// vendor: { $regex: filterBy.txt, $options: 'i' }
		}
		const collection = await dbService.getCollection('board')
		var boards = await collection.find(criteria).toArray()
		return boards
	} catch (err) {
		logger.error('cannot find boards', err)
		throw err
	}
}

async function getById(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		const board = collection.findOne({ _id: new ObjectId(boardId) })
		return board
	} catch (err) {
		logger.error(`while finding board ${boardId}`, err)
		throw err
	}
}

async function remove(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		await collection.deleteOne({ _id: new ObjectId(boardId) })
		return boardId
	} catch (err) {
		logger.error(`cannot remove board ${boardId}`, err)
		throw err
	}
}

async function add(board) {
	try {
		const collection = await dbService.getCollection('board')
		await collection.insertOne(board)
		return board
	} catch (err) {
		logger.error('cannot insert board', err)
		throw err
	}
}

async function update(board) {
	try {
		const boardToSave = JSON.parse(JSON.stringify(board))
		delete boardToSave._id
		const collection = await dbService.getCollection('board')
		await collection.updateOne(
			{ _id: new ObjectId(board._id) },
			{ $set: boardToSave }
		)
		return board
	} catch (err) {
		logger.error(`cannot update board ${board.id}`, err)
		throw err
	}
}

module.exports = {
	remove,
	query,
	getById,
	add,
	update,
}
