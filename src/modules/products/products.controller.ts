import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { throwError, catchError } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() dt: CreateProductDto) {
    return this.natsClient.send({ cmd: 'create_product' }, dt).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }

  @Get()
  findAllProducts(@Query() pg: PaginationDto) {
    return this.natsClient.send({ cmd: 'find_all_products' }, pg).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }

  @Get(':id')
  async findOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dt: UpdateProductDto) {
    return this.natsClient.send({ cmd: 'update_product' }, { ...dt, id }).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }

  @Delete(':id')
  removeProduct(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send({ cmd: 'remove_product' }, { id }).pipe(
      catchError((error) => throwError(() => new RpcException(error)))
    )
  }
}
