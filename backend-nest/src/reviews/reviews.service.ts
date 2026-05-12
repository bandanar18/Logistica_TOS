import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Store } from '../stores/entities/store.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
    private auditService: AuditService,
  ) {}

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

  async create(data: any, user: User): Promise<Review> {
    const store = await this.storeRepo.findOne({ where: { id: data.storeId } });
    if (!store) throw new NotFoundException('Store not found');

    const review = this.reviewRepo.create({
      ...data,
      user,
      store
    });
    const saved = await this.reviewRepo.save(review) as any;

    // Update store average rating
    const reviews = await this.reviewRepo.find({ where: { store: { id: store.id } } }) as any;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    store.averageRating = totalRating / reviews.length;
    store.reviewCount = reviews.length;
    await this.storeRepo.save(store);

    await this.auditService.log({
      user,
      module: 'reviews',
      action: 'review.created',
      entityType: 'review',
      entityId: saved.id.toString(),
      details: { rating: saved.rating, storeId: store.id }
    });

    return saved;
  }
}
