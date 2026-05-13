import { forwardRef } from '@nestjs/common';
import { TransportModule } from '../transport/transport.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Payment]),
    forwardRef(() => TransportModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
