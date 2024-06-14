import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [
    ProductsModule,
    OrdersModule,
    NatsModule
  ],
})
export class AppModule {}
