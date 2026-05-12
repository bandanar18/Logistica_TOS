import { Container } from './container.entity';
import { Yard } from './yard.entity';
export declare class Move {
    id: number;
    container: Container;
    fromYard: Yard;
    toYard: Yard;
    fromLocation: string;
    toLocation: string;
    moveType: string;
    executedAt: Date;
}
