const boardService = require('./board.service.js')
const socketService = require('../../services/socket.service.js')
const logger = require('../../services/logger.service')

async function getBoards(req, res) {
	try {
		logger.debug('Getting Boards')
		const filterBy = {
			txt: req.query.txt || '',
		}
		const boards = await boardService.query(filterBy)
		res.json(boards)
	} catch (err) {
		logger.error('Failed to get boards', err)
		res.status(500).send({ err: 'Failed to get boards' })
	}
}

async function getBoardById(req, res) {
	try {
		const boardId = req.params.id
		const board = await boardService.getById(boardId)
		res.json(board)
	} catch (err) {
		logger.error('Failed to get board', err)
		res.status(500).send({ err: 'Failed to get board' })
	}
}

async function addBoard(req, res) {
	const { loggedinUser } = req

	try {
		const board = req.body
		board.owner = loggedinUser
		const addedBoard = await boardService.add(board)
		res.json(addedBoard)
	} catch (err) {
		logger.error('Failed to add board', err)
		res.status(500).send({ err: 'Failed to add board' })
	}
}

async function updateBoard(req, res) {
	const { loggedinUser } = req
	try {
		const board = req.body
		const updatedBoard = await boardService.update(board)
		res.json(updatedBoard)
		socketService.broadcast({
			type: 'board-get-update',
			data: board,
			room: board._id,
			userId: loggedinUser._id
		})
	} catch (err) {
		logger.error('Failed to update board', err)
		res.status(500).send({ err: 'Failed to update board' })
	}
}

async function removeBoard(req, res) {
	try {
		const boardId = req.params.id
		const removedId = await boardService.remove(boardId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove board', err)
		res.status(500).send({ err: 'Failed to remove board' })
	}
}

module.exports = {
	getBoards,
	getBoardById,
	addBoard,
	updateBoard,
	removeBoard,
}
