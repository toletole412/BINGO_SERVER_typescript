import { JsonController, Post, Param, Get, Body, Authorized } from 'routing-controllers'
import User from './entity';

@JsonController()
export default class UserController {
//signup endpoint
  @Post('/users')
  async signup(
    @Body() user: User
  ) {
    const {password, ...rest} = user
    const entity = User.create(rest) //rest 가 뭐지
    await entity.setPassword(password)
    return entity.save()
  }

  @Authorized() //아무나 정보 못 가져오게 하는 역할
  @Get('/users/:id([0-9]+)')
  getUser(
    @Param('id') id: number
  ) {
    return User.findOneById(id)
  }

  @Authorized()
  @Get('/users')
  allUsers() {
    return User.find()
  }
}
