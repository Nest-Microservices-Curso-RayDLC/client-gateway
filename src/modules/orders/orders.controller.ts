import { Controller, Get, Post, Body, Patch, Param, Inject, Query, ParseUUIDPipe } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, OrdersByStatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) {}

  @Post()
  create(@Body() dt: CreateOrderDto) {
    return this.natsClient.send({ cmd: 'create_order' }, dt).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }

  @Get()
  findAll(@Query() pg: OrderPaginationDto) {
    return this.natsClient.send({ cmd: 'find_all_orders' }, pg).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.natsClient.send({ cmd: 'find_one_order' }, { id }).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }

  @Get(':status')
  findByStatus(
    @Param() dt: OrdersByStatusDto,
    @Query() pg: PaginationDto
  ) {
    return this.natsClient.send({ cmd: 'find_orders_by_status' }, { ...dt, ...pg }).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }

  @Patch(':id')
  updateOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dt: OrdersByStatusDto) {
    return this.natsClient.send({ cmd: 'update_order_status' }, { id, ...dt }).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }
}
