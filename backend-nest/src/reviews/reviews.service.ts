import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Store } from '../stores/entities/store.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    private auditService: AuditService,
  ) {}

  private userId(user: any): number {
    return user.sub || user.id;
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepo.find({ relations: ['user', 'store', 'order'] });
  }

  async findByStore(storeId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { store: { id: storeId } },
      relations: ['user', 'order'],
      order: { createdAt: 'DESC' }
    });
  }

  async findAllForUser(user: any): Promise<Review[]> {
    if (user.role === 'admin') {
      return this.reviewRepo.find({ relations: ['user', 'store', 'order'], order: { createdAt: 'DESC' } });
    }
    if (user.role === 'store') {
      return this.reviewRepo.find({
        where: { store: { owner: { id: this.userId(user) } } },
        relations: ['user', 'store', 'order'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.reviewRepo.find({
      where: { user: { id: this.userId(user) } },
      relations: ['user', 'store', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: any, user: any): Promise<Review> {
    if (!data.orderId) throw new BadRequestException('Order is required to create a review');
    if (!data.rating || data.rating < 1 || data.rating > 5) throw new BadRequestException('Rating must be between 1 and 5');

    const order = await this.orderRepo.findOne({ where: { id: +data.orderId }, relations: ['client', 'store'] });
    if (!order) throw new NotFoundException('Order not found');
    if (order.client.id !== this.userId(user)) throw new ForbiddenException('Only the order client can review it');
    if (order.operationalStatus !== 'CLOSED') throw new BadRequestException('Only closed orders can be reviewed');

    const existing = await this.reviewRepo.findOne({ where: { order: { id: order.id }, user: { id: this.userId(user) } } });
    if (existing) throw new BadRequestException('This order already has a review from this client');

    const store = await this.storeRepo.findOne({ where: { id: order.store.id } });
    if (!store) throw new NotFoundException('Store not found');

    const review = this.reviewRepo.create({
      rating: data.rating,
      comment: data.comment,
      user: { id: this.userId(user) } as User,
      store,
      order,
    });
    const saved = await this.reviewRepo.save(review) as any;

    // Update store average rating
    const reviews = await this.reviewRepo.find({ where: { store: { id: store.id } } }) as any;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    store.averageRating = totalRating / reviews.length;
    store.reviewCount = reviews.length;
    await this.storeRepo.save(store);

    await this.auditService.log({
      user: { id: this.userId(user) } as User,
      module: 'reviews',
      action: 'review.created',
      entityType: 'review',
      entityId: saved.id.toString(),
      metadata: { rating: saved.rating, storeId: store.id }
    });

    return saved;
  }
}
