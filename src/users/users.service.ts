import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { tryCatch } from 'src/common/utils/helper.utils';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepo:Repository<User>){}

    async findByEmail(email: string){
        return await tryCatch( async ()=>{
            return this.usersRepo.findOne({where : {email}})
        })
    }

    async createUser(email: string, hashedPassword: string): Promise<User> {
        const user = this.usersRepo.create({ email, password: hashedPassword });
        return this.usersRepo.save(user);
      }
}
