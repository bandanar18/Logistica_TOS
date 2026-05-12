import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findAll(storeId?: string): Promise<import("./entities/review.entity").Review[]>;
    create(data: any, req: any): Promise<import("./entities/review.entity").Review>;
}
