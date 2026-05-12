import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { StoresService } from '../stores/stores.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private rolesService;
    private jwtService;
    private storesService;
    constructor(usersService: UsersService, rolesService: RolesService, jwtService: JwtService, storesService: StoresService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    register(userData: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
}
