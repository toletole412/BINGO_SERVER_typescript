import {
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get,
  Body, Patch
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Player, Board, Turn } from './entities'
import { Validate } from 'class-validator'
import {io} from '../index'
import { turnWord, randomWord, randomBoard } from './logic'


class GameUpdate {
  board: Board
  turn: Turn
}

@JsonController()
export default class GameController {

  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    @CurrentUser() user: User
  ) {
    const entity = await Game.create().save()

    const board = randomBoard(randomWord)

    await Player.create({
      game: entity,
      board,
      user
    }).save()

    const game = await Game.findOneById(entity.id)

    io.emit('action', {
      type: 'ADD_GAME',
      payload: game
    })

    return game
  }

  @Authorized()
  @Post('/games/:id([0-9]+)/players')
  @HttpCode(201)
  async joinGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new BadRequestError(`Game does not exist`)
    if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

    game.status = 'started'

    await game.save()

    const board = randomBoard(randomWord)

    const player = await Player.create({
      game,
      board,
      user
    }).save()

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: await Game.findOneById(game.id)
    })

    return player
  }


  @Patch('/games/:id([0-9]+)')  //[0-9]+ 의미가 뭐지?
  async selectWord(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    @Body() update: GameUpdate
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)

    const turn = turnWord(randomWord)

    game.turn = turn
    await game.save()

    console.log(game)

    io.emit('action', {
      type: 'SELECT_WORD',
      payload: game
    })

    return game
  }



  @Authorized()
  @Get('/games')
  getGames() {
    return Game.find()
  }

  @Authorized()
  @Get('/games/:id([0-9]+)')
  getGame(
    @Param('id') id: number
  ) {
    return Game.findOneById(id)
  }
}
